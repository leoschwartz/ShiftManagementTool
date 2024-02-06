import React from "react";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import styled from "@emotion/styled";
import { getEvents } from "../common/Shift"
import { getShift } from "../api/getShift";

export default class ScheduleView extends React.Component {
  //while I'd love to split this into two components, they really need access to each other for the editing functionality
  async viewEvent(eventClickInfo) {
    const e = await getShift(eventClickInfo.event.extendedProps.eventId);
    const dateFormat = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
    document.getElementById("shiftData").style.display = "block";
    document.getElementById("shiftInfo").style.display = "none";

    document.getElementById("shiftData-name").textContent = e.name;
    document.getElementById("shiftData-date").textContent = e.startTime.toLocaleDateString("en-US", dateFormat);
    document.getElementById("shiftData-time").textContent = e.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' - ' + e.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById("shiftData-assigner").textContent = e.assigner;
    document.getElementById("shiftData-desc").textContent = e.description;
    document.getElementById("shiftData-completed").checked = e.completed;
    eventClickInfo.jsEvent.stopPropagation();
  }

  render() {
    //todo
    // eslint-disable-next-line react/prop-types
    const scheduleUser = this.props.scheduleUser;
    function deselectEvent() {
      document.getElementById("shiftData").style.display = "none";
      document.getElementById("shiftInfo").style.display = "block";
    }
    var pseudoNow = new Date();
    if (pseudoNow.getHours() > 2) pseudoNow.setHours(pseudoNow.getHours() - 2); //center on now instead of top
    const options = {
      plugins: [ timeGridPlugin ],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      //https://github.com/fullcalendar/fullcalendar/issues/4638 - something for later...
      /*footerToolbar: {
        right: 'prev,next'
      },*/
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
      scrollTimeReset: false,
      //validRange : //depending on how generator works we might want this
      nowIndicator : true,
      height: 512,
      eventColor: "var(--forth)",
      events: async function( fetchInfo, successCallback/*, failureCallback*/ ) {
        const events = await getEvents(scheduleUser,fetchInfo);
        successCallback(events);
      },
      eventClick: this.viewEvent,
    };
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
      font-size:16pt;
    }
    .fc-event {
      font-size: 12pt;
    }
    .gridBlock {
      min-width: 400px;
    }`
    const PageWrapper = styled.div`
    .gridBlock {
      min-width: 400px;
      height:80vh;
      max-width:500px;
    }`
    return (
      <section className="relative w-full" id="schedule">
        <PageWrapper className="text-center">
          <div className="inline-block w-6/12 h-full m-auto align-top gridBlock mb-6">
            <div className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600">
              <TableStyleWrapper onClick={deselectEvent}>
                <FullCalendar {...options}/>
              </TableStyleWrapper>
            </div>
          </div>
          <div className="inline-block w-6/12 h-full m-auto align-top gridBlock mb-6">
            <div className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600">
              <div id="shiftData" className="hidden">
                <h3 className="mt-1 font-bold mb-2 text-lg text-neutral-900">Shift View:</h3>
                <hr className="mb-2 border-black"/>
                <h2 id="shiftData-name" className="text-2xl ml-5 mr-5 rounded p-0.5 bg-forth text-white font-bold"></h2>
                <div id="shiftData-date" className="mt-2 text-neutral-200"></div>
                <div id="shiftData-time" className="mt-2 text-neutral-200"></div>
                <div className="mt-2">Manager/Supervisor: <span id="shiftData-assigner" className="text-neutral-200"></span></div>
                <div className="mt-2">Description:</div>
                <div className="min-h-1/2 h-min ml-5 mr-5 mt-1 h-full border-2 border-solid rounded border-neutral-800 bg-neutral-700">
                    <div id="shiftData-desc" className="text-neutral-200"></div>
                </div>
                <div className="m-2">Completed:
                  <input id="shiftData-completed" type="checkbox" className="ml-2 mr-3" disabled></input>
                  <button id="shiftCompletedBtn" className="bg-forth align-middle hover:bg-fifth text-white px-1 rounded">
                    Mark as Completed
                  </button>
                </div> 
              </div>
              <div id="shiftInfo">
                <hr className="mb-2 border-black"/>
                <h2 className="text-2xl ml-5 mr-5 rounded p-0.5 bg-forth text-white font-bold">Schedule</h2>
                <div className="mt-2">Click on a shift to view or update it.</div>
                <div className="mt-2">Shifts that are assigned to you are visible here. To drop or claim a shift, go to the [Edit Schedule] page.</div>
                <div className="mt-2">You will be notified if changes are made by a manager. (NYI)</div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>
    )
  }
}