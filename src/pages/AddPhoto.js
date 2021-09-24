import React, { Component } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import $ from "jquery";

export default class AddPhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client_id: "",
      photo: "",
      id: "",
    };
  }

  componentDidMount() {
    this.getClientID();
  }

  getClientID = () => {
    const authResult = new URLSearchParams(window.location.search);
    const code = authResult.get("clientID");

    this.setState({
      client_id: code,
    });
  };

  fileSelectedHandler = (event) => {
    const photo = event.target.files[0];

    // validation
    if (photo) {
      if (!photo.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        alert("Please select valid image.");
        this.setState({
          photo: "",
        });
        return false;
      }

      if (photo.size > 2000000) {
        alert("Images size too large!");
        this.setState({
          photo: "",
        });
        return false;
      }
    }

    this.setState({
      photo: photo,
    });

    let reader = new FileReader();
    reader.onload = function (e) {
      $("#preview").attr("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  validatingData = () => {
    const photo = this.state.photo;

    if (photo === "" || photo === undefined) {
      alert("Please select image.");
      return false;
    }

    this.submitData();
  };

  submitData = () => {
    const client_id = this.state.client_id;

    // HTTP Request POST
    const fd = new FormData();
    fd.append("file", this.state.photo, this.state.photo.name);
    fd.append("client_id", client_id);
    fd.append("req", "post");
    axios
      .post("http://localhost/empathie-rest-server/api/portfolio/", fd)
      .then((res) => {
        console.log(res);
        alert("file uploaded!");
        document.location.href = "/dashboard";
      });
  };

  render() {
    return (
      <>
        <Navbar />
        <section id="addPhoto">
          <div className="container addPhoto mt-2">
            <h2>Add Photo</h2>
            <form encType="multipart/form-data">
              <div className="form-group">
                <label htmlFor="client_id">Client ID</label>
                <br />
                <input
                  id="client_id"
                  name="client_id"
                  value={this.state.client_id}
                  disabled="disabled"
                  className="w-100"
                />
              </div>
              <div className="form-group">
                <label htmlFor="photo">Pilih foto:</label>
                <br />
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={this.fileSelectedHandler}
                  required
                />
              </div>

              <div className="buttons d-flex justify-content-between">
                <div className="btn btn-primary" onClick={this.validatingData}>
                  Simpan
                </div>
                <Link
                  to={{
                    pathname: "/client/",
                    search: "?clientID=" + this.state.client_id,
                  }}
                >
                  <div className="btn btn-warning">Kembali</div>
                </Link>
              </div>
            </form>
          </div>
        </section>
      </>
    );
  }
}
