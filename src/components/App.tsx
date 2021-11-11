import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./mainPage/MainPage";
import Groups from "./groups/Groups";
import CreateGroup from "./groups/CreateGroup";
import GroupDetails from "./groups/GroupDetails";
import EditGroup from "./groups/EditGroup";
import Friends from "./friends/Friends";
import CreateFriend from "./friends/CreateFriend";
import FriendDetails from "./friends/FriendDetails";
import EditFriend from "./friends/EditFriend";
import Activity from "./activity/Activity";
// import CreateActivity from "./activity/CreateActivity";
import ActivityDetails from "./activity/ActivityDetails";
import Expense from "./expense/Expense";
import CreateExpense from "./expense/CreateExpense";
import ExpenseDetails from "./expense/ExpenseDetails";
import EditExpense from "./expense/EditExpense";
import Account from "./account/Account";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard/groups" element={<Groups />} />
        <Route
          path="/dashboard/groups/create-group"
          element={<CreateGroup />}
        />
        <Route path="/dashboard/groups/:id" element={<GroupDetails />} />
        <Route path="/dashboard/groups/:id/edit" element={<EditGroup />} />
        <Route path="/dashboard/friends" element={<Friends />} />
        <Route
          path="/dashboard/friends/create-friend"
          element={<CreateFriend />}
        />
        <Route path="/dashboard/friends/:id" element={<FriendDetails />} />
        <Route path="/dashboard/friends/:id/edit" element={<EditFriend />} />
        <Route path="/dashboard/activities" element={<Activity />} />
        {/* <Route
          path="/dashboard/activities/create-activity"
          element={<CreateActivity />}
        /> */}
        <Route path="/dashboard/activities/:id" element={<ActivityDetails />} />
        <Route path="/dashboard/expenses" element={<Expense />} />
        <Route
          path="/dashboard/expenses/create-expense"
          element={<CreateExpense />}
        />
        <Route path="/dashboard/expenses/:id" element={<ExpenseDetails />} />
        <Route path="/dashboard/expenses/:id/edit" element={<EditExpense />} />
        <Route path="/dashboard/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
