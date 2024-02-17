import React from "react";
import { Avatar, Dropdown } from "flowbite-react";
import { isLoggedInAtom } from "../globalAtom";
import { useAtom } from "jotai";

function NotificationIcon() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  const handleLogout = () => {
    // handle logout logic
  };

  return (
    isLoggedIn && (
      <div className="fixed bottom-4 right-4 z-50">
        <Dropdown
          label={
            <Avatar
              placeholderInitials="N"
              alt="Notifications"
              status="busy" statusPosition="top-right"
              rounded
            />
          }
          arrowIcon={false}
          inline
        >
          <Dropdown.Header>
            <span className="block text-sm">Notifications</span>
          </Dropdown.Header>
          <Dropdown.Item>Sample notification</Dropdown.Item>
        </Dropdown>
      </div>
    )
  );
}

export default NotificationIcon;
