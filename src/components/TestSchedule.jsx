import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuid } from "uuid";
import Theme1 from "./theme/Theme1";
import ScheduleAddFullEmptyForm from "./ScheduleAddFullEmptyForm";
import { getSchedule } from "../api/getSchedule";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
import { getShifts } from "../api/getShifts";
import { createSchedule } from "../api/createSchedule";
import PropTypes from "prop-types";
import { createShift } from "../api/createShift";
import { updateSchedule } from "../api/updateSchedule";
import { getSundayOfWeek } from "../utils/getSundayOfWeek";
import { getCurrentUser } from "../api/getCurrentUser";
import { deleteShift } from "../api/deleteShift";
import SuccessfulNotification from "./utils/SuccessfulNotification";
import ShiftDetail from "./ShiftDetail";

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

function TestSchedule({ employeeId }) {
  // store a list of events that will be saved into the database
  const [userToken] = useAtom(userTokenAtom);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // convert the currentEvents to a dateSource that is compatible with the FullCalendar to allow rendering
  const [dataSource, setDataSource] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isScheduleExist, setIsScheduleExist] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [deletedShiftIds, setDeletedShiftIds] = useState([]);

  let schedule = useRef(null);
  let currentUser = useRef(null);
  //   Fetch a list of shifts from the database
  useEffect(() => {
    const currentDate = new Date();
    const fetchDate = async () => {
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

        setCurrentEvents(shifts);
        setIsScheduleExist(true);
      }
    };
    const fetchUser = async () => {
      currentUser.current = await getCurrentUser(userToken);
    };
    fetchDate();
    fetchUser();
  }, []);
  //  Convert the currentEvents to a dataSource that is compatible with the FullCalendar to allow rendering
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
  }, [currentEvents]);

  // add the selected event to the currentEvents
  useEffect(() => {
    if (selectedEvent && isFormSubmitted) {
      setCurrentEvents((events) => {
        const scheduleId = schedule.current && schedule.current.id;
        const newEvents = [
          {
            ...selectedEvent,
            employeeId: employeeId,
            createdBy: currentUser.current.id,
            parentSchedule: scheduleId,
          },
          ...events,
        ];
        return newEvents;
      });
      setIsFormSubmitted(false);
    }
  }, [selectedEvent]);

  const handleDateSelect = (selectInfo) => {
    setSelectedEvent({
      id: uuid(),
      startTime: selectInfo.startStr,
      endTime: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
    setIsFormModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const event = currentEvents.find((event) => event.id === eventId);
    setSelectedEvent({ ...event, createdBy: currentUser.current });
    // clickInfo.event.remove();
    setIsDetailModalOpen(true);
  };

  const submitFormHandler = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const desc = event.target.desc.value;
    const location = event.target.location.value;
    setSelectedEvent((ev) => {
      return {
        name: name,
        desc: desc,
        location: location,
        id: ev.id,
        startTime: ev.startTime,
        endTime: ev.endTime,
        allDay: ev.allDay,
      };
    });

    event.target.name.value = "";
    event.target.desc.value = "";
    event.target.location.value = "";
    setIsFormModalOpen(false);
    setIsFormSubmitted(true);
  };

  // add the removed shift id to the deletedShiftIds list (only delete the shift from the database when the schedule is saved)
  const addRemovedShiftToList = (shiftId) => {
    setDeletedShiftIds((ids) => {
      return [...ids, shiftId];
    });
    setCurrentEvents((events) => {
      return events.filter((event) => event.id !== shiftId);
    });
    setIsDetailModalOpen(false);
  };

  const saveNewSchedule = async () => {
    let res = null;
    // if the schedule already exists, update it
    if (isScheduleExist) {
      // Delete the shifts that are removed and already in the database
      const deletedShifts = deletedShiftIds.filter((id) => {
        return schedule.current.shiftIdList.includes(id);
      });
      for (let i = 0; i < deletedShifts.length; i++) {
        await deleteShift(userToken, deletedShifts[i]);
      }
      setDeletedShiftIds([]);
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
        res = await updateSchedule(userToken, employeeId, {
          addMultipleShifts: newShifts.map((shift) => shift.id),
        });
      } else if (newShifts.length === 1) {
        res = await updateSchedule(userToken, employeeId, {
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
  };
  const resetSchedule = async () => {
    if (isScheduleExist) {
      const startDate = schedule.current.startTime;
      const endDate = schedule.current.endTime;
      const shifts = await getShifts(userToken, employeeId, startDate, endDate);
      setCurrentEvents(shifts);
    } else {
      setCurrentEvents([]);
    }
  };

  return (
    <>
      <ScheduleAddFullEmptyForm
        isModalOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        selectedEvent={selectedEvent}
        onSubmit={submitFormHandler}
      />
      <ShiftDetail
        shift={selectedEvent}
        isModalOpen={isDetailModalOpen}
        closeModal={() => setIsDetailModalOpen(false)}
        onDelete={(id) => addRemovedShiftToList(id)}
      />
      <Theme1 />
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          initialView="dayGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={dataSource}
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
        />
        {isSaved && (
          <SuccessfulNotification
            message="Your schedule has been saved successfully."
            showCloseButton={true}
            onClose={() => setIsSaved(false)}
          />
        )}
        <div id="buttonSet" className="flex items-center justify-center my-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 disabled:opacity-50"
            onClick={saveNewSchedule}
            disabled={
              deletedShiftIds.length === 0 ||
              isSaved ||
              (schedule.current != null &&
                schedule.current.shiftIdList.length === currentEvents.length &&
                deletedShiftIds.length === 0)
            }
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

TestSchedule.propTypes = {
  employeeId: PropTypes.string.isRequired,
};
export default TestSchedule;
