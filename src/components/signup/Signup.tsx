import React, { useState } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Card,
  Image,
  Upload,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import logo from "../../images/divisionly.png";

const { Dragger } = Upload;
const { Title } = Typography;

const rootUrl = getRootUrl();

function Signup(): JSX.Element {
  const navigate = useNavigate();

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

  const onFinish = async (values: any) => {
    console.log("values = ", values);

    if (values) {
      const email = values.email;
      const password = values.password;

      if (email && password && avatar) {
        await signupRequest(email, password, avatar);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("error = ", errorInfo);
  };

  const signupRequest = async (
    email: string,
    password: string,
    avatar: any
  ) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);

      const response = await axios.post(`${rootUrl}/users/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        navigate(`/dashboard/groups`);
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
            <Title level={3}>Signup</Title>
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
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload avatar image
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
                Signup
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default Signup;
