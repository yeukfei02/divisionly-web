import React, { useState } from "react";
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Card,
  Menu,
  Upload,
  Select,
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
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import CustomAvatar from "../customAvatar/CustomAvatar";
import Friends from "../friends/Friends";
import Activity from "../activity/Activity";
import Account from "../account/Account";
import Expense from "../expense/Expense";

const { Dragger } = Upload;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const rootUrl = getRootUrl();

function CreateGroup(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("groups");
  const [groupType, setGroupType] = useState("");
  const [image, setImage] = useState({});

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
          setImage(originFileObj);
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
      if (name && description && groupType && image) {
        await createGroupRequest(name, description, groupType);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("error = ", errorInfo);
  };

  const createGroupRequest = async (
    name: string,
    description: string,
    groupType: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("group_type", groupType);
        formData.append("user_id", userId);
        formData.append("image", image as any);

        const response = await axios({
          method: "post",
          url: `${rootUrl}/groups`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          message.success("Create Group success");
        }
      }
    } catch (e: any) {
      console.log("error = ", e);
      message.error(`Create Group fail, error = ${e.message}`);
    }
  };

  const onChange = (value: any) => {
    console.log("selected = ", value);
    setGroupType(value);
  };

  const onBlur = () => {
    console.log("blur");
  };

  const onFocus = () => {
    console.log("focus");
  };

  const onSearch = (val: string) => {
    console.log("search = ", val);
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
              <Title level={3}>Create Group</Title>
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

              <Form.Item>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select group type"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input: string, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="trip">Trip</Option>
                  <Option value="home">Home</Option>
                  <Option value="couple">Couple</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload image
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
                  Create Group
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    );
    return groupsView;
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

export default CreateGroup;
