import React, { useState, useEffect } from "react";
import { Avatar, Dropdown } from "flowbite-react";
import { isLoggedInAtom, userTokenAtom, userAccessLevelAtom } from "../globalAtom";
import { useAtom } from "jotai";
import { getCurrentUser } from "../api/getCurrentUser";
import { Link } from "react-router-dom";
import getNotifications from "../api/getNotification";

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
  const [notifications, setNotifications] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Get user data
        const userData = await getCurrentUser(userToken);
        console.log("### Notifications ###");
        console.log(userData.notificationList);
        // Check if notificationList is empty
        if (userData && userData.notificationList && userData.notificationList.length === 0) {
          setAvatarStatus(AvatarStatus.Offline);
        } else {
          setAvatarStatus(AvatarStatus.Busy);
          // Fetch notifications for each notificationId
          const fetchedNotifications = await Promise.all(userData.notificationList.map(async notificationId => {
            try {
              const notification = await getNotifications(notificationId, userToken);
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
      console.log("*** Notification Objects ***");
      console.log(JSON.stringify(notifications));
    }
  }, [isLoggedIn, userToken]);

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
                <Link to={`/scheduleEditor/${notification.createdBy}`}>
                  {notification.title}
                </Link>
              </Dropdown.Item>
            ))
          )}
        </Dropdown>
      </div>
    )
  );
}

export default NotificationIcon;