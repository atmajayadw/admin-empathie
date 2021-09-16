import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Client from "./pages/Client";
import Add from "./pages/Add";
import AddPhoto from "./pages/AddPhoto";
import Update from "./pages/Update";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <main>
          <Switch>
            <Route exact path="/" render={(props) => <Login />} />
            <Route exact path="/dashboard" render={(props) => <Dashboard />} />
            <Route exact path="/client" render={(props) => <Client />} />
            <Route exact path="/add" render={(props) => <Add />} />
            <Route exact path="/update" render={(props) => <Update />} />
            <Route exact path="/add-photo" render={(props) => <AddPhoto />} />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}
