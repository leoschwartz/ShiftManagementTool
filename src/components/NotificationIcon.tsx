import React, { useState, useEffect } from "react";
import { Avatar, Dropdown } from "flowbite-react";
import { isLoggedInAtom, userTokenAtom } from "../globalAtom";
import { useAtom } from "jotai";
import { getCurrentUser } from "../api/getCurrentUser";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Get user data
        const userData = await getCurrentUser(userToken);
        console.log("Notifications");
        console.log(userData.notificationList);
        // Check if notificationList is empty
        if (userData && userData.notificationList && userData.notificationList.length === 0) {
          setAvatarStatus(AvatarStatus.Offline);
        } else {
          setAvatarStatus(AvatarStatus.Busy);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    if (isLoggedIn) {
      fetchCurrentUser();
    }
  }, [isLoggedIn, userToken]);

  return (
    isLoggedIn && (
      <div className="fixed bottom-4 right-4 z-50">
        <Dropdown
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
          <Dropdown.Item>
            <Link to={`/scheduleEditor/sample`}>
                Shift assignment requested
            </Link>
          </Dropdown.Item>
        </Dropdown>
      </div>
    )
  );
}

export default NotificationIcon;