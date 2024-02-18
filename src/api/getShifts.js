//https://fullcalendar.io/docs/events-function for info on fetchInfo object
import axios from "axios";
//interprets null scheduleUser as unassigned
export const getShifts = async (userToken, scheduleUser, fetchInfo)  => {
    var apiUrl = import.meta.env.VITE_API_URL + "/shifts/getRange";
    if (!scheduleUser)
        apiUrl = import.meta.env.VITE_API_URL + "/shifts/getUnassignedShifts";
    if (!apiUrl) {
        throw new Error("API_URL is not defined");
    }
    try {
        const res = await axios({method: 'post', url: apiUrl, 
            headers: {
                Authorization: "Bearer " + userToken,
            },
            data: {
                "employeeId": scheduleUser,
                "startTime": fetchInfo.start,
                "endTime": fetchInfo.end
            }
        });
        for (const x of res.data) {
            x.startTime = new Date(x.startTime);
            x.endTime = new Date(x.endTime);
        }
        return res.data;

    } catch (error) {
        console.log(error);
    }
}