import { useRef , useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import editablePlugin, { Draggable } from "@fullcalendar/interaction";
import styled from "@emotion/styled";
import { shiftToEvent } from "../common/Shift";
import { getShift } from "../api/getShift";
import { getShifts } from "../api/getShifts";
import { flagShiftCompleted } from "../api/flagShiftCompleted";
import { saveScheduleEdits } from "../api/saveScheduleEdits";
import { getCurrentUser } from "../api/getCurrentUser";
import { userTokenAtom } from "../globalAtom";
import { useAtom } from "jotai";

// eslint-disable-next-line react/prop-types
const Schedule = ({ scheduleUser, allowEdit, header }) => {
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [activeEvent, setActiveEvent] = useState({});
  const navigate = useNavigate();
  const calendarRef = useRef({});
  const userData = useRef({});
  const editorName = useRef(null);
  const editorDesc = useRef(null);
  const editorDate = useRef(null);
  const editorComplete = useRef(null);
  const editorDraggable = useRef(null);
  const DraggableInstance = useRef(null);
  const [userToken] = useAtom(userTokenAtom);
  var incarnation = useRef(0); //increases by 1 each render, used for one stupid useEffect
  var addedShiftKey = useRef(0);
  var renderedCalendar;

  //HACK!
  //saveState stores event objects, scroll position, and page. This is for recovering from state changes.
  var StartTime = new Date();
  StartTime.setDate(StartTime.getDate() - (StartTime.getDay() + 6) % 7);
  const calendarState = useRef({
    events: [], //Shift object cache, for re-rendering the same page. May reflect edits early! Use with care.
    scroll: 0, //Pixel scroll position
    visibleRange: StartTime, //A day from the current week
    cachedRange: null, //Range of dates current cached
    shiftsEdited: [], //Shift objects
    shiftsRemoved: [], //Shift ids
    shiftsAdded: [], //Shift objects (ids will change on save!)
  });
  //Return a list of FullCalendar event-parsable objects to render
  async function getPageEvents(fetchInfo, successCallback) {
    //Get real events
    var events = [];
    var isCached = calendarState.current.cachedRange != null;
    if (isCached) {
      isCached = (fetchInfo.start.toDateString() == calendarState.current.cachedRange.start.toDateString() 
      || fetchInfo.end.toDateString() == calendarState.current.cachedRange.end.toDateString());
    }
    if (!isCached || calendarState.current.events.length == 0) { 
      //hack fix, something is wrong here ^
      //the first strictMode render sets isCached to true but loses the events? TODO
      calendarState.current.cachedRange = {start: fetchInfo.start, end: fetchInfo.end};
      events = await getShifts(userToken, scheduleUser, fetchInfo);
      calendarState.current.events = events;
    } else {
      events = calendarState.current.events;
    }
    calendarState.current.events = events;
    calendarState.current.visibleRange = fetchInfo.start.toLocaleDateString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    if (allowEdit) {
      //Remove pending removals
      events = events.filter(function(event) {
        return (calendarState.current.shiftsRemoved.find((id) => id == event.id)) == undefined
      })
      //Modify pending edits
      for (let editedEvent of calendarState.current.shiftsEdited) {
        const pos = events.findIndex(i => i.id == editedEvent.id);
        if (pos == -1) {
          console.warn("Unable to find the edited event #" + editedEvent.id); //This will happen if a shift is moved between weeks?
          events.push(editedEvent);
        }
        else
          events[pos] = editedEvent;
      }
      //Add pending additions
      for (let newEvent of calendarState.current.shiftsAdded) {
        events.push(newEvent);
      }
      //Date filter second pass (unnecessary?)
      events = events.filter((event) => event.startTime > fetchInfo.start && event.endTime < fetchInfo.end);
    }
    successCallback(events.map((e) => shiftToEvent(e)));
  }
  //Return the event object for a given id from cache if possible
  async function getEventObject(id) {
    var pos = calendarState.current.events.findIndex(i => i.id == id);
    if (pos != -1) return calendarState.current.events[pos];
    pos = calendarState.current.shiftsEdited.findIndex(i => i.id == id);
    if (pos != -1) return calendarState.current.shiftsEdited[pos];
    pos = calendarState.current.shiftsAdded.findIndex(i => i.id == id);
    if (pos != -1) return calendarState.current.shiftsAdded[pos];
    console.warn("Unable to find event object #" + id); //this should not happen!
    return await getShift(userToken, id);
  }
  //Return the shiftsEdited or shiftsAdded object with this id
  //If none are found, create a shiftsAdded object and return it
  //This moves a reference instead of making an actual copy! Copy not necessary, but might be later.
  function getEditedEventObject (id) {
    var pos = calendarState.current.shiftsEdited.findIndex(i => i.id == id);
    if (pos != -1) return calendarState.current.shiftsEdited[pos];
    pos = calendarState.current.shiftsAdded.findIndex(i => i.id == id);
    if (pos != -1) return calendarState.current.shiftsAdded[pos];
    const event = calendarState.current.events.find(i => i.id == id);
    return calendarState.current.shiftsEdited[calendarState.current.shiftsEdited.push(event) - 1];
  }
  //Employee-view mark completion. Doesn't use the cache - just applies immediately.
  async function markShiftCompleted() {
    saveCalendarState();
    await flagShiftCompleted(userToken, activeEvent.id);
    calendarState.current.events[calendarState.current.events.indexOf(activeEvent)] = await getShift(userToken, activeEvent.id); //ensure sync in case api fails
  }
  //Pass pending edits to API, wipe state
  async function saveEdits() {
    await saveScheduleEdits(userToken, scheduleUser, calendarState.current.shiftsEdited, calendarState.current.shiftsRemoved, calendarState.current.shiftsAdded);
    //window.location.reload(); //nuclear option
    navigate(-1);
  }
  //Save changes made in the UI to the edited event cache
  function saveEventChanges() {
    saveCalendarState();
    if (!editorDate.current.value) {
      return; //TODO FEEDBACK
    }
    const editEvent = getEditedEventObject(activeEvent.id);
    //doesn't check for any actual changes... todo?
    editEvent.desc = editorDesc.current.value;
    editEvent.completed = editorComplete.current.checked;
    editEvent.name = editorName.current.value;
    var stringTok = editorDate.current.value.split("-");
    stringTok[1] = Number(stringTok[1]) - 1; //0th month correction
    var times = [activeEvent.startTime.getHours(), activeEvent.startTime.getMinutes(), activeEvent.startTime.getSeconds()];
    editEvent.startTime = new Date(stringTok[0], stringTok[1], stringTok[2], times[0], times[1], times[2]);
    times = [activeEvent.endTime.getHours(), activeEvent.endTime.getMinutes(), activeEvent.endTime.getSeconds()];
    editEvent.endTime = new Date(stringTok[0], stringTok[1], stringTok[2], times[0], times[1], times[2]);
    setShowViewPanel(false);
  }
  //Add the shift to delete cache
  function promptDeleteEvent() {
    if (confirm("Are you sure you want to delete this shift?")) {
      saveCalendarState();
      var pos = calendarState.current.shiftsEdited.findIndex(i => i.id == activeEvent.id);
      if (pos != -1) calendarState.current.shiftsEdited.splice(pos,1);
      pos = calendarState.current.shiftsAdded.findIndex(i => i.id == activeEvent.id);
      if (pos != -1) 
        calendarState.current.shiftsAdded.splice(pos,1);
      else
        calendarState.current.shiftsRemoved.push(activeEvent.id);
      setShowViewPanel(false);
    }
  }
  //Save the calendar scroll position and range for the re-render
  function saveCalendarState() {
    calendarState.current.scroll= document.querySelector(".fc-scroller-liquid-absolute").scrollTop;
    const range = calendarRef.current.getApi().currentData.dateProfile.activeRange.start;
    //off-by-one bug in FullCalendar dirty fix
    const fixedRange = new Date(range.getFullYear(),range.getMonth(),range.getDate()+1);
    calendarState.current.visibleRange = fixedRange.toLocaleDateString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
  }
  //ugh... helper
  function getISONoTimeZone(date) {
    return date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" : "") + date.getDate();
  }
  //instantiate the draggable, get user name
  incarnation.current++;
  useEffect(() => {
    async function checkUserData() {
      if (!userData.current || !userData.current.email) {
        userData.current = await getCurrentUser(userToken);
        if (!userData.current || !userData.current.email)
          userData.current = {firstName:"Error",lastName:"Jones",email:"error@bugged"}
      }
    }
    checkUserData();
    if (allowEdit) {
      if (DraggableInstance.current) {
        //console.warn("Destroying a duplicate DraggableInstance!");
        //Bugfix because react StrictMode's first render creates a bogus instance
        //Otherwise DraggableInstance wouldn't be needed at all
        DraggableInstance.current.destroy();
        DraggableInstance.current = null;
      }
      DraggableInstance.current = new Draggable(editorDraggable.current, {
        eventData: function () {
          return {
            title: "New Shift A-" + addedShiftKey.current,
            extendedProps: {
                eventId: "A-" + addedShiftKey.current++
            },
          }
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incarnation.current]); //incarnation forces this to run every render

  var pseudoNow = new Date();
  if (pseudoNow.getHours() > 2) pseudoNow.setHours(pseudoNow.getHours() - 2); //center on now instead of top
  // MAGIC NUMBERS: 80,80,1.3333 - font-size to pixel ratios for 3pt
  const calcTimeEstimateString = String(Math.floor(calendarState.current.scroll / 80)).padStart(2, '0') 
  + ":" + String(Math.floor((calendarState.current.scroll % 80) / 1.333333)).padStart(2, '0');
  const options = {
    plugins: [ timeGridPlugin ],
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
    weekends: true,
    //hiddenDays: //worth considering if we could hide empty days...
    dayHeaderFormat: { weekday: 'short' },
    businessHours : true, //good for prototype, unsure if permanent
    scrollTime : calendarState.current.scroll ? calcTimeEstimateString : pseudoNow.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}),
    initialDate: calendarState.current.visibleRange,
    scrollTimeReset: false,
    //validRange : //depending on how generator works we might want this
    nowIndicator : true,
    height: 512,
    eventColor: "var(--forth)",
    events: getPageEvents, //TODO why is this called twice when opening an event??
    eventClick: async (eventClickInfo) => {
      const e = await getEventObject(eventClickInfo.event.extendedProps.eventId);
      saveCalendarState()
      setActiveEvent(e);
      setShowViewPanel(true);
    },
  };
  if (allowEdit) {
    options.plugins.push(editablePlugin);
    options.editable = true;
    options.eventResize = function(eventResizeInfo) {
      const eventObj = getEditedEventObject(eventResizeInfo.event.extendedProps.eventId);
      eventObj.startTime = eventResizeInfo.event.start;
      eventObj.endTime = eventResizeInfo.event.end;
    }
    options.eventDrop = function(eventDropInfo) {
      const eventObj = getEditedEventObject(eventDropInfo.event.extendedProps.eventId);
      eventObj.startTime = eventDropInfo.event.start;
      eventObj.endTime = eventDropInfo.event.end;
    }
    options.eventReceive = function(eventReceiveInfo) {
      var endTime = eventReceiveInfo.event.start
      endTime.setTime(endTime.getTime() + (60*60*1000));
      calendarState.current.shiftsAdded.push({
        id: eventReceiveInfo.event.extendedProps.eventId,
        name: "New Shift " + eventReceiveInfo.event.extendedProps.eventId,
        startTime: eventReceiveInfo.event.start,
        endTime: endTime,
        assigner: userData.current.firstName + " " + userData.current.lastName,
        desc: "",
        completed: false
      })
      eventReceiveInfo.revert();
      calendarRef.current.getApi().refetchEvents();
    }
  }
  renderedCalendar = {current: <FullCalendar {...options}/> };

  //fullcalendar styling is either this or a bootstrap style
  // td { font-size: 3pt; } controls the entire chart scale!!!
  // MUST REMAIN SYNCED WITH SCROLLTIME!
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
  .fc-toolbar-title {
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
  const GlobalStyleWrapper = styled.div`
  .transparent-input {
    background-color: rgba(0,0,0,0.2);
    border: 0.1rem solid rgba(0,0,0,0.3);
    border-radius: 0.25rem;
  }`
  //There are two copies of the viewing UI - one for editing, one for viewing. I did try combining them but it was unreadable after that
  return (
    <section className="relative w-full">
      <GlobalStyleWrapper>
        {showViewPanel && !allowEdit && (
          <div className="fixed inset-0 flex text-center items-center justify-center bg-black bg-opacity-50 p-8 z-10" 
              onClick={() => {
                saveCalendarState();
                setShowViewPanel(false);
              }}>
            <div className="inline-block m-auto align-top">
              <div className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600" onClick={(event) => {
                event.stopPropagation()
              }}>
                <hr className="mb-2 border-black"/>
                <h2 className="text-2xl ml-5 mr-5 rounded p-0.5 bg-forth text-white font-bold">{activeEvent.name}</h2>
                <div className="mt-2 text-neutral-200">
                  {activeEvent.startTime.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'})}
                </div>
                <div className="mt-2 text-neutral-200">
                  {activeEvent.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' - ' + activeEvent.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="mt-2">Manager/Supervisor: <span className="text-neutral-200">{activeEvent.assigner}</span></div>
                <div className="mt-2">Description:</div>
                <div className="min-h-1/2 h-min min-w-80 ml-5 mr-5 mt-1 h-full border-2 border-solid rounded border-neutral-800 bg-neutral-700">
                    <div className="text-neutral-200">{activeEvent.desc}</div>
                </div>
                <div className="m-2">Completed:
                  <input type="checkbox" className="ml-2 mr-3" disabled defaultChecked={activeEvent.completed}></input>
                  {!activeEvent.completed && (
                    <button className="bg-forth align-middle hover:bg-fifth text-white px-1 rounded" onClick={markShiftCompleted}>
                      Mark as Completed
                    </button>
                  )}
                </div> 
              </div>
            </div>
          </div>
        )}

        {showViewPanel && allowEdit && (
          <div className="fixed inset-0 flex text-center items-center justify-center bg-black bg-opacity-50 p-8 z-10" 
              onClick={() => {
                saveCalendarState();
                setShowViewPanel(false);
              }}>
            <div className="inline-block m-auto align-top">
              <div className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600" onClick={(event) => {
                event.stopPropagation()
              }}>
                <hr className="mb-2 border-black"/>
                <h2 className="text-2xl ml-5 mr-5 rounded p-0.5 bg-forth text-white font-bold">
                  <input ref={editorName} className="transparent-input bg-forth text-center border-2 border-solid rounded border-black" defaultValue={activeEvent.name}></input>
                </h2>
                <input type="date"  ref={editorDate} className="transparent-input mt-2 text-neutral-200" defaultValue={getISONoTimeZone(activeEvent.startTime)}></input>
                <div className="mt-2 text-neutral-200">
                  {activeEvent.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' - ' + activeEvent.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="mt-2">Manager/Supervisor: <span className="text-neutral-200">{activeEvent.assigner}</span></div>
                <div className="mt-2">Description:</div>
                <textarea ref={editorDesc} className="min-w-80 min-h-1/2 h-min ml-5 mr-5 mt-1 h-full border-2 border-solid rounded border-neutral-800 bg-neutral-700" defaultValue={activeEvent.desc}></textarea>
                <div className="m-2">Completed:
                  <input ref={editorComplete} type="checkbox" className="transparent-input ml-2 mr-3" defaultChecked={activeEvent.completed}></input>
                </div> 
                <button className="mb-3 text-lg bg-forth align-middle hover:bg-fifth text-white px-1 rounded" onClick={saveEventChanges}>
                  Save Changes
                </button>
                <button className="ml-6 mb-3 text-lg bg-forth align-middle hover:bg-fifth text-white px-1 rounded" onClick={promptDeleteEvent}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="inline-block h-full m-auto w-full align-top text-center">
          <div className="m-3 h-full border-2 border-solid rounded border-black text-neutral-400 bg-secondary bg-gradient-to-tr from-secondary to-neutral-600">
          {header && (<h3 className="text-2xl w-full rounded p-0.5 bg-forth text-white font-bold">{header}</h3>)}
          <hr className="border-1 border-black"></hr>
            <TableStyleWrapper>
              {renderedCalendar.current}
            </TableStyleWrapper>
            {allowEdit && (
              <div>
                <span ref={editorDraggable} className="m-3 text-xl bg-forth align-middle hover:bg-fifth hover:cursor-pointer text-white px-1 rounded">Add Shift (Drag)</span>
                <button className="m-3 text-xl bg-forth align-middle hover:bg-fifth text-white px-1 rounded" onClick={saveEdits}>Save Changes</button>
              </div>
            )}
          </div>
        </div>
      </GlobalStyleWrapper>
    </section>
  )
}
export default Schedule;