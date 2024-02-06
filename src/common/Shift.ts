import {getShifts} from "../api/getShifts"
import {getShift} from "../api/getShift"
//The primary reason behind this intermediary object is to use it when editing gets implemented. 
//This will be used to hold staged changes clientside.
export class Shift {
    constructor(id, name, startTime, endTime, assigner, description, completed) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.assigner = assigner;
        this.description = description;
        this.completed = completed;
    }
    id: number;
    name: string;
    startTime: Date;
    endTime: Date;
    assigner: String;
    description: String;
    completed: boolean; 
}
//Convert shift object to FullCalendar event
export function shiftToEvent(shift) {
    return {
        title: shift.name,
        start: shift.startTime.toISOString(),
        end : shift.endTime.toISOString(),
        extendedProps: {
            eventId: shift.id
        },
    };
}
//Retrieve FullCalendar events
export async function getEvents(user, fetchInfo) {
    return (await getShifts(user,fetchInfo)).map((x) => { 
        return shiftToEvent(x);
    });
}
export async function getEvent(id) {
    const returned = await getShift(id);
    if (!returned)
        return null;
    return shiftToEvent(returned);
}