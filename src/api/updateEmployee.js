import axios from "axios";

export const updateEmployee = async (userToken, employeeId, employeeData) => {
  const apiUrl =
    import.meta.env.VITE_API_URL + "/employee/" + employeeId;
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.put(
      apiUrl,
      { ...employeeData },
      {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
