import React from "react";
import { Typography, Form, Input, Button, Image, Card } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import logo from "../../images/divisionly.png";

const { Title } = Typography;

const rootUrl = getRootUrl();

function Login(): JSX.Element {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log("values = ", values);

    if (values) {
      const email = values.email;
      const password = values.password;

      if (email && password) {
        await loginRequest(email, password);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("error = ", errorInfo);
  };

  const loginRequest = async (email: string, password: string) => {
    try {
      const data = {
        email: email,
        password: password,
      };
      const response = await axios.post(`${rootUrl}/users/login`, data);
      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          const token = responseData.token;
          const userId = responseData.user.id;
          const avatarUrl = responseData.user.avatar
            ? responseData.user.avatar.url
            : "";
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(responseData.user));
          localStorage.setItem("userId", userId);
          localStorage.setItem("avatarUrl", avatarUrl);

          navigate(`/dashboard/groups`);
        }
      }
    } catch (e) {
      console.log("error =", e);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center my-4">
        <Card className="p-3 w-75">
          <div className="d-flex justify-content-center">
            <Image width={380} src={logo} preview={false} />
          </div>
          <div className="d-flex justify-content-center my-3">
            <Title level={3}>Login</Title>
          </div>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default Login;
