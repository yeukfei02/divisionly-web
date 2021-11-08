import React, { useEffect, useState } from "react";
import { Row, Col, Menu, Button, Table, Tag, Space } from "antd";
import {
  GroupOutlined,
  UserOutlined,
  MenuOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getRootUrl } from "../../helpers/helpers";
import CustomAvatar from "../customAvatar/CustomAvatar";
import Friends from "../friends/Friends";
import Activity from "../activity/Activity";
import Account from "../account/Account";
import axios from "axios";

const rootUrl = getRootUrl();

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Group type",
    key: "groupType",
    dataIndex: "groupType",
    render: (groupType: any) => {
      const color = "red";
      return (
        <div>
          <Tag color={color} key={groupType}>
            {groupType.toUpperCase()}
          </Tag>
        </div>
      );
    },
  },
  {
    title: "Action",
    key: "action",
    render: (text: string, record: any) => {
      console.log("text = ", text);
      console.log("record = ", record);

      return (
        <Space size="middle">
          <EditOutlined />
          <DeleteOutlined />
        </Space>
      );
    },
  },
];

function Groups(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("groups");
  const [data, setData] = useState([]);

  useEffect(() => {
    getGroupsRequest();
  }, []);

  const getGroupsRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const response = await axios.get(`${rootUrl}/groups`, {
          params: {
            user_id: userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          if (responseData && responseData.groups) {
            setData(responseData.groups);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

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
        resultDiv = <div>{renderGroupsView()}</div>;
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

  const renderGroupsView = () => {
    const groupsView = (
      <div>
        <div className="d-flex justify-content-end mx-5 my-2">
          <Button type="primary" onClick={handleCreateGroupsClick}>
            Create Groups
          </Button>
        </div>

        <div className="m-5">
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    );
    return groupsView;
  };

  const handleCreateGroupsClick = () => {
    // navigate(`/dashboard/groups/create-group);
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
        <Col span={8}>
          <div style={{ width: "100vw" }}>
            <div className="d-flex justify-content-end">
              <CustomAvatar />
            </div>
            {renderDiv()}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Groups;
