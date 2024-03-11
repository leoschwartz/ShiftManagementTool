import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuid } from "uuid";
import Theme1 from "./theme/Theme1";
import ShiftDetailEditor from "./ShiftDetailEditor";
import { getSchedule } from "../api/getSchedule";
import { getScheduleById } from "../api/getScheduleById"
import { useAtom } from "jotai";
import { userTokenAtom, userAccessLevelAtom } from "../globalAtom";
import { getShifts } from "../api/getShifts";
import { createSchedule } from "../api/createSchedule";
import PropTypes from "prop-types";
import { createShift } from "../api/createShift";
import { updateSchedule } from "../api/updateSchedule";
import { getSundayOfWeek } from "../utils/getSundayOfWeek";
//import { getCurrentUser } from "../api/getCurrentUser";
import { deleteShift } from "../api/deleteShift";
import Notification from "./utils/Notification";
//import ShiftDetail from "./ShiftDetail";

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

function Schedule({ employeeId }) {
  const [userToken] = useAtom(userTokenAtom);
  const [userAccessLevel] = useAtom(userAccessLevelAtom);
  const [currentEvents, setCurrentEvents] = useState([]); //Shifts that are directly updated to display
  const [currentEventsKey, setCurrentEventsKey] = useState(0); //Change to update display
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
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

  let schedule = useRef(null);
  let scheduleCache = useRef([]); // for dealing with large shift movement
  let currentUser = useRef(null);
  let calendarRef = useRef(null);

  // Helper - append or updates an item in a state array
  const setStateItem = (item, state, setState) => {
    const items = state;
    const pos = items.findIndex((i) => {return i.id == item.id});
    if (pos == -1 && item.id != undefined)
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

  // Initialization
  useEffect(() => {
    fetchCurrentShifts().then(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi(); // Get the FullCalendar API
        calendarApi.removeAllEvents(); // Remove all existing events
        calendarApi.addEventSource(dataSource); // Add new events to the calendar
      }
    });
  }, []);

  // Convert the currentEvents to a dataSource that is compatible with the FullCalendar to allow rendering
  useEffect(() => {
    const newDataSource = async (fetchInfo) => {
      if (calendarRangeStart.current && calendarRangeEnd.current) {
        if (fetchInfo.start.getTime() != calendarRangeStart.current.getTime() || fetchInfo.end.getTime() != calendarRangeEnd.current.getTime()) {
          calendarRangeStart.current = fetchInfo.start;
          calendarRangeEnd.current = fetchInfo.end;
          await fetchCurrentShifts(false); //Refresh currentEvents if calendar range changes & skip calendar update (we do that here)
        }
      } else {
        //initial run
        calendarRangeStart.current = fetchInfo.start;
        calendarRangeEnd.current = fetchInfo.end;
      }
      const ev = currentEvents.map((event) => {
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
    //calendarRef.current.getApi().refetchEvents();
  }, [currentEventsKey]);

  // Fetch and update Schedule and CurrentEvents objects
  const fetchCurrentShifts = async (doUpdateDataSource = true) => {
    try {
    const currentDate = new Date();
      const res = await getSchedule(
        userToken,
        employeeId,
        currentDate.toISOString()
      );
      if (res) {
        const startDate = new Date(res.startTime);
        const endDate = new Date(res.endTime);
        var shifts = await getShifts(
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
        setCurrentEvents(shifts);
        if (doUpdateDataSource)
          setCurrentEventsKey(currentEventsKey + 1);
        setIsScheduleExist(true);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  // Open a new shift
  const handleDateSelect = (selectInfo) => {
    setSelectedEvent({
      id: null,
      startTime: selectInfo.start,
      endTime: selectInfo.end,
      allDay: selectInfo.allDay,
      employeeId: employeeId,
      createdBy: currentUser.current,
      parentSchedule: schedule.current.id,
      name: "",
      desc: "",
      location: "",
    });
    setModalKey(modalKey + 1);
    setIsFormModalOpen(true);
  };

  // Open an existing shift
  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const event = currentEvents.find((event) => event.id === eventId);
    setSelectedEvent(event);
    setModalKey(modalKey + 1);
    setIsFormModalOpen(true);
  };

  // Handle when a change is saved to a shift
  const submitFormHandler = (shift) => {
    const oldShift = currentEvents.find((event) => event.id === shift.id);
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
    setStateItem(shift,currentEvents, setCurrentEvents);
    setCurrentEventsKey(currentEventsKey + 1);
    setIsFormModalOpen(false);
  };

  // Handle when a deletion is saved
  const deleteFormHandler = (shift) => {
    if (!stateContains(shift, addedShifts))
      setStateItem(shift.id, deletedShiftIds, setDeletedShiftIds);
    deleteStateItem(shift, addedShifts, setAddedShifts);
    deleteStateItem(shift, editedShifts, setEditedShifts);
    deleteStateItem(shift, currentEvents, setCurrentEvents);
    setCurrentEventsKey(currentEventsKey + 1);
    setIsFormModalOpen(false);
  }

  // Handle when an event is moved/resized
  const handleEventDrop = (eventDropInfo) => {
    const shift = currentEvents.find((event) => event.id == eventDropInfo.event.id);
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
        const lostSchedule = await getScheduleById(userToken, shift.parentSchedule);
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
    const res = await getSchedule(
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
  //This whole thing doesn't work. What if some shifts have schedules and some don't?
  //TODO - full rewrite
  //Each shift needs to be checked for a schedule, if one is missing, generate new one then try to apply it to other shifts
  //Add new schedules to cache!!!!! Then u can use checkScheduleBounds!
  const saveNewSchedule = async () => {
    let res = null;
    try {
      // if the schedule already exists, update it
      if (isScheduleExist) {
        { // Deleted shifts
          if (deletedShiftIds.length > 0) {
            for (let i = 0; i < deletedShiftIds.length; i++) {
              await deleteShift(userToken, deletedShiftIds[i]);
            }
            // update the schedule
            if (deletedShiftIds.length > 1) {
              res = await updateSchedule(userToken, schedule.current.id, {
                removeMultipleShifts: deletedShiftIds,
              });
            } else if (deletedShiftIds.length === 1) {
              res = await updateSchedule(userToken, schedule.current.id, {
                removeShift: deletedShiftIds[0],
              });
            }
            setDeletedShiftIds([]);
          }
        }
        { // New shifts
          // Create a new instance for each shift
          for (let i = 0; i < addedShifts.length; i++) {
            await createShift(userToken, addedShifts[i]);
          }

          // update the schedule
          if (addedShifts.length > 1) {
            res = await updateSchedule(userToken, schedule.current.id, {
              addMultipleShifts: addedShifts.map((shift) => shift.id),
            });
          } else if (addedShifts.length === 1) {
            res = await updateSchedule(userToken, schedule.current.id, {
              addShift: addedShifts[0].id,
            });
          }
          setAddedShifts([]);
        }
        { // Edited shifts
          //do rewrite instead
          setEditedShifts([]);
        }
      }
      // Create new schedule
      else {
        if (deletedShiftIds.length > 0 || editedShifts.length > 0)
          throw "Shifts were deleted or edited without a schedule!"; //Needs more thought.. shouldn't happen?
        res = await createSchedule(userToken, {
          shiftIdList: addedShifts.map((event) => event.id),
          startTime: getSundayOfWeek(),
          employeeId: employeeId,
        });
        const scheduleId = res.id;
        schedule.current = res.schedule;
        setIsScheduleExist(true);
        const shifts = addedShifts.map((event) => {
          return {
            ...event,
            parentSchedule: scheduleId,
          };
        });
        for (let i = 0; i < shifts.length; i++) {
          await createShift(userToken, shifts[i]);
        }
      }
      if (res) {
        setIsSaved(true);
        setAddedShifts([]);
        schedule.current = res;
      }
    } catch (error) {
      setError(error.message);
    }
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
      setCurrentEvents([]);
      setCurrentEventsKey(currentEventsKey + 1);
      fetchCurrentShifts();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <ShiftDetailEditor
        shift={selectedEvent}
        isModalOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        onSubmit={submitFormHandler}
        onDelete={deleteFormHandler}
        key={modalKey}
      />
      <Theme1 />
      <div className="">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          initialView="timeGridWeek"
          editable={userAccessLevel == 1 ? true : false}
          selectable={userAccessLevel == 1 ? true : false}
          selectMirror={true}
          height="80vh"
          dayMaxEvents={true}
          events={dataSource}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventDrop}
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
            userAccessLevel == 1 ? "" : "hidden"
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
  employeeId: PropTypes.string.isRequired,
};
export default Schedule;
