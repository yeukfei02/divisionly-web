import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Menu,
  Button,
  Table,
  Space,
  Image,
  Typography,
  message,
} from "antd";
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
import Friends from "../friends/Friends";
import Activity from "../activity/Activity";
import Account from "../account/Account";

const { Text } = Typography;

const rootUrl = getRootUrl();

function Expense(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("expenses");
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getAllExpenseRequest();
    getExpenseRequest(page, pageSize);
  }, [page, pageSize]);

  const getAllExpenseRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const response = await axios.get(`${rootUrl}/expenses`, {
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

          if (responseData && responseData.expenses) {
            setData(responseData.expenses);
            setTotalCount(responseData.expenses.total_count);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const getExpenseRequest = async (page: number, pageSize: number) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        let params = {
          user_id: userId,
          page: page,
          page_size: pageSize,
        };
        if (page != 0) {
          params = Object.assign(params, { page: page });
        }

        const response = await axios.get(`${rootUrl}/expenses`, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          if (responseData && responseData.expenses) {
            setData(responseData.expenses);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string, record: any) => {
        const id = record.id;
        return (
          <a
            className="details-link text-decoration-underline"
            onClick={() => handleNameClick(id)}
          >
            {description}
          </a>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Split method",
      dataIndex: "split_method",
      key: "split_method",
      render: (split_method: string) => {
        let splitMethodStr = "";

        if (split_method) {
          splitMethodStr = split_method.replace(/[_]/g, " ");
        }

        return splitMethodStr;
      },
    },
    {
      title: "Your amount",
      dataIndex: "your_amount",
      key: "your_amount",
    },
    {
      title: "Owe amount",
      dataIndex: "owe_amount",
      key: "owe_amount",
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
      title: "Expense category",
      dataIndex: "expense_category",
      key: "expense_category",
      render: (expense_category: any) => {
        let expenseCategoryView = null;

        if (
          expense_category &&
          expense_category.image &&
          expense_category.image.url
        ) {
          expenseCategoryView = (
            <div className="d-flex justify-content-center">
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-center">
                  <Image
                    width={50}
                    src={expense_category.image.url}
                    preview={false}
                  />
                </div>
                <Text className="text-center my-2">
                  {expense_category.name}
                </Text>
              </div>
            </div>
          );
        }

        return expenseCategoryView;
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
      navigate(`/dashboard/expenses/${id}`);
    }
  };

  const handleEditClick = (id: string) => {
    if (id) {
      navigate(`/dashboard/expenses/${id}/edit`);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (id) {
      await deleteExpenseByIdRequest(id);
    }
  };

  const deleteExpenseByIdRequest = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const data = {
          id: id,
          user_id: userId,
        };
        const response = await axios.post(`${rootUrl}/expenses/remove`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          message.success("Delete Expense success");
          await getExpenseRequest(page, pageSize);
        }
      }
    } catch (e: any) {
      console.log("error = ", e);

      message.error(`Delete Expense fail, error = ${e.message}`);
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
        resultDiv = <Friends />;
        break;
      case "activities":
        resultDiv = <Activity />;
        break;
      case "expenses":
        resultDiv = <div>{renderExpenseView()}</div>;
        break;
      case "account":
        resultDiv = <Account />;
        break;
      default:
        break;
    }

    return resultDiv;
  };

  const renderExpenseView = () => {
    const expenseView = (
      <div>
        <div className="mx-5 my-3 d-flex justify-content-end">
          <Button type="primary" onClick={handleCreateExpenseClick}>
            Create Expense
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
    return expenseView;
  };

  const handleCreateExpenseClick = () => {
    navigate(`/dashboard/expenses/create-expense`);
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

export default Expense;
