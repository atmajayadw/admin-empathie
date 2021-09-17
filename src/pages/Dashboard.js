import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
export default class Dashboard extends Component {
  render() {
    return (
      <>
        <Navbar />
        <section id="main">
          <div className="container main">
            <div className="menu">
              <div className="add">
                <Link
                  to={{
                    pathname: "/add/",
                    state: "false",
                  }}
                >
                  <span className="btn btn-success">Add</span>
                </Link>
              </div>

              <div className="logout">
                <Link
                  to={{
                    pathname: "/",
                  }}
                  onClick={() => this.handleLogoutClick()}
                >
                  <span className="btn btn-danger">Logout</span>
                </Link>
              </div>
            </div>
            <br />
            <Table />
          </div>
        </section>
      </>
    );
  }
}
