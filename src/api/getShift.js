//TEMPORARY
import { getShifts } from "./getShifts";
//eslint-disable-next-line no-unused-vars
export const getShift = async (userToken,id)  => {
    return (await getShifts(null,null)).find(((element) => element.id == id));
}