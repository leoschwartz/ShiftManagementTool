import { useEffect, useRef, useState } from "react";
import Theme1 from "./theme/Theme1";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuid } from "uuid";
import { addDays } from "../utils/getSundayOfWeek";
import { getCurrentUser } from "../api/getCurrentUser";
import Notification from "./utils/Notification";
import ShiftDetail from "./ShiftDetail";
import ShiftDetailEditor from "./ShiftDetailEditor";

function renderEventContent(eventInfo) {
  let desc = eventInfo.event.extendedProps.desc;
  if (desc && desc.length > 20) {
    desc = desc.slice(0, 20) + "...";
  }
  return (
    <>
      {eventInfo.event.allDay ? "All day" : eventInfo.timeText}:{" "}
      <b>{eventInfo.event.title}</b>
    </>
  );
}
//see bottom for props doc
function Schedule({ employeeId, propAllowEdits, propOnePage,
      propCreateShift, propDeleteShift, propGetSchedule, 
      propGetScheduleById, propGetShifts, propUpdateSchedule, propUpdateShift}) {
  const [userToken] = useAtom(userTokenAtom);
  const [currentEventsKey, setCurrentEventsKey] = useState(0); //Change to update display
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState(()=>{return ()=>{return []}}); //wtf
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isScheduleExist, setIsScheduleExist] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [deletedShiftIds, setDeletedShiftIds] = useState([]); //Array of deleted ids
  const [editedShifts, setEditedShifts] = useState([]); //Array of shifts that have been edited 
  const [addedShifts, setAddedShifts] = useState([]); //Array of new shifts
  const [error, setError] = useState("");
  const [modalKey, setModalKey] = useState(0); //Change to force update modal

  const calendarRangeStart = useRef(0);
  const calendarRangeEnd = useRef(0);

  let currentEvents = useRef([]); //Shifts that are directly updated to display
  let isInitialized = useRef(false);
  let schedule = useRef(null);
  let scheduleCache = useRef([]); // for dealing with large shift movement
  let currentUser = useRef(null);
  let calendarRef = useRef(null);

  // Helper - append or updates an item in a state array
  const setStateItem = (item, state, setState) => {
    const items = state;
    const pos = items.findIndex((i) => {return i.id == item.id});
    if (pos == -1)
      items.push(item);
    else
      items[pos] = item;
    setState(items);
  }
  // Helper - delete item that matches id or value if it exists from a state array
  const deleteStateItem = (item, state, setState) => {
    const items = state;
    const pos = items.findIndex((i) => {return i.id == item.id});
    if (pos != -1 && item.id != undefined)
      items.splice(pos,1);
    setState(items);
  }
  // Helper - return if state variable contains item that matches id or value
  const stateContains = (item, state) => {
    return state.includes(item) || state.findIndex((s) => {s.id == item.id}) != -1;
  }

  // Initialization and dataSource conversion
  useEffect(() => {
    // Initialization needs to *finish* before dataSource conversion, 
    // so the whole useEffect is wrapped in an async function so that we can use await
    const body = async () => {

      //Initialization
      if (!isInitialized.current) {
        currentUser.current = await getCurrentUser(userToken);
        await fetchCurrentShifts();
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi(); // Get the FullCalendar API
          calendarApi.removeAllEvents(); // Remove all existing events
          calendarApi.addEventSource(dataSource); // Add new events to the calendar
        }
        isInitialized.current = true;
      }

      // Convert the currentEvents to a dataSource that is compatible with the FullCalendar to allow rendering
      const newDataSource = async (fetchInfo) => {
        if (calendarRangeStart.current && calendarRangeEnd.current) {
          if (fetchInfo.start.getTime() != calendarRangeStart.current.getTime() || fetchInfo.end.getTime() != calendarRangeEnd.current.getTime()) {
            calendarRangeStart.current = fetchInfo.start;
            calendarRangeEnd.current = fetchInfo.end;
            await fetchCurrentShifts(calendarRangeStart.current, false); //Refresh currentEvents if calendar range changes & skip calendar update (we do that here)
          }
        } else {
          //initial run
          calendarRangeStart.current = fetchInfo.start;
          calendarRangeEnd.current = fetchInfo.end;
        }
        const ev = currentEvents.current.map((event) => {
          return {
            id: event.id,
            title: event.name,
            start: event.startTime,
            end: event.endTime,
            allDay: event.allDay,
          };
        });
        return ev;
      }
      setDataSource(() => newDataSource);
    }
    body();
  }, [currentEventsKey]);

  // Fetch and update Schedule and CurrentEvents objects
  const fetchCurrentShifts = async (currentDate = new Date(), doUpdateDataSource = true) => {
    try {
      const res = await propGetSchedule(
        userToken,
        employeeId,
        addDays(currentDate,1).toISOString() //hack! timezone issue in backend
      );
      if (res) {
        const startDate = new Date(res.startTime);
        const endDate = new Date(res.endTime);
        var shifts = await propGetShifts(
          userToken,
          employeeId,
          startDate,
          endDate
        );
        schedule.current = res;
        { //Apply queues
          //deleted
          shifts = shifts.filter(function(shift) {
            return (deletedShiftIds.find((id) => id == shift.id)) == undefined
          })
          //added
          for (const shift of addedShifts)
            shifts.push(shift);
          //edited
          for (var i = 0; i < shifts.length; i++) {
            const pos = editedShifts.findIndex((sh) => {return sh.id == shifts[i].id});
            if (pos != -1)
              shifts[i] = editedShifts[pos];
          }
        }
        currentEvents.current = shifts;
        if (doUpdateDataSource)
          setCurrentEventsKey(currentEventsKey + 1);
        setIsScheduleExist(true);
      } else {
        schedule.current = {id: null};
        currentEvents.current = [];
      }
    } catch (error) {
      setError(error.message);
    }
  }

  // Open a new shift
  const handleDateSelect = (selectInfo) => {
    if (propAllowEdits){//userAccessLevel == 1 ? true : false) {
      setSelectedEvent({
        id: null,
        startTime: selectInfo.start,
        endTime: selectInfo.end,
        allDay: selectInfo.allDay,
        employeeId: employeeId,
        createdBy: currentUser.current.id,
        parentSchedule: schedule.current.id,
        name: "",
        desc: "",
        location: "",
      });
      setModalKey(modalKey + 1);
      setIsFormModalOpen(true);
    }
  };

  // Open an existing shift
  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const event = currentEvents.current.find((event) => event.id === eventId);
    setSelectedEvent(event);
    setModalKey(modalKey + 1);
    if (propAllowEdits)
      setIsFormModalOpen(true);
    else
      setIsViewModalOpen(true);
  };

  // Handle when a change is saved to a shift
  const submitFormHandler = (shift) => {
    const oldShift = currentEvents.current.find((event) => event.id === shift.id);
    if (oldShift) {
      if (oldShift.startTime.getTime() != shift.startTime.getTime() || oldShift.endTime.getTime() != shift.endTime.getTime())
        shift.parentSchedule = null; //may have been moved too far, let save function handle it
    }
    if (shift.id == null) {
      // Saving new shift
      shift.id = uuid();
      setStateItem(shift, addedShifts, setAddedShifts);
    }
    else {
      // Editing existing shift
      if (stateContains(shift, addedShifts))
        setStateItem(shift, addedShifts, setAddedShifts);
      else
        setStateItem(shift, editedShifts, setEditedShifts);
    }
    const pos = currentEvents.current.findIndex((i) => {return i.id == shift.id});
    if (pos != -1)
      currentEvents.current[pos] = shift;
    else
      currentEvents.current.push(shift);
    //setStateItem(shift,currentEvents, setCurrentEvents);
    setCurrentEventsKey(currentEventsKey + 1);
    setIsFormModalOpen(false);
  };

  // Handle when a deletion is saved
  const deleteFormHandler = (shift) => {
    if (!stateContains(shift, addedShifts)) {
      setStateItem(shift.id, deletedShiftIds, setDeletedShiftIds);
    }
    deleteStateItem(shift, addedShifts, setAddedShifts);
    deleteStateItem(shift, editedShifts, setEditedShifts);
    const pos = currentEvents.current.findIndex((i) => {return i.id == shift.id});
    if (pos != -1)
      currentEvents.current.splice(pos,1);
    setCurrentEventsKey(currentEventsKey + 1);
    setIsFormModalOpen(false);
  }

  // Handle when an event is moved/resized
  const handleEventDrop = (eventDropInfo) => {
    const shift = currentEvents.current.find((event) => event.id == eventDropInfo.event.id);
    shift.startTime = eventDropInfo.event.start;
    shift.endTime = eventDropInfo.event.end;
    shift.allDay = eventDropInfo.event.allDay;
    if (shift.parentSchedule != null) //mild optimization - only handle this case in onSubmit
      checkScheduleBounds(shift);
    if (stateContains(shift, addedShifts))
      setStateItem(shift, addedShifts, setAddedShifts);
    else
      setStateItem(shift, editedShifts, setEditedShifts);
  }

  // After a shift is moved, ensure that it's in the correct schedule, or null if none apply
  // Also used to find a valid schedule for shifts without one
  // There's a very good reason I wanted to handle this on the backend, and this is it
  // PROBLEM - ASSUMES SHIFTS CANNOT BE IN MULTIPLE SCHEDULE TIME FRAMES - USES START TIME INSTEAD
  const checkScheduleBounds = async (shift) => {
    // Push saved schedule
    if (scheduleCache.current.findIndex((i) => {return i.id == schedule.current.id}) == -1)
      scheduleCache.current.push(schedule.current);
    // Check current schedule if it has one
    if (shift.parentSchedule != null) {
      var pos = scheduleCache.current.findIndex((i) => {return i.id == shift.parentSchedule});
      if (pos == -1) {
        const lostSchedule = await propGetScheduleById(userToken, shift.parentSchedule);
        if (!lostSchedule)
          console.error("lostSchedule is null! Asked for ID + " + shift.parentSchedule);
        scheduleCache.current.push(lostSchedule);
        pos = scheduleCache.current.length - 1;
      }
      //Check the shift is in an acceptable schedule
      if (shift.startTime <= scheduleCache.current[pos].endTime && shift.startTime >= scheduleCache.current[pos].startTime)
        return;
    }

    //Unacceptable schedule - check the cache for a usable schedule
    pos = scheduleCache.current.findIndex((schedule) => schedule.startTime < shift.startTime && schedule.endTime > shift.startTime);
    if (pos != -1) {
      shift.parentSchedule = scheduleCache.current[pos].id;
      return;
    }
    //Very unacceptable schedule - ask the server for an acceptable schedule
    const res = await propGetSchedule(
      userToken,
      employeeId,
      shift.startTime.toISOString()
    );
    if (res) {
      scheduleCache.current.push(res);
      shift.parentSchedule = res.id;
      return;
    }
    //No acceptable schedule exists!
    shift.parentSchedule = null;
  }

  // Send changes to backend
  const saveNewSchedule = async() => { 
    //parentSchedule may be null at this point, but that will be handled by the server.
    if (schedule.current.id) {
      await propUpdateSchedule(userToken, schedule.current.id, {
        addMultipleShifts: addedShifts.map((shift) => shift.id),
        removeMultipleShifts: deletedShiftIds,
      });
    }
    
    for (const shift of addedShifts)
      await propCreateShift(userToken, shift);
    setAddedShifts([]);
    for (const shiftId of deletedShiftIds)
      await propDeleteShift(userToken, shiftId);
    setDeletedShiftIds([]);
    for (const shift of editedShifts)
      await propUpdateShift(userToken, shift);
    setEditedShifts([]);
    setIsSaved(true);

  };

  // Reset all queued changes
  const resetSchedule = async () => {
    try {
      if (isScheduleExist) {
        setDeletedShiftIds([]);
        setEditedShifts([]);
        setAddedShifts([]);
        schedule.current = null;
        setIsScheduleExist(false);
      }
      currentEvents.current = [];
      setCurrentEventsKey(currentEventsKey + 1);
      fetchCurrentShifts();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <ShiftDetail
        shift={selectedEvent}
        isModalOpen={isViewModalOpen}
        closeModal={() => setIsViewModalOpen(false)}
        key={modalKey + "V"}
      />
      <ShiftDetailEditor
        shift={selectedEvent}
        isModalOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        onSubmit={submitFormHandler}
        onDelete={deleteFormHandler}
        key={modalKey + "E"}
      />
      <Theme1 />
      <div className="">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: !propOnePage ? "prev,next today" : null,
            center: !propOnePage ? "title" : null, //should add something to oneday toolbar?
            right: !propOnePage ? "timeGridWeek,timeGridDay" : null,
          }}
          initialView="timeGridWeek"
          editable={propAllowEdits}
          selectable={propAllowEdits}
          selectMirror={true}
          height="80vh"
          dayMaxEvents={true}
          events={dataSource}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventDrop}
          validRange={
            propOnePage ? {start: '1900-01-07',
            end: '1900-01-14'} : null
          }
          dayHeaderFormat={propOnePage ? {weekday: 'long'} : null}
          ref={calendarRef}
        />
        {isSaved && (
          <Notification
            message="Your schedule has been saved successfully."
            showCloseButton={true}
            onClose={() => setIsSaved(false)}
            type="success"
          />
        )}

        {error !== "" && (
          <Notification
            message={error}
            showCloseButton={true}
            onClose={() => setError("")}
            type="error"
          />
        )}
        <div
          id="buttonSet"
          className={`flex items-center justify-center my-5 ${
            propAllowEdits ? "" : "hidden"
          }`}
        >
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 disabled:opacity-50"
            onClick={saveNewSchedule}
          >
            Save
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={resetSchedule}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

Schedule.propTypes = {
  employeeId: PropTypes.string.isRequired, //employee who's schedule is being viewed
  propAllowEdits: PropTypes.bool.isRequired, //If the user has authority to edit the schedule
  propOnePage: PropTypes.bool.isRequired, //todo
  //api
  propCreateShift: PropTypes.func, //called when saving with a new shift
  propDeleteShift: PropTypes.func, //called when saving with a deleted shift
  propGetSchedule: PropTypes.func.isRequired, //fetches the schedule object for the visible time
  propGetScheduleById: PropTypes.func.isRequired, //fetches *a* schedule object. this probably isn't required if propOnePage=false 
  propGetShifts: PropTypes.func.isRequired, //fetches shifts for a schedule object
  propUpdateSchedule: PropTypes.func, //called for each schedule containing changes for saving
  propUpdateShift: PropTypes.func, //ditto for shifts

};
export default Schedule;
