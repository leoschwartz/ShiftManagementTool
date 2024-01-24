import React from "react";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

export default class Schedule extends React.Component {
  //while I'd love to split this into two components, they really need access to eachother
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
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
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
    };
    const tableStyles = {
      main: {
        backgroundColor: "#f1f1f1",
        width: "100%",
      },
    };
    /* Id refs:
    shiftData-name
    shiftData-date
    shiftData-time
    shiftData-assigner
    shiftData-desc
    shiftData-completed
    shiftCompletedButton*/
    return (
      <section className="relative" id="home">
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full h-full">
            <div className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600">
              <h3 className="mt-1 font-bold mb-2 text-lg text-neutral-900">Shift View:</h3>
              <hr className="mb-2 border-black"/>
              <h2 id="shiftData-name" className="text-2xl ml-5 mr-5 rounded p-0.5 bg-forth text-white font-bold">Inverse Cashier 1B 0-16</h2>
              <div id="shiftData-date" className="mt-2 text-neutral-200">Jan 32, 2024 (Cheusday) </div>
              <div id="shiftData-time" className="mt-2 text-neutral-200">0:00am - 16:00pm</div>
              <div className="mt-2">Manager/Supervisor: <span id="shiftData-assigner" className="text-neutral-200">A̷̶̸̴̴̶̶g̴̴̶̸̶̷̸b̷̴̸̷̴̶̵æ̷̵̷̶̵̷̷l̷̶̸̷̷̴̸ ̶̴̵̸̷̴̷B̶̴̵̴̴̴̴ð̵̸̸̴̴̷̵i̶̸̸̷̸̶̴a̸̶̷̶̴̴̶</span></div>
              <div className="mt-2">Description:</div>
              <div className="min-h-1/2 h-fit ml-5 mr-5 mt-1 h-full border-2 border-solid rounded border-neutral-800 bg-neutral-700">
                  <div id="shiftData-desc" className="text-neutral-200">Your route should be provided to you. Receive change from each cashier as according to your amounts record.</div>
              </div>
              <div className="m-2">Completed:
                <input id="shiftData-completed" type="checkbox" className="ml-2 mr-3" disabled></input>
                <button id="shiftCompletedBtn" className="bg-forth align-middle hover:bg-fifth text-white px-1 rounded">
                  Mark as Completed
                </button>
              </div>
            </div>
          </div>
            <div style={tableStyles} className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600">
             <FullCalendar {...options}/>
          </div>
        </div>
      </section>
    )
  }
}