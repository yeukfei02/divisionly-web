import React from "react";
import { Typography, Form, Input, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";

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
      console.log("response = ", response);

      if (response && response.status === 200) {
        navigate(`/dashboard`);
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
            <Title>Divisionly</Title>
          </div>
          <div className="d-flex justify-content-center mb-3">
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
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
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
