import React from "react";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import styled from "@emotion/styled";
import {tempEventStorage, tempGetEvent, formatTime} from "../utils"

export default class Schedule extends React.Component {
  //while I'd love to split this into two components, they really need access to each other for the editing functionality

  viewEvent(eventClickInfo) {
    const e = tempGetEvent(eventClickInfo.event.extendedProps.eventId)
    const dateFormat = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
    document.getElementById("shiftData-name").textContent = e.name;
    document.getElementById("shiftData-date").textContent = e.startTime.toLocaleDateString("en-US", dateFormat);
    document.getElementById("shiftData-time").textContent = formatTime(e.startTime) + ' - ' + formatTime(e.endTime);
    document.getElementById("shiftData-assigner").textContent = e.assigner;
    document.getElementById("shiftData-desc").textContent = e.description;
    document.getElementById("shiftData-completed").checked = e.completed;
  }

  render() {
    const options = {
      plugins: [ timeGridPlugin ],
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
      scrollTime : "09:00:00", //in the future this should be the first event ?or current time
      //validRange : //depending on how generator works we might want this
      nowIndicator : true,
      height: 512,
      eventColor: "var(--forth)",
      events: function( fetchInfo, successCallback/*, failureCallback*/ ) { 
        //eventually this will do a db query
        //https://fullcalendar.io/docs/events-function
        const events = tempEventStorage.map((x) => { 
          return {
          title: x.name,
          start: x.startTime.toISOString(),
          end : x.endTime.toISOString(),
          extendedProps: {
            eventId: x.id
          },
        };});
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
    }`
    return (
      <section className="relative w-full" id="schedule">
        <div className="grid grid-cols-2 gap-1 w-full">
          <div className="w-full max-w-md h-full grow">
            <div className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600">
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
          </div>
          <div className="m-3 max-w-md h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600">
            <TableStyleWrapper>
              <FullCalendar {...options}/>
            </TableStyleWrapper>
          </div>
        </div>
      </section>
    )
  }
}