import axios from "axios";
//eslint-disable-next-line no-unused-vars
// export const getShift = async (userToken,id)  => {
//     return (await getShifts(null,null)).find(((element) => element.id == id));
// }

export const getShift = async (userToken, id) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/shifts/get/" + id;
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios({
      method: "get",
      url: apiUrl,
      headers: {
        Authorization: "Bearer " + userToken,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
