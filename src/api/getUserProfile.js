import axios from "axios";
//import { userTokenAtom } from "../globalAtom";
//import { useAtom } from "jotai";
export const fetchUserProfile = async () => {
    //const [userToken] = useAtom(userTokenAtom);
    try {
        //TODO FINISH
        const apiUrl = import.meta.env.VITE_API_URL + "/user";
        if (!apiUrl) {
            throw new Error("API_URL is not defined");
        }
        const res = await axios.get(apiUrl, {
            headers: {
                //Authorization: `Bearer ${userToken}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};