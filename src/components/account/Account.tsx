import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Menu,
  Form,
  Input,
  Button,
  Image,
  Typography,
  Card,
  Upload,
  message,
} from "antd";
import {
  GroupOutlined,
  UserOutlined,
  MenuOutlined,
  DollarOutlined,
  SettingOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Groups from "../groups/Groups";
import Friends from "../friends/Friends";
import Expense from "../expense/Expense";
import Activity from "../activity/Activity";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";

const rootUrl = getRootUrl();

const { Dragger } = Upload;
const { Title } = Typography;

function Account(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("account");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");

  const [avatar, setAvatar] = useState({});

  const props = {
    name: "file",
    multiple: false,
    action: `${rootUrl}/users/upload`,
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log("info.file = ", info.file);
        console.log("info.fileList = ", info.fileList);

        const originFileObj = info.file.originFileObj;
        if (originFileObj) {
          setAvatar(originFileObj);
        }
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      console.log("Dropped files = ", e.dataTransfer.files);
    },
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = () => {
    const avatarUrl = localStorage.getItem("avatarUrl");
    if (avatarUrl) setAvatarUrl(avatarUrl);

    const user = localStorage.getItem("user");
    if (user) {
      const userJSON = JSON.parse(user);
      if (userJSON) {
        const fullName = `${userJSON.first_name} ${userJSON.last_name}`;
        setUsername(fullName);
      }
    }
  };

  const onUpdateUserFinish = async (values: any) => {
    console.log("values = ", values);

    if (values) {
      const firstName = values.firstName;
      const lastName = values.lastName;
      if (firstName && lastName && avatar) {
        await updateUserRequest(firstName, lastName, avatar);
      }
    }
  };

  const onUpdateUserFinishFailed = (errorInfo: any) => {
    console.log("errorInfo = ", errorInfo);
  };

  const onChangePasswordFinish = async (values: any) => {
    console.log("values = ", values);

    if (values) {
      const oldPassword = values.oldPassword;
      const newPassword = values.newPassword;
      if (oldPassword && newPassword) {
        await changePasswordRequest(oldPassword, newPassword);
      }
    }
  };

  const onChangePasswordFinishFailed = (errorInfo: any) => {
    console.log("errorInfo = ", errorInfo);
  };

  const updateUserRequest = async (
    firstName: string,
    lastName: string,
    avatar: any
  ) => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("avatar", avatar);

        const response = await axios.put(
          `${rootUrl}/users/${userId}/update-user`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          message.success(
            "Update user success, logout and login again to see the update"
          );
        }
      }
    } catch (e: any) {
      console.log("error =", e);
      message.error(`Update user fail, error = ${e.message}`);
    }
  };

  const changePasswordRequest = async (
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const data = {
          old_password: oldPassword,
          new_password: newPassword,
        };
        const response = await axios.post(
          `${rootUrl}/users/${userId}/change-password`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          message.success(`Change password success`);
        }
      }
    } catch (e: any) {
      console.log("error = ", e);

      message.error(`Change password fail, error = ${e.message}`);
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
        resultDiv = <Expense />;
        break;
      case "account":
        resultDiv = <div>{renderAccountView()}</div>;
        break;
      default:
        break;
    }

    return resultDiv;
  };

  const renderAccountView = () => {
    const accountView = (
      <div className="d-flex flex-column m-5">
        <div className="d-flex justify-content-center">
          <Image width={200} src={avatarUrl} />
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Title level={2}>{username}</Title>
        </div>

        <div className="mx-5 my-4">
          <Card>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onUpdateUserFinish}
              onFinishFailed={onUpdateUserFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="First name"
                name="firstName"
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Last name"
                name="lastName"
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload avatar
                  </p>
                  <p className="ant-upload-hint">
                    Only support for a single upload.
                  </p>
                </Dragger>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Update user
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card className="my-4">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onChangePasswordFinish}
              onFinishFailed={onChangePasswordFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Old password"
                name="oldPassword"
                rules={[
                  { required: true, message: "Please enter your old password" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="New password"
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter your new password" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Change password
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Form className="my-4">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                danger
                style={{ width: "100%" }}
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
    return accountView;
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    navigate(`/`);
    window.location.reload();
  };

  return (
    <div>
      <Row>
        <Col span={4}>
          <Menu
            onClick={handleClick}
            style={{ height: "100vh" }}
            defaultSelectedKeys={["5"]}
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
        <Col span={20}>{renderDiv()}</Col>
      </Row>
    </div>
  );
}

export default Account;
