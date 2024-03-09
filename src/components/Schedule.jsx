import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuid } from "uuid";
import Theme1 from "./theme/Theme1";
import ShiftDetailEditor from "./ShiftDetailEditor";
import { getSchedule } from "../api/getSchedule";
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
  const [dataSource, setDataSource] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isScheduleExist, setIsScheduleExist] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [deletedShiftIds, setDeletedShiftIds] = useState([]); //Array of deleted ids
  const [editedShifts, setEditedShifts] = useState([]); //Array of shifts that have been edited 
  const [addedShifts, setAddedShifts] = useState([]); //Array of new shifts
  const [error, setError] = useState("");
  const [modalKey, setModalKey] = useState(0); //Change to force update modal

  let schedule = useRef(null);
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
    fetchCurrentShifts();
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi(); // Get the FullCalendar API
      calendarApi.removeAllEvents(); // Remove all existing events
      calendarApi.addEventSource(dataSource); // Add new events to the calendar
    }
  }, []);

  // Convert the currentEvents to a dataSource that is compatible with the FullCalendar to allow rendering
  useEffect(() => {
    const newDataSource = currentEvents.map((event) => {
      return {
        id: event.id,
        title: event.name,
        start: event.startTime,
        end: event.endTime,
        allDay: event.allDay,
      };
    });
    setDataSource(newDataSource);
  }, [currentEvents, currentEventsKey]);

  // Fetch and update Schedule and CurrentEvents objects
  const fetchCurrentShifts = async () => {
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
        const shifts = await getShifts(
          userToken,
          employeeId,
          startDate,
          endDate
        );
        schedule.current = res;
        //todo - apply queues
        setCurrentEvents(shifts);
        setCurrentEventsKey(currentEventsKey + 1);
        setIsScheduleExist(true);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  // Open a new shift - todo placeholders
  const handleDateSelect = (selectInfo) => {
    //let endTime = selectInfo.end;
    //endTime.setMinutes(endTime.getMinutes() - 1);
    setSelectedEvent({
      id: null,
      startTime: selectInfo.startStr,
      endTime: selectInfo.endStr,
      allDay: selectInfo.allDay,
      name: "name",
      desc: "td",
      location: "tl",
    });
    setModalKey(modalKey + 1);
    setIsFormModalOpen(true);
  };

  // Open an existing shift
  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const event = currentEvents.find((event) => event.id === eventId);
    setSelectedEvent({ ...event, createdBy: currentUser.current });
    setModalKey(modalKey + 1);
    setIsFormModalOpen(true);
  };

  // Handle when a change is saved to a shift
  const submitFormHandler = (shift) => {
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
    console.log(eventDropInfo);
    //TODO
  }

  // Send changes to backend - todo
  const saveNewSchedule = async () => {
    let res = null;
    try {
      // if the schedule already exists, update it
      if (isScheduleExist) {
        // Delete the shifts that are removed and already in the database
        const deletedShifts = deletedShiftIds.filter((id) => {
          return schedule.current.shiftIdList.includes(id);
        });
        if (deletedShifts.length > 0) {
          for (let i = 0; i < deletedShifts.length; i++) {
            await deleteShift(userToken, deletedShifts[i]);
          }
          // update the schedule
          if (deletedShifts.length > 1) {
            res = await updateSchedule(userToken, schedule.current.id, {
              removeMultipleShifts: deletedShifts,
            });
          } else if (deletedShifts.length === 1) {
            res = await updateSchedule(userToken, schedule.current.id, {
              removeShift: deletedShifts[0],
            });
          }
          setDeletedShiftIds([]);
        }

        // Get a list of new shifts
        const newShifts = currentEvents.filter((event) => {
          return !schedule.current.shiftIdList.includes(event.id);
        });
        // Create a new instance for each shift
        for (let i = 0; i < newShifts.length; i++) {
          await createShift(userToken, newShifts[i]);
        }

        // update the schedule
        if (newShifts.length > 1) {
          res = await updateSchedule(userToken, schedule.current.id, {
            addMultipleShifts: newShifts.map((shift) => shift.id),
          });
        } else if (newShifts.length === 1) {
          res = await updateSchedule(userToken, schedule.current.id, {
            addShift: newShifts[0].id,
          });
        }
      }
      // or create a new one
      else {
        res = await createSchedule(userToken, {
          shiftIdList: currentEvents.map((event) => event.id),
          startTime: getSundayOfWeek(),
          employeeId: employeeId,
        });
        const scheduleId = res.id;
        schedule.current = res.schedule;
        setIsScheduleExist(true);
        const shifts = currentEvents.map((event) => {
          return {
            ...event,
            scheduleId: scheduleId,
            startTime: event.startTime,
            endTime: event.endTime,
          };
        });
        for (let i = 0; i < shifts.length; i++) {
          await createShift(userToken, shifts[i]);
        }
      }
      if (res) {
        setIsSaved(true);
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
        const deletedShifts = schedule.current.shiftIdList;
        for (let i = 0; i < deletedShifts.length; i++) {
          await deleteShift(userToken, deletedShifts[i]);
        }
        setDeletedShiftIds([]);
        setEditedShifts([]);
        setAddedShifts([]);
        schedule.current = null;
        setIsScheduleExist(false);
      }
      setCurrentEvents([]);
      setCurrentEventsKey(currentEventsKey + 1);
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
          // todo - page changing
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
            // Currently, there are too many conditions to enable/disable the save button
            // disabled={
            //   deletedShiftIds.length === 0 ||
            //   isSaved ||
            //   (schedule.current != null &&
            //     schedule.current.shiftIdList.length === currentEvents.length &&
            //     deletedShiftIds.length === 0)
            // }
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
