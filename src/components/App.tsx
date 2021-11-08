import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./mainPage/MainPage";
import Groups from "./groups/Groups";
import Friends from "./friends/Friends";
import Activity from "./activity/Activity";
import Expense from "./expense/Expense";
import Account from "./account/Account";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard/groups" element={<Groups />} />
        <Route path="/dashboard/friends" element={<Friends />} />
        <Route path="/dashboard/activity" element={<Activity />} />
        <Route path="/dashboard/expense" element={<Expense />} />
        <Route path="/dashboard/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
