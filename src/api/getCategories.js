const getCategories = async (userId, userToken) => {
  try {
    const apiUrl =
      import.meta.env.VITE_API_URL + `/manager/categoryList/${userId}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      // console.log("Categories fetched!");
      return data;
    } else {
      console.error("Could not get category list");
      return [];
    }
  } catch (error) {
    console.error("Error getting category list:", error);
    return [];
  }
};

export default getCategories;
