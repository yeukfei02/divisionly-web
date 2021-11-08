import React from "react";
import SignupAndLoginForm from "../signupAndLoginForm/SignupAndLoginForm";
import Dashboard from "../dashboard/Dashboard";

function MainPage(): JSX.Element {
  const renderDiv = () => {
    let resultDiv = <SignupAndLoginForm />;

    const token = localStorage.getItem("token");
    if (token) {
      resultDiv = <Dashboard />;
    }

    return resultDiv;
  };

  return <div>{renderDiv()}</div>;
}

export default MainPage;
