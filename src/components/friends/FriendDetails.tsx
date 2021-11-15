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
import Activity from "../activity/Activity";
import Expense from "../expense/Expense";
import Account from "../account/Account";

const { Title, Text } = Typography;

const rootUrl = getRootUrl();

function FriendDetails(): JSX.Element {
  const navigate = useNavigate();
  const urlParams = useParams();

  let id = "";
  if (urlParams && urlParams.id) {
    id = urlParams.id;
  }

  const [currentPage, setCurrentPage] = useState("friends");
  const [friend, setFriend] = useState<any>({});

  useEffect(() => {
    if (id) {
      getFriendByIdRequest(id);
    }
  }, [id]);

  const getFriendByIdRequest = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${rootUrl}/friends/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          if (responseData && responseData.friend) {
            setFriend(responseData.friend);
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
        <div className="d-flex justify-content-start mx-5 my-3">
          <Button type="default" onClick={handleBackButtonClick}>
            Back
          </Button>
        </div>

        <div className="d-flex justify-content-center m-5">
          <Card className="p-3 w-100">
            <div className="d-flex justify-content-center my-3">
              <Title level={3}>Friend Details</Title>
            </div>

            {renderFriendDetails()}
          </Card>
        </div>
      </div>
    );
    return friendsView;
  };

  const renderFriendDetails = () => {
    let friendDetails = null;

    if (friend) {
      friendDetails = (
        <div className="d-flex flex-column my-3">
          <div className="my-3">
            <Title level={4}>Name:</Title>
            <Text>{friend.name}</Text>
          </div>
          <div className="my-3">
            <Title level={4}>Description:</Title>
            <Text>{friend.description}</Text>
          </div>
          <div className="my-3">
            <Title level={4}>Phone number:</Title>
            <Text>{friend.phone_number}</Text>
          </div>
          {renderImage(friend)}
        </div>
      );
    }

    return friendDetails;
  };

  const renderImage = (friend: any) => {
    let image = null;

    if (friend && friend.avatar) {
      image = (
        <div className="d-flex flex-column my-3">
          <Title level={4}>Avatar: </Title>
          <Image width={300} src={friend.avatar.url} />

          <div className="my-3">
            <Title level={5}>Filename: </Title>
            <Text>{friend.avatar.filename}</Text>
          </div>
        </div>
      );
    }

    return image;
  };

  const handleBackButtonClick = () => {
    navigate(`/dashboard/friends`);
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

export default FriendDetails;
