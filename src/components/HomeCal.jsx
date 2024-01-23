import React from "react";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

export default class HomeCal extends React.Component {
  //at some point this should be generalized a bit more so it can be used other places
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

    };
    return (<FullCalendar {...options}/>)
  }
}