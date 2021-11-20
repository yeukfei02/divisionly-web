import React, { useState, useEffect } from "react";
import { Row, Col, Menu, Table, Image } from "antd";
import {
  GroupOutlined,
  UserOutlined,
  MenuOutlined,
  DollarOutlined,
  SettingOutlined,
  ContactsOutlined,
  // EditOutlined,
  // DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { getRootUrl } from "../../helpers/helpers";
import CustomAvatar from "../customAvatar/CustomAvatar";
import Groups from "../groups/Groups";
import Friends from "../friends/Friends";
import Account from "../account/Account";
import Contact from "../contact/Contact";

const rootUrl = getRootUrl();

function Activity(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("activities");
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getAllActivityRequest();
    getActivityRequest(page, pageSize);
  }, [page, pageSize]);

  const getAllActivityRequest = async () => {
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
            setTotalCount(responseData.activities.total_count);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const getActivityRequest = async (page: number, pageSize: number) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const response = await axios.get(`${rootUrl}/activities`, {
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

          if (responseData && responseData.activities) {
            setData(responseData.activities);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: any) => {
        const id = record.id;
        return (
          <a
            className="details-link text-decoration-underline"
            onClick={() => handleNameClick(id)}
          >
            {title}
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
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: any) => {
        let imageView = null;

        if (image && image.url) {
          imageView = <Image width={100} src={image.url} preview={false} />;
        }

        return imageView;
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
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (text: string, record: any) => {
    //     const id = record.id;

    //     return (
    //       <Space size="middle">
    //         <EditOutlined
    //           className="cursor"
    //           style={{ fontSize: "1.5em", color: "blue" }}
    //           onClick={() => handleEditClick(id)}
    //         />
    //         <DeleteOutlined
    //           className="cursor"
    //           style={{ fontSize: "1.5em", color: "red" }}
    //           onClick={() => handleDeleteClick(id)}
    //         />
    //       </Space>
    //     );
    //   },
    // },
  ];

  const handleNameClick = (id: string) => {
    if (id) {
      navigate(`/dashboard/activities/${id}`);
    }
  };

  // const handleEditClick = (id: string) => {
  //   if (id) {
  //     console.log("id = ", id);
  //   }
  // };

  // const handleDeleteClick = async (id: string) => {
  //   if (id) {
  //     await deleteActivityByIdRequest(id);
  //   }
  // };

  // const deleteActivityByIdRequest = async (id: string) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.delete(`${rootUrl}/activities/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response && response.status === 200) {
  //       const responseData = response.data;
  //       console.log("responseData = ", responseData);

  //       message.success("Delete Activity success");
  //       await getActivityRequest();
  //     }
  //   } catch (e: any) {
  //     console.log("error = ", e);

  //     message.error(`Delete Activity fail, error = ${e.message}`);
  //   }
  // };

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
        case "6":
          setCurrentPage("contact");
          navigate(`/dashboard/contact`);
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
      case "activities":
        resultDiv = <div>{renderActivityView()}</div>;
        break;
      case "account":
        resultDiv = <Account />;
        break;
      case "contact":
        resultDiv = <Contact />;
        break;
      default:
        break;
    }

    return resultDiv;
  };

  const renderActivityView = () => {
    const activityView = (
      <div>
        {/* <div className="mx-5 my-3 d-flex justify-content-end">
          <Button type="primary" onClick={handleCreateActivityClick}>
            Create Activity
          </Button>
        </div> */}

        <div className="mx-5 my-4">
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
    return activityView;
  };

  // const handleCreateActivityClick = () => {
  //   navigate(`/dashboard/activities/create-activity`);
  // };

  return (
    <div>
      <Row>
        <Col span={4}>
          <Menu
            onClick={handleClick}
            style={{ height: "100vh" }}
            defaultSelectedKeys={["4"]}
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
            <Menu.Item key="6" icon={<ContactsOutlined />}>
              Contact
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
