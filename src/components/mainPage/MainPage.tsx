import React from "react";
import SignupAndLoginForm from "../signupAndLoginForm/SignupAndLoginForm";
import Groups from "../groups/Groups";

function MainPage(): JSX.Element {
  const renderDiv = () => {
    let resultDiv = <SignupAndLoginForm />;

    const token = localStorage.getItem("token");
    if (token) {
      resultDiv = <Groups />;
    }

    return resultDiv;
  };

  return <div>{renderDiv()}</div>;
}

export default MainPage;
