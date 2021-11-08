import React from "react";
import { Tabs } from "antd";
import Signup from "../signup/Signup";
import Login from "../login/Login";

const { TabPane } = Tabs;

function callback(key: string) {
  console.log(key);
}

function SignupAndLoginForm(): JSX.Element {
  return (
    <div className="my-3">
      <div className="d-flex justify-content-center">
        <Tabs className="w-75" defaultActiveKey="2" onChange={callback}>
          <TabPane tab="Signup" key="1">
            <Signup />
          </TabPane>
          <TabPane tab="Login" key="2">
            <Login />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default SignupAndLoginForm;
