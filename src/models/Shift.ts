import {getShifts} from "../api/getShifts"
import {getShift} from "../api/getShift"
//The primary reason behind this intermediary object is to use it when editing gets implemented. 
//This will be used to hold staged changes clientside.
export class Shift {
    constructor(id, name, startTime, endTime, assigner, desc, completed) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.assigner = assigner;
        this.desc = desc;
        this.completed = completed;
    }
    id: number;
    name: string;
    startTime: Date;
    endTime: Date;
    assigner: String;
    desc: String;
    completed: boolean; 
}


//Convert shift object to FullCalendar event
export function shiftToEvent(shift) {
    return {
        title: shift.name,
        start: shift.startTime,
        end : shift.endTime,
        extendedProps: {
            eventId: shift.id
        },
    };
}


//Retrieve FullCalendar events
export async function getEvents(user, fetchInfo) {
    const events : Object[] = [];
    (await getShifts(user,fetchInfo)).map((x) => { 
        events.push(shiftToEvent(x));
    });
    return events;
}


export async function getEvent(id) {
    const returned = await getShift(id);
    if (!returned)
        return null;
    return shiftToEvent(returned);
}