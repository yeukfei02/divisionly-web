import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Button, Card, Menu, Image } from "antd";
import {
  GroupOutlined,
  UserOutlined,
  MenuOutlined,
  DollarOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import CustomAvatar from "../customAvatar/CustomAvatar";
import Groups from "../groups/Groups";
import Friends from "../friends/Friends";
import Activity from "../activity/Activity";
import Account from "../account/Account";

const { Title, Text } = Typography;

const rootUrl = getRootUrl();

function ExpenseDetails(): JSX.Element {
  const navigate = useNavigate();
  const urlParams = useParams();

  let id = "";
  if (urlParams && urlParams.id) {
    id = urlParams.id;
  }

  const [currentPage, setCurrentPage] = useState("expenses");
  const [expense, setExpense] = useState<any>({});

  useEffect(() => {
    if (id) {
      getExpenseByIdRequest(id);
    }
  }, [id]);

  const getExpenseByIdRequest = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${rootUrl}/expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          if (responseData && responseData.expense) {
            setExpense(responseData.expense);
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
        <div className="d-flex justify-content-start mx-5 my-3">
          <Button type="default" onClick={handleBackButtonClick}>
            Back
          </Button>
        </div>

        <div className="d-flex justify-content-center m-5">
          <Card className="p-3 w-100">
            <div className="d-flex justify-content-center my-3">
              <Title level={3}>Expense Details</Title>
            </div>

            {renderExpenseDetails()}
          </Card>
        </div>
      </div>
    );
    return expenseView;
  };

  const renderExpenseDetails = () => {
    let expenseDetails = null;

    if (expense) {
      expenseDetails = (
        <div className="d-flex flex-column my-3">
          {renderDescription(expense)}
          {renderAmount(expense)}
          {renderSplitMethod(expense)}
          {renderFriend(expense)}
          {renderGroup(expense)}
          {renderExpenseCategoryImage(expense)}
          {renderCurrency(expense)}
          {renderImage(expense)}
        </div>
      );
    }

    return expenseDetails;
  };

  const renderDescription = (expense: any) => {
    let description = null;

    if (expense && expense.description) {
      description = (
        <div className="my-3">
          <Title level={4}>Description:</Title>
          <Text>{expense.description}</Text>
        </div>
      );
    }

    return description;
  };

  const renderAmount = (expense: any) => {
    let amount = null;

    if (expense && expense.amount) {
      amount = (
        <div className="my-3">
          <Title level={4}>Amount:</Title>
          <Text>{expense.amount}</Text>
        </div>
      );
    }

    return amount;
  };

  const renderSplitMethod = (expense: any) => {
    let splitMethod = null;

    if (expense && expense.split_method) {
      splitMethod = (
        <div className="my-3">
          <Title level={4}>Split method:</Title>
          <Text>
            {expense.split_method
              ? expense.split_method.replace(/[_]/g, " ")
              : ""}
          </Text>
        </div>
      );
    }

    return splitMethod;
  };

  const renderFriend = (expense: any) => {
    let friend = null;

    if (expense && expense.friend) {
      friend = (
        <div
          className="my-3"
          onClick={() =>
            goToFriendDetails(expense.friend ? expense.friend.id : "")
          }
        >
          <Title level={4}>Friend:</Title>
          <a className="display-link">
            {expense.friend ? expense.friend.id : ""}
          </a>
        </div>
      );
    }

    return friend;
  };

  const renderGroup = (expense: any) => {
    let group = null;

    if (expense && expense.group) {
      group = (
        <div
          className="my-3"
          onClick={() =>
            goToGroupDetails(expense.group ? expense.group.id : "")
          }
        >
          <Title level={4}>Group:</Title>
          <a className="display-link">
            {expense.group ? expense.group.id : ""}
          </a>
        </div>
      );
    }

    return group;
  };

  const renderExpenseCategoryImage = (expense: any) => {
    let image = null;

    if (expense && expense.expense_category && expense.expense_category.image) {
      image = (
        <div className="d-flex flex-column my-3">
          <Title level={4}>Expense category: </Title>
          <Image
            width={100}
            src={expense.expense_category.image.url}
            preview={false}
          />

          <div className="my-3">
            <Title level={5}>Filename: </Title>
            <Text>{expense.expense_category.image.filename}</Text>
          </div>
        </div>
      );
    }

    return image;
  };

  const renderCurrency = (expense: any) => {
    let currency = null;

    if (expense && expense.currency) {
      currency = (
        <div className="my-3">
          <Title level={4}>Currency:</Title>
          <Text>{expense.currency ? expense.currency.name : ""}</Text>
        </div>
      );
    }

    return currency;
  };

  const renderImage = (expense: any) => {
    let image = null;

    if (expense && expense.image) {
      image = (
        <div className="d-flex flex-column my-3">
          <Title level={4}>Image: </Title>
          <Image width={300} src={expense.image.url} />

          <div className="my-3">
            <Title level={5}>Filename: </Title>
            <Text>{expense.image.filename}</Text>
          </div>
        </div>
      );
    }

    return image;
  };

  const goToFriendDetails = (id: string) => {
    navigate(`/dashboard/friends/${id}`);
  };

  const goToGroupDetails = (id: string) => {
    navigate(`/dashboard/groups/${id}`);
  };

  const handleBackButtonClick = () => {
    navigate(`/dashboard/expenses`);
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

export default ExpenseDetails;
