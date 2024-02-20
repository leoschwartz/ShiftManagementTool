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
import { ShiftSchedule } from "../models/shiftSchedule";
import { getShifts } from "../api/getShifts";
import { createSchedule } from "../api/createSchedule";
import PropTypes from "prop-types";
import { createShift } from "../api/createShift";
import { updateSchedule } from "../api/updateSchedule";
import { getMondayOfWeek } from "../utils/getMondayOfWeek";

function renderEventContent(eventInfo) {
  console.log(eventInfo);
  let desc = eventInfo.event.extendedProps.desc;
  if (desc && desc.length > 20) {
    desc = desc.slice(0, 20) + "...";
  }
  return (
    <>
      {eventInfo.timeText}: <b>{eventInfo.event.title}</b>
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

  let schedule = useRef(null);
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
    fetchDate();
  }, []);
  useEffect(() => {
    const newDataSource = currentEvents.map((event) => {
      return {
        id: event.id,
        title: event.name,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        extendedProps: {
          desc: event.desc,
        },
      };
    });
    setDataSource(newDataSource);
  }, [currentEvents]);

  useEffect(() => {
    if (selectedEvent && "name" in selectedEvent) {
      setCurrentEvents((events) => {
        const newEvents = [selectedEvent, ...events];
        return newEvents;
      });
    }
  }, [selectedEvent]);
  const handleDateSelect = (selectInfo) => {
    setSelectedEvent({
      id: uuid(),
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
    setIsFormModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
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
        start: ev.start,
        end: ev.end,
        allDay: ev.allDay,
      };
    });

    event.target.name.value = "";
    event.target.desc.value = "";
    event.target.location.value = "";
    setIsFormModalOpen(false);
  };

  const saveNewSchedule = async () => {
    let res = null;
    // Get a list of new shifts
    const newShifts = currentEvents.filter((event) => {
      return !schedule.current.shiftIdList.includes(event.id);
    });
    // Create a new instance for each shift
    for (let i = 0; i < newShifts.length; i++) {
      await createShift(userToken, newShifts[i]);
    }
    // update the schedule
    if (isScheduleExist) {
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
        startTime: getMondayOfWeek(),
        employeeId: schedule.current.employeeId,
      });
    }
    if (res) {
      console.log(res);
      setIsSaved(true);
    }
  };
  const resetSchedule = async () => {
    const startDate = schedule.current.startTime;
    const endDate = schedule.current.endTime;
    const shifts = await getShifts(userToken, employeeId, startDate, endDate);
    setCurrentEvents(shifts);
  };

  return (
    <>
      <ScheduleAddFullEmptyForm
        isModalOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        selectedEvent={selectedEvent}
        onSubmit={submitFormHandler}
      />
      <Theme1 />
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
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
        <div id="buttonSet" className="flex items-center justify-center my-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
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

TestSchedule.propTypes = {
  employeeId: PropTypes.string.isRequired,
};
export default TestSchedule;
