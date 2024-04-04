import axios from "axios";
export const getUserById = async (userToken, userId) => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL + `/user/${userId}`;
        if (!apiUrl) {
            throw new Error("API_URL is not defined");
        }
        const res = await axios.get(apiUrl, {
            headers: {
                Authorization: "Bearer " + userToken,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};