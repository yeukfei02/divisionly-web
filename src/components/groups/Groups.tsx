import React, { useState } from "react";
import { Row, Col, Menu } from "antd";
import {
  GroupOutlined,
  UserOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Friends from "../friends/Friends";
import Activity from "../activity/Activity";
import Account from "../account/Account";

function Groups(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("groups");

  const handleClick = (e: any) => {
    console.log("click = ", e);

    if (e) {
      switch (e.key) {
        case "1":
          setCurrentPage("groups");
          navigate(`/dashboard/groups`);
          break;
        case "2":
          setCurrentPage("friends");
          navigate(`/dashboard/friends`);
          break;
        case "3":
          setCurrentPage("activity");
          navigate(`/dashboard/activity`);
          break;
        case "4":
          setCurrentPage("account");
          navigate(`/dashboard/account`);
          break;
        default:
          break;
      }
    }
  };

  const renderDiv = () => {
    let resultDiv = null;

    switch (currentPage) {
      case "groups":
        resultDiv = <div>Groups</div>;
        break;
      case "friends":
        resultDiv = <Friends />;
        break;
      case "activity":
        resultDiv = <Activity />;
        break;
      case "account":
        resultDiv = <Account />;
        break;
      default:
        break;
    }

    return resultDiv;
  };

  return (
    <div>
      <Row>
        <Col span={4}>
          <Menu
            onClick={handleClick}
            style={{ width: "100%", height: "100vh" }}
            defaultSelectedKeys={["1"]}
            mode="inline"
          >
            <Menu.Item key="1" icon={<GroupOutlined />}>
              Groups
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              Friends
            </Menu.Item>
            <Menu.Item key="3" icon={<MenuOutlined />}>
              Activity
            </Menu.Item>
            <Menu.Item key="4" icon={<SettingOutlined />}>
              Account
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={8}>{renderDiv()}</Col>
      </Row>
    </div>
  );
}

export default Groups;
