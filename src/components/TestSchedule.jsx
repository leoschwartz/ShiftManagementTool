import { useEffect, useState } from "react";
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

function renderEventContent(eventInfo) {
  console.log(eventInfo);
  let desc = eventInfo.event.extendedProps.desc;
  if (desc && desc.length > 20) {
    desc = desc.slice(0, 20) + "...";
  }
  return (
    <div>
      <p>{eventInfo.timeText}</p>
      <p>
        <b>{eventInfo.event.title}</b>
      </p>
      {desc && desc.length > 0 && (
        <p className="hidden sm:inline">Desc: {desc}</p>
      )}
    </div>
  );
}

function TestSchedule() {
  // store a list of events that will be saved into the database
  const [userToken] = useAtom(userTokenAtom);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // convert the currentEvents to a dateSource that is compatible with the FullCalendar to allow rendering
  const [dataSource, setDataSource] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isScheduleExist, setIsScheduleExist] = useState(false);
  //   Fetch a list of shifts from the database
  useEffect(() => {
    // TODO: Fetch the schedule from the database and a list of shifts from the database
    // const currentDate = new Date();
    // const fetchDate = async () => {
    //   const res = await getSchedule(userToken, 1, currentDate);
    //   if (res) {
    //     setCurrentEvents(res);
    //     setIsScheduleExist(true);
    //   }
    // };
    // fetchDate();
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

  const saveNewSchedule = () => {
    // TODO: Save the currentEvents into the database
    console.log("saveNewSchedule");
  };
  const resetSchedule = () => {
    // TODO: Fetch the schedule from the database and a list of shifts from the database again to reset the schedule
    console.log("resetSchedule");
    setCurrentEvents([]);
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
export default TestSchedule;
