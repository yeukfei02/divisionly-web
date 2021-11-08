import React, { useEffect, useState } from "react";
import { Menu, Dropdown, Avatar } from "antd";
import { useNavigate } from "react-router-dom";

function CustomAvatar(): JSX.Element {
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    getAvatarUrl();
  }, []);

  const handleAccountClick = () => {
    navigate(`/dashboard/account`);
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    navigate(`/`);
    window.location.reload();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <div onClick={handleAccountClick}>Account</div>
      </Menu.Item>
      <Menu.Item key="2" danger onClick={handleLogoutClick}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const getAvatarUrl = () => {
    const avatarUrl = localStorage.getItem("avatarUrl");
    if (avatarUrl) setAvatarUrl(avatarUrl);
  };

  return (
    <div className="d-flex justify-content-end mx-5 my-4">
      <Dropdown overlay={menu}>
        <Avatar size={64} src={avatarUrl} />
      </Dropdown>
    </div>
  );
}

export default CustomAvatar;
