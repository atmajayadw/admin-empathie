import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Client from "./pages/Client";
import Add from "./pages/Add";
import AddPhoto from "./pages/AddPhoto";
import Update from "./pages/Update";
import axios from "axios";
import Cookies from "js-cookie";
import Sha256 from "./lib/sha256.js";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {
        id: "0",
        username: "default",
        password: "",
        uniqid: "",
      },
    };
  }

  handleLogin = (user_data) => {
    alert("login berhasil!");
    this.setState({
      loggedInStatus: "LOGGED_IN",
      user: {
        id: user_data.id,
        username: user_data.username,
        password: user_data.password,
        uniqid: user_data.uniqid,
      },
    });
    this.setCookie(user_data.password);
  };

  setCookie = (user_data) => {
    const hash = Sha256.hash(user_data);
    Cookies.set("key", hash);
  };

  handleLogout = () => {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN",
    });

    Cookies.remove("key");
    document.location.href = "/";
  };

  checkLoginStatus = () => {
    const cookie = Cookies.get("key");
    if (cookie) {
      const URL = "http://localhost/empathie-rest-server/api/login/";
      axios
        .get(URL, { params: { uniqid: cookie } })
        .then((res) => {
          const key = res.data.data[0].uniqid;
          const id = res.data.data[0].id;
          const username = res.data.data[0].username;
          const password = res.data.data[0].password;
          if (cookie === key) {
            this.setState({
              loggedInStatus: "LOGGED_IN",
              user: {
                id: id,
                username: username,
                password: password,
                uniqid: key,
              },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Please login first!");
          document.location.href = "/";
        });
      return true;
    } else {
      Cookies.remove("key");
      return false;
    }
  };

  render() {
    return (
      <BrowserRouter>
        <main>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Login
                  {...props}
                  handleLogin={this.handleLogin}
                  handleLogout={this.handleLogout}
                  checkLoginStatus={this.checkLoginStatus}
                />
              )}
            />
            <Route
              exact
              path="/dashboard"
              render={(props) => (
                <Dashboard
                  {...props}
                  handleLogout={this.handleLogout}
                  user={this.state.user}
                  checkLoginStatus={this.checkLoginStatus}
                />
              )}
            />
            <Route
              exact
              path="/client"
              render={(props) => (
                <Client
                  {...props}
                  user={this.state.user}
                  checkLoginStatus={this.checkLoginStatus}
                />
              )}
            />
            <Route
              exact
              path="/add"
              render={(props) => (
                <Add
                  {...props}
                  user={this.state.user}
                  checkLoginStatus={this.checkLoginStatus}
                />
              )}
            />
            <Route
              exact
              path="/update"
              render={(props) => (
                <Update
                  {...props}
                  user={this.state.user}
                  checkLoginStatus={this.checkLoginStatus}
                />
              )}
            />
            <Route
              exact
              path="/add-photo"
              render={(props) => (
                <AddPhoto
                  {...props}
                  user={this.state.user}
                  checkLoginStatus={this.checkLoginStatus}
                />
              )}
            />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}
