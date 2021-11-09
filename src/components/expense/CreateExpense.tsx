import React, { useState, useEffect } from "react";
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
import Groups from "../groups/Groups";
import Friends from "../friends/Friends";
import Activity from "../activity/Activity";
import Account from "../account/Account";

const { Dragger } = Upload;
const { Title } = Typography;
const { Option } = Select;

const rootUrl = getRootUrl();

function CreateExpense(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("expenses");

  const [groups, setGroups] = useState([]);

  const [splitMethod, setSplitMethod] = useState("");
  const [groupId, setGroupId] = useState("");
  const [image, setImage] = useState({});

  useEffect(() => {
    getGroupsRequest();
  }, []);

  const getGroupsRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const response = await axios.get(`${rootUrl}/groups`, {
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

          if (responseData && responseData.groups) {
            setGroups(responseData.groups);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

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
      const description = values.description;
      const amount = values.amount;
      if (description && amount && splitMethod && image) {
        await createExpenseRequest(description, amount, splitMethod);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("error = ", errorInfo);
  };

  const createExpenseRequest = async (
    description: string,
    amount: number,
    splitMethod: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const formData = new FormData();
        formData.append("description", description);
        formData.append("amount", amount.toString());
        formData.append("split_method", splitMethod);
        formData.append("user_id", userId);
        formData.append("group_id", groupId);
        formData.append("image", image as any);

        const response = await axios({
          method: "post",
          url: `${rootUrl}/expenses`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          message.success("Create Expense success");
        }
      }
    } catch (e: any) {
      console.log("error = ", e);
      message.error(`Create Expense fail, error = ${e.message}`);
    }
  };

  const onChange = (value: any) => {
    console.log("selected = ", value);
    setSplitMethod(value);
  };

  const onGroupChange = (value: any) => {
    console.log("selected group = ", value);
    setGroupId(value);
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
          setCurrentPage("activities");
          navigate(`/dashboard/activities`);
          break;
        case "4":
          setCurrentPage("expenses");
          navigate(`/dashboard/expenses`);
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
              <Title level={3}>Create Expense</Title>
            </div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter your description" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Amount"
                name="amount"
                rules={[
                  { required: true, message: "Please enter your amount" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select split method"
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
                  <Option value="you_paid_and_split_equally">
                    You paid and split equally
                  </Option>
                  <Option value="you_owed_the_full_amount">
                    You owed the full amount
                  </Option>
                  <Option value="friend_paid_and_split_equally">
                    Friend paid and split equally
                  </Option>
                  <Option value="friend_owed_the_full_amount">
                    Friend owed the full amount
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select group"
                  optionFilterProp="children"
                  onChange={onGroupChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input: string, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {renderGroupOptions()}
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
                  Create Expense
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    );
    return expenseView;
  };

  const renderGroupOptions = () => {
    let groupOptions = null;

    if (groups) {
      groupOptions = groups.map((group: any, i: number) => {
        return (
          <Option key={i} value={group.id}>
            {group.name}
          </Option>
        );
      });
    }

    return groupOptions;
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
            defaultSelectedKeys={["4"]}
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

export default CreateExpense;
