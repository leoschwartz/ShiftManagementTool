import { useRef , useState } from "react";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
//import editablePlugin from '@fullcalendar/interaction'
import styled from "@emotion/styled";
import { getEvents } from "../common/Shift"
import { getShift } from "../api/getShift";

const ScheduleView = ({ scheduleUser }) => {
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [activeEvent, setActiveEvent] = useState({});
  const [initialized, setInitialized] = useState(false);
  const calendarRef = useRef({});
  var renderedCalendar;

  //HACK!!
  var StartTime = new Date();
  StartTime.setDate(StartTime.getDate() - (StartTime.getDay() + 6) % 7);
  const calendarStateHack = useRef({
    events: [],
    scroll: 0,
    visibleRange: StartTime
  });
  function saveStateHack() {
    if (!calendarRef) {console.warn("Missing calendarRef!");return 0}
    const ar = calendarRef.current.getApi().currentData.dateProfile.activeRange;
    calendarStateHack.current = {
      events: calendarRef.current.getApi().getEvents(),
      //scroll: document.querySelector(".fc-scroller-liquid-absolute").scrollHeight,
      visibleRange: ar.start.toLocaleDateString([], {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
      })
    };
  }
  /*function loadStateHack() {
    console.log("Loading! " + Date.now());
    calendarRef.current.getApi().visibleRange = calendarStateHack.visibleRange;
    //document.querySelector(".fc-scroller-liquid-absolute").scrollHeight = calendarStateHack.scroll;
  }*/

  if (!initialized) {
    getEvents(scheduleUser, {visibleRange: "DATA MISSING!"}).then(function(env) {
      console.warn("Check for multiple render phases!");
      //https://legacy.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects
      //https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
      calendarStateHack.current.events = env;
      setInitialized(true);
    });
    return <div></div>; //await getEvents callback
  }
  var pseudoNow = new Date();
  if (pseudoNow.getHours() > 2) pseudoNow.setHours(pseudoNow.getHours() - 2); //center on now instead of top
  const options = {
    plugins: [ timeGridPlugin/*,editablePlugin*/ ],
    //editable: true,
    ref: calendarRef,
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    allDaySlot: false,
    slotDuration:"00:05:00",
    slotLabelInterval:"01:00",
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: 'short'
    },
    //Move time header to absolute
    slotLaneDidMount : function(arg) {
      if (arg.el.parentNode.childNodes[0].childNodes.length > 0) {
        const timeHeader = arg.el.parentNode.childNodes[0].childNodes[0].childNodes[0];
        timeHeader.style = "font-size:16pt; position:absolute;width:0px; text-wrap: nowrap; margin-top:-8px"
      }
    },
    //this should maybe be configurable? something for the future
    //slotMinTime: { "05:00:00"},
    //slotMaxTime: { "20:00:00"},
    weekends: false,
    //hiddenDays: //worth considering if we could hide empty days...
    dayHeaderFormat: { weekday: 'short' },
    businessHours : true, //good for prototype, unsure if permanent
    scrollTime : pseudoNow.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}),
    initialDate: calendarStateHack.current.visibleRange,
    scrollTimeReset: false,
    //validRange : //depending on how generator works we might want this
    nowIndicator : true,
    height: 512,
    eventColor: "var(--forth)",
    events: async (fetchInfo, successCallback) => {
      //const events = await getEvents(scheduleUser, fetchInfo);
      //successCallback(events);
      successCallback(calendarStateHack.current.events);
    },
    eventClick: async (eventClickInfo) => {
      const e = await getShift(eventClickInfo.event.extendedProps.eventId);
      saveStateHack()
      setActiveEvent(e);
      setShowViewPanel(true);
    },
  };
  renderedCalendar = {current: <FullCalendar {...options}/> };

  //fullcalendar styling is either this or a bootstrap style
  // td { font-size: 3pt; } controls the entire chart scale!!!
  const TableStyleWrapper = styled.div`
  td, th, table {
    border-color: #222 !important;
  }
  td {
    font-size: 3pt;
  }
  button {
    background-color: var(--forth) !important;
  }
  button:hover {
    background-color: var(--fifth) !important;
  }
  .fc-button-active {
    background-color: var(--third) !important;
  }
  #fc-dom-2 {
    margin-left: 6px;
    margin-right:6px;
    font-size:16pt !important;
  }
  .fc-event {
    font-size: 12pt;
  }
  .gridBlock {
    min-width: 400px;
  }`
  return (
    <section className="relative w-full" id="schedule">

      {showViewPanel && (
        <div className="fixed inset-0 flex text-center items-center justify-center bg-black bg-opacity-50 p-8 z-10" 
            onClick={() => {
              saveStateHack();
              setShowViewPanel(false);
            }}>
          <div className="inline-block w-6/12 h-full m-auto align-top gridBlock mb-6">
            <div className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600">
              <hr className="mb-2 border-black"/>
              <h2 id="shiftData-name" className="text-2xl ml-5 mr-5 rounded p-0.5 bg-forth text-white font-bold">{activeEvent.name}</h2>
              <div id="shiftData-date" className="mt-2 text-neutral-200">
                {activeEvent.startTime.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'})}
              </div>
              <div id="shiftData-time" className="mt-2 text-neutral-200">
                {activeEvent.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' - ' + activeEvent.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div className="mt-2">Manager/Supervisor: <span className="text-neutral-200">{activeEvent.assigner}</span></div>
              <div className="mt-2">Description:</div>
              <div className="min-h-1/2 h-min ml-5 mr-5 mt-1 h-full border-2 border-solid rounded border-neutral-800 bg-neutral-700">
                  <div className="text-neutral-200">{activeEvent.description}</div>
              </div>
              <div className="m-2">Completed:
                <input id="shiftData-completed" type="checkbox" className="ml-2 mr-3" disabled></input>
                <button id="shiftCompletedBtn" className="bg-forth align-middle hover:bg-fifth text-white px-1 rounded">
                  Mark as Completed
                </button>
              </div> 
            </div>
          </div>
        </div>
      )}

      <div className="inline-block w-6/12 h-full m-auto align-top gridBlock mb-6">
        <div className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600">
          <TableStyleWrapper>
            {renderedCalendar.current}
          </TableStyleWrapper>
        </div>
      </div>
    </section>
  )
}
export default ScheduleView;
