import axios from "axios";
export const addNewUser = async (userToken, email, password, accessLevel, firstName, lastName) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/user/register";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios({method: 'post', url: apiUrl, 
      headers: {
          Authorization: "Bearer " + userToken,
      },
      data: {
        email,
        password,
        accessLevel,
        firstName,
        lastName,
        active: 1,
      }
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
