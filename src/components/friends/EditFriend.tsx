import React, { useState } from "react";
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Menu,
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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import CustomAvatar from "../customAvatar/CustomAvatar";
import Groups from "../groups/Groups";
import Activity from "../activity/Activity";
import Expense from "../expense/Expense";
import Account from "../account/Account";

const { Dragger } = Upload;
const { Title } = Typography;
const { TextArea } = Input;

const rootUrl = getRootUrl();

function EditFriend(): JSX.Element {
  const navigate = useNavigate();
  const urlParams = useParams();

  let id = "";
  if (urlParams && urlParams.id) {
    id = urlParams.id;
  }

  const [currentPage, setCurrentPage] = useState("friends");
  const [avatar, setAvatar] = useState({});

  const props = {
    name: "file",
    multiple: false,
    action: `${rootUrl}/files/upload`,
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

  const onFinish = async (values: any) => {
    console.log("values = ", values);

    if (values) {
      const name = values.name;
      const description = values.description;
      const phoneNumber = values.phoneNumber;
      if (name && description && phoneNumber && avatar) {
        await updateFriendRequest(name, description, phoneNumber);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("error = ", errorInfo);
  };

  const updateFriendRequest = async (
    name: string,
    description: string,
    phoneNumber: number
  ) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("phone_number", phoneNumber.toString());
        formData.append("user_id", userId);
        formData.append("avatar", avatar as any);

        const response = await axios({
          method: "put",
          url: `${rootUrl}/friends/${id}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          message.success("Edit Friend success");
        }
      }
    } catch (e: any) {
      console.log("error = ", e);
      message.error(`Edit Friend fail, error = ${e.message}`);
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
        <div className="mx-5 my-3 d-flex justify-content-start">
          <Button type="default" onClick={handleBackButtonClick}>
            Back
          </Button>
        </div>

        <div className="m-5 d-flex justify-content-center">
          <Card className="p-3 w-100">
            <div className="my-3 d-flex justify-content-center">
              <Title level={3}>Edit Friend</Title>
            </div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter your description" },
                ]}
              >
                <TextArea rows={5} />
              </Form.Item>

              <Form.Item
                label="Phone number"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
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
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                >
                  Edit Friend
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    );
    return friendsView;
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

export default EditFriend;
