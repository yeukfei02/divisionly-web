import React, { useState } from "react";
import {
  Row,
  Col,
  Menu,
  Form,
  Input,
  Typography,
  Button,
  Card,
  message,
} from "antd";
import {
  GroupOutlined,
  UserOutlined,
  MenuOutlined,
  DollarOutlined,
  SettingOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Groups from "../groups/Groups";
import Friends from "../friends/Friends";
import Expense from "../expense/Expense";
import Activity from "../activity/Activity";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import CustomAvatar from "../customAvatar/CustomAvatar";
import Account from "../account/Account";

const { Title } = Typography;

const rootUrl = getRootUrl();

const { TextArea } = Input;

function Contact(): JSX.Element {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("contact");

  const onFinish = async (values: any) => {
    console.log("values = ", values);

    if (values) {
      const subject = values.subject;
      const message = values.message;

      if (subject && message) {
        await contactDivisionlySupportRequest(subject, message);
      }
    }
  };

  const contactDivisionlySupportRequest = async (
    subject: string,
    messageStr: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const data = {
          user_id: userId,
          subject: subject,
          message: messageStr,
        };

        const response = await axios.post(`${rootUrl}/contact`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.status === 200) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          message.success("Contact divisionly support success");
        }
      }
    } catch (e: any) {
      console.log("error =", e);
      message.error(`Contact divisionly support fail, error = ${e.message}`);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("errorInfo = ", errorInfo);
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
        resultDiv = <Account />;
        break;
      case "contact":
        resultDiv = <div>{renderContactView()}</div>;
        break;
      default:
        break;
    }

    return resultDiv;
  };

  const renderContactView = () => {
    const contactView = (
      <div className="d-flex flex-column">
        <div className="mx-5 my-4">
          <Card>
            <div className="d-flex justify-content-center my-3">
              <Title level={3}>Contact divisionly support</Title>
            </div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Subject"
                name="subject"
                rules={[
                  { required: true, message: "Please enter your subject" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                rules={[
                  { required: true, message: "Please enter your message" },
                ]}
              >
                <TextArea rows={5} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    );
    return contactView;
  };

  return (
    <div>
      <Row>
        <Col span={4}>
          <Menu
            onClick={handleClick}
            style={{ height: "100vh" }}
            defaultSelectedKeys={["6"]}
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

export default Contact;
