import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Button, Card, Menu, Image } from "antd";
import {
  GroupOutlined,
  UserOutlined,
  MenuOutlined,
  DollarOutlined,
  SettingOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getRootUrl, capitalizeFirstLetter } from "../../helpers/helpers";
import CustomAvatar from "../customAvatar/CustomAvatar";
import Friends from "../friends/Friends";
import Activity from "../activity/Activity";
import Account from "../account/Account";
import Expense from "../expense/Expense";
import Contact from "../contact/Contact";

const { Title, Text } = Typography;

const rootUrl = getRootUrl();

function GroupDetails(): JSX.Element {
  const navigate = useNavigate();
  const urlParams = useParams();

  let id = "";
  if (urlParams && urlParams.id) {
    id = urlParams.id;
  }

  const [currentPage, setCurrentPage] = useState("groups");
  const [group, setGroup] = useState<any>({});

  useEffect(() => {
    if (id) {
      getGroupByIdRequest(id);
    }
  }, [id]);

  const getGroupByIdRequest = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${rootUrl}/groups/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          if (responseData && responseData.group) {
            setGroup(responseData.group);
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
        resultDiv = <div>{renderGroupsView()}</div>;
        break;
      case "friends":
        resultDiv = <Friends />;
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
      case "contact":
        resultDiv = <Contact />;
        break;
      default:
        break;
    }

    return resultDiv;
  };

  const renderGroupsView = () => {
    const groupsView = (
      <div>
        <div className="d-flex justify-content-start mx-5 my-3">
          <Button type="default" onClick={handleBackButtonClick}>
            Back
          </Button>
        </div>

        <div className="d-flex justify-content-center m-5">
          <Card className="p-3 w-100">
            <div className="d-flex justify-content-center my-3">
              <Title level={3}>Group Details</Title>
            </div>

            {renderGroupDetails()}
          </Card>
        </div>
      </div>
    );
    return groupsView;
  };

  const renderGroupDetails = () => {
    let groupDetails = null;

    if (group) {
      groupDetails = (
        <div className="d-flex flex-column my-3">
          {renderName(group)}
          {renderDescription(group)}
          {renderGroupType(group)}
          {renderImage(group)}
        </div>
      );
    }

    return groupDetails;
  };

  const renderName = (group: any) => {
    let name = null;

    if (group && group.name) {
      name = (
        <div className="my-3">
          <Title level={4}>Name:</Title>
          <Text>{group.name}</Text>
        </div>
      );
    }

    return name;
  };

  const renderDescription = (group: any) => {
    let description = null;

    if (group && group.description) {
      description = (
        <div className="my-3">
          <Title level={4}>Description:</Title>
          <Text>{group.description}</Text>
        </div>
      );
    }

    return description;
  };

  const renderGroupType = (group: any) => {
    let groupType = null;

    if (group && group.group_type) {
      groupType = (
        <div className="my-3">
          <Title level={4}>Group type: </Title>
          <Text>{capitalizeFirstLetter(group.group_type)}</Text>
        </div>
      );
    }

    return groupType;
  };

  const renderImage = (group: any) => {
    let image = null;

    if (group && group.image) {
      image = (
        <div className="d-flex flex-column my-3">
          <Title level={4}>Image: </Title>
          <Image width={300} src={group.image.url} />

          <div className="my-3">
            <Title level={5}>Filename: </Title>
            <Text>{group.image.filename}</Text>
          </div>
        </div>
      );
    }

    return image;
  };

  const handleBackButtonClick = () => {
    navigate(`/dashboard/groups`);
  };

  return (
    <div>
      <Row>
        <Col span={4}>
          <Menu
            onClick={handleClick}
            style={{ height: "100vh" }}
            defaultSelectedKeys={["1"]}
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

export default GroupDetails;
