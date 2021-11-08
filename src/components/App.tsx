import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./mainPage/MainPage";
import Dashboard from "./dashboard/Dashboard";
import Groups from "./groups/Groups";
import Friends from "./friends/Friends";
import Activity from "./activity/Activity";
import Account from "./account/Account";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
