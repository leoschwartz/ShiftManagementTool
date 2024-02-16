import axios from "axios";

export const saveScheduleEdits = async (userToken, scheduleUser, editedShifts, deletedShifts, addedShifts) => {
    const apiUrl = import.meta.env.VITE_API_URL + "/shifts/updateSchedule";
    if (!apiUrl) {
        throw new Error("API_URL is not defined");
    }
    try {
        //sigh...
        //https://github.com/axios/axios/issues/891
        //It's possible for any request in the frontend to fail on some environments because of this
        //Should maybe patch every request?
        await axios({method: 'post', url: apiUrl, 
            headers: {
                Authorization: "Bearer " + userToken,
            },
            data: {
                scheduleUser,
                editedShifts,
                deletedShifts,
                addedShifts
            }
        });
    } catch (error) {
        console.log(error);
    }
};
