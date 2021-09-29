import React, { Component } from "react";
import axios from "axios";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      result: [],
    };
  }

  componentDidMount() {
    if (this.props.checkLoginStatus() === true) {
      this.props.history.push("/dashboard");
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = () => {
    this.checkExistAccount();
  };

  checkExistAccount = () => {
    const username = this.state.username;
    const URL = "http://localhost/empathie-rest-server/api/login/";
    axios
      .get(URL, { params: { username: username } })
      .then((res) => {
        const result = res.data;
        this.setState({ result: result.data });
        this.checkCurrentAccount();
      })
      .catch((error) => {
        alert("Username / Password salah!");
      });
  };

  checkCurrentAccount = () => {
    const username = this.state.username;
    const password = this.state.password;
    const db_id = this.state.result[0].id;
    const db_username = this.state.result[0].username;
    const db_password = this.state.result[0].password;
    const db_uniqid = this.state.result[0].uniqid;

    if (username === db_username && password === db_password) {
      const user = {
        id: db_id,
        username: db_username,
        password: db_password,
        uniqid: db_uniqid,
      };
      this.handleAuth(user);
    } else {
      alert("Username / Password salah!");
    }
  };

  handleAuth = (user_data) => {
    this.props.handleLogin(user_data);
    this.props.history.push("/dashboard");
  };

  render() {
    return (
      <section id="login">
        <div className="container">
          <div className="login">
            <h1>Login</h1>
            <form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  autoComplete="off"
                  onChange={(event) => this.handleChange(event)}
                />
                <small className="form-text text-muted">Your username</small>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  autoComplete="off"
                  onChange={(event) => this.handleChange(event)}
                />
                <small className="form-text text-muted">Your Password</small>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
}
