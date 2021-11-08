import React, { useState, useEffect } from "react";
import { Row, Col, Menu, Button, Table, Space, Image } from "antd";
import {
  GroupOutlined,
  UserOutlined,
  MenuOutlined,
  DollarOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import CustomAvatar from "../customAvatar/CustomAvatar";
import Groups from "../groups/Groups";
import Friends from "../friends/Friends";
import Account from "../account/Account";

const rootUrl = getRootUrl();

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (title: string) => <a>{title}</a>,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image: any) => {
      let imageView = null;

      if (image && image.url) {
        imageView = <Image width={200} src={image.url} />;
      }

      return imageView;
    },
  },
  {
    title: "Action",
    key: "action",
    render: (text: string, record: any) => {
      const id = record.id;

      return (
        <Space size="middle">
          <EditOutlined
            className="cursor"
            style={{ fontSize: "1.5em", color: "blue" }}
          />
          <DeleteOutlined
            className="cursor"
            style={{ fontSize: "1.5em", color: "red" }}
          />
        </Space>
      );
    },
  },
];

function Activity(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("activity");
  const [data, setData] = useState([]);

  useEffect(() => {
    getActivityRequest();
  }, []);

  const getActivityRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const response = await axios.get(`${rootUrl}/activities`, {
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

          if (responseData && responseData.activities) {
            setData(responseData.activities);
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
          setCurrentPage("expense");
          navigate(`/dashboard/expense`);
          break;
        case "5":
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
        resultDiv = <Groups />;
        break;
      case "friends":
        resultDiv = <Friends />;
        break;
      case "activity":
        resultDiv = <div>{renderActivityView()}</div>;
        break;
      case "account":
        resultDiv = <Account />;
        break;
      default:
        break;
    }

    return resultDiv;
  };

  const renderActivityView = () => {
    const activityView = (
      <div>
        <div className="d-flex justify-content-end mx-5 my-3">
          <Button type="primary" onClick={handleCreateActivityClick}>
            Create Activity
          </Button>
        </div>

        <div className="m-5">
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    );
    return activityView;
  };

  const handleCreateActivityClick = () => {
    // navigate(`/dashboard/activities/create-activity);
  };

  return (
    <div>
      <Row>
        <Col span={4}>
          <Menu
            onClick={handleClick}
            style={{ height: "100vh" }}
            defaultSelectedKeys={["3"]}
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
            <Menu.Item key="4" icon={<DollarOutlined />}>
              Expense
            </Menu.Item>
            <Menu.Item key="5" icon={<SettingOutlined />}>
              Account
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={20}>
          <div>
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

export default Activity;
