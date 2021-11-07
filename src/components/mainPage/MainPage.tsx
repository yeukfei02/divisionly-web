import React from "react";
import { Tabs } from "antd";
import Signup from "../signup/Signup";
import Login from "../login/Login";

const { TabPane } = Tabs;

function callback(key: any) {
  console.log(key);
}

function MainPage(): JSX.Element {
  return (
    <div className="d-flex justify-content-center my-5">
      <div className="p-3 w-75 border border-info border-2 rounded">
        <Tabs defaultActiveKey="2" onChange={callback}>
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

export default MainPage;
