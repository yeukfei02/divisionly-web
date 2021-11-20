import React, { useState, useEffect } from "react";
import { Row, Col, Menu, Button, Table, Space, Image, message } from "antd";
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
import dayjs from "dayjs";
import { getRootUrl } from "../../helpers/helpers";
import CustomAvatar from "../customAvatar/CustomAvatar";
import Groups from "../groups/Groups";
import Activity from "../activity/Activity";
import Expense from "../expense/Expense";
import Account from "../account/Account";
import TotalOweAmount from "../totalOweAmount/TotalOweAmount";

const rootUrl = getRootUrl();

function Friends(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("friends");
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getAllFriendsRequest();
    getFriendsRequest(page, pageSize);
  }, [page, pageSize]);

  const getAllFriendsRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const response = await axios.get(`${rootUrl}/friends`, {
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

          if (responseData && responseData.friends) {
            setData(responseData.friends);
            setTotalCount(responseData.friends.total_count);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const getFriendsRequest = async (page: number, pageSize: number) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const response = await axios.get(`${rootUrl}/friends`, {
          params: {
            user_id: userId,
            page: page,
            page_size: pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          if (responseData && responseData.friends) {
            setData(responseData.friends);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: any) => {
        const id = record.id;
        return (
          <a
            className="details-link text-decoration-underline"
            onClick={() => handleNameClick(id)}
          >
            {name}
          </a>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Phone number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: any) => {
        let avatarView = null;

        if (avatar && avatar.url) {
          avatarView = <Image width={200} src={avatar.url} />;
        }

        return avatarView;
      },
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => {
        const formattedCreatedAt = dayjs(created_at).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        return formattedCreatedAt;
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
              onClick={() => handleEditClick(id)}
            />
            <DeleteOutlined
              className="cursor"
              style={{ fontSize: "1.5em", color: "red" }}
              onClick={() => handleDeleteClick(id)}
            />
          </Space>
        );
      },
    },
  ];

  const handleNameClick = (id: string) => {
    if (id) {
      navigate(`/dashboard/friends/${id}`);
    }
  };

  const handleEditClick = (id: string) => {
    if (id) {
      navigate(`/dashboard/friends/${id}/edit`);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (id) {
      await deleteFriendByIdRequest(id);
    }
  };

  const deleteFriendByIdRequest = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const data = {
          id: id,
          user_id: userId,
        };
        const response = await axios.post(`${rootUrl}/friends/remove`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          message.success("Delete Friend success");
          await getFriendsRequest(page, pageSize);
        }
      }
    } catch (e: any) {
      console.log("error = ", e);

      message.error(`Delete Friend fail, error = ${e.message}`);
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
          setCurrentPage("expenses");
          navigate(`/dashboard/expenses`);
          break;
        case "4":
          setCurrentPage("activities");
          navigate(`/dashboard/activities`);
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
        resultDiv = <div>{renderFriendsView()}</div>;
        break;
      case "activities":
        resultDiv = <Activity />;
        break;
      case "expenses":
        resultDiv = <Expense />;
        break;
      case "account":
        resultDiv = <Account />;
        break;
      default:
        break;
    }

    return resultDiv;
  };

  const renderFriendsView = () => {
    const friendsView = (
      <div>
        <div>
          <TotalOweAmount />
        </div>

        <div className="mx-5 my-3 d-flex justify-content-end">
          <Button type="primary" onClick={handleCreateFriendClick}>
            Create Friend
          </Button>
        </div>

        <div className="m-5">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              total: totalCount,
              pageSizeOptions: ["10", "20", "50"],
              showSizeChanger: true,
              onChange: (page: number, pageSize: number | undefined) => {
                console.log("page = ", page);
                console.log("pageSize = ", pageSize);

                if (page) setPage(page);
                if (pageSize) setPageSize(pageSize);
              },
              onShowSizeChange: (current: number, size: number) => {
                console.log("current = ", current);
                console.log("size = ", size);

                setPage(1);
                if (size) setPageSize(size);
              },
            }}
          />
        </div>
      </div>
    );
    return friendsView;
  };

  const handleCreateFriendClick = () => {
    navigate(`/dashboard/friends/create-friend`);
  };

  return (
    <div>
      <Row>
        <Col span={4}>
          <Menu
            onClick={handleClick}
            style={{ height: "100vh" }}
            defaultSelectedKeys={["2"]}
            mode="inline"
          >
            <Menu.Item key="1" icon={<GroupOutlined />}>
              Groups
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              Friends
            </Menu.Item>
            <Menu.Item key="3" icon={<DollarOutlined />}>
              Expense
            </Menu.Item>
            <Menu.Item key="4" icon={<MenuOutlined />}>
              Activity
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

export default Friends;
