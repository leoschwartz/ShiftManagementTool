const getNotifications = async (notificationId, userToken) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL + `/user/notification/${notificationId}`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Notification fetched!")
        return data;
      } else {
        console.error("Could not get notification");
        return [];
      }
    } catch (error) {
      console.error("Error fetching notification:", error);
      return [];
    }
  };
  
  export default getNotifications;