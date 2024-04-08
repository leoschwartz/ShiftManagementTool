import React, { useState, useEffect } from "react";
import { Avatar, Dropdown } from "flowbite-react";
import { isLoggedInAtom, userTokenAtom, userAccessLevelAtom, userIdAtom } from "../globalAtom";
import { useAtom } from "jotai";
import { getCurrentUser } from "../api/getCurrentUser";
import { Link } from "react-router-dom";
import getNotifications from "../api/getNotification";
import { removeNotification } from "../api/removeNotification";

enum AvatarStatus {
  Offline = "offline",
  Busy = "busy",
  Away = "away",
  Online = "online",
}

function NotificationIcon() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>(AvatarStatus.Away);
  const [userToken] = useAtom(userTokenAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const [currAccessLevel] = useAtom(userAccessLevelAtom);
  const [notifications, setNotifications] = useState<Array<any>>([]);

  const handleRemoveNotification = async (notificationId) => {
    try {
      await removeNotification(userToken, notificationId, userId);
      // Filter out the removed notification
      const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Get user data
        const userData = await getCurrentUser(userToken);
        //console.log("### Notifications ###");
        //console.log(userData.notificationList);
        // Check if notificationList is empty
        if (userData && userData.notificationList && userData.notificationList.length === 0) {
          setAvatarStatus(AvatarStatus.Offline);
        } else {
          setAvatarStatus(AvatarStatus.Busy);
          // Fetch notifications for each notificationId
          const fetchedNotifications = await Promise.all(userData.notificationList.map(async notificationId => {
            try {
              const notification = await getNotifications(notificationId, userToken);
              //console.log("### Notifications object ###");
              //console.log(JSON.stringify(notification));
              return notification;
            } catch (error) {
              console.error("Error fetching notification:", error);
              return null;
            }
          }));
          setNotifications(fetchedNotifications.filter(notification => notification !== null));
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    if (isLoggedIn) {
      fetchCurrentUser();
      // console.log("*** Notification Objects ***");
      // console.log(JSON.stringify(notifications));
    }
  }, [isLoggedIn, userToken, notifications]);

  return (
    isLoggedIn && (
      <div className="fixed bottom-4 right-4 z-50">
        <Dropdown className="w-48"
          label={
            <Avatar
              placeholderInitials="N"
              alt="Notifications"
              status={avatarStatus}
              statusPosition="top-right"
              rounded
            />
          }
          arrowIcon={false}
          inline
        >
          <Dropdown.Header>
            <span className="block text-sm">Notifications</span>
          </Dropdown.Header>
          {notifications.length === 0 ? (
            <Dropdown.Item>
              No notifications at this time
            </Dropdown.Item>
          ) : (
            notifications.map(notification => (
              <Dropdown.Item key={notification.id}>
                {/* Conditionally render link based on access level */}
                {currAccessLevel === 1 ? (
                  <Link to={`/scheduleEditor/${notification.createdBy}`} onClick={() => handleRemoveNotification(notification.id)}>
                    {notification.title}
                  </Link>
                ) : (
                  <Link to="/schedule" onClick={() => handleRemoveNotification(notification.id)}>
                    {notification.title}
                  </Link>
                )}
                {/* <Link to={`/scheduleEditor/${notification.createdBy}`} onClick={() => handleRemoveNotification(notification.id)}>
                  {notification.title}
                </Link> */}
              </Dropdown.Item>
            ))
          )}
        </Dropdown>
      </div>
    )
  );
}

export default NotificationIcon;