import axios from "axios";
export const getShift = async (userToken,id)  => {
    const apiUrl = import.meta.env.VITE_API_URL + "/shifts/getRange" + id;
    if (!apiUrl) {
        throw new Error("API_URL is not defined");
    }
    try {
        const res = await axios({method: 'post', url: apiUrl, 
            headers: {
                Authorization: "Bearer " + userToken,
            },
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