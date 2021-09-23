import React, { Component } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import $ from "jquery";

export default class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client_id: "",
      client: "",
      category: "",
      date: "",
      thumbnail: "",
      statusID: "",
    };
  }

  handleChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => this.generateID()
    );
  };

  optionSelectedHandler = (event) => {
    this.setState(
      {
        category: event.target.value,
      },
      () => this.generateID()
    );
  };

  generateID = () => {
    const client = this.state.client.replaceAll(" & ", "-");
    const client_id = (
      this.state.category +
      "-" +
      client.replaceAll(" ", "-") +
      "-" +
      this.state.date
    ).toLowerCase();

    this.setState({
      client_id: client_id,
    });
  };

  fileSelectedHandler = (event) => {
    const thumbnail = event.target.files[0];

    // validation
    if (thumbnail) {
      if (!thumbnail.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        alert("Please select valid image.");
        this.setState({
          thumbnail: "",
        });
        return false;
      }

      if (thumbnail.size > 2000000) {
        alert("Images size too large!");
        this.setState({
          thumbnail: "",
        });
        return false;
      }
    }

    this.setState({
      thumbnail: thumbnail,
    });

    let reader = new FileReader();
    reader.onload = function (e) {
      $("#preview").attr("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  validatingData = () => {
    const client = this.state.client;
    const date = this.state.date;
    const thumbnail = this.state.thumbnail;
    const category = this.state.category;

    if (client === "" || client === undefined) {
      alert("Tolong isi nama client!");
      return false;
    }

    if (category === "" || category === "-") {
      alert("Tolong pilih kategori!");
      return false;
    }

    if (date === "" || date === undefined) {
      alert("Tolong pilih tanggal!");
      return false;
    }

    if (thumbnail === "" || thumbnail === undefined) {
      alert("Tolong pilih foto thumbnail!");
      return false;
    }

    this.checkDataExist();
  };

  checkDataExist = () => {
    const client_id = this.state.client_id;
    const URL = "http://localhost/empathie-rest-server/api/client/";
    axios.get(URL, { params: { checkID: client_id } }).then((res) => {
      this.setState({
        statusID: res.data.status,
      });
      this.checkIDExist();
    });
  };

  checkIDExist = () => {
    if (this.state.statusID === true) {
      alert("Data sudah ada! Mohon cek kembali!");
    } else {
      this.submitData();
    }
  };

  submitData = () => {
    const client_id = this.state.client_id;
    const client = this.state.client;
    const category = this.state.category;
    const date = this.state.date;

    // HTTP Request POST
    const fd = new FormData();
    fd.append("file", this.state.thumbnail, this.state.thumbnail.name);
    fd.append("client_id", client_id);
    fd.append("client", client);
    fd.append("category", category);
    fd.append("date", date);
    fd.append("req", "post");
    axios
      .post("http://localhost/empathie-rest-server/api/client/", fd)
      .then((res) => {
        console.log(res);
        alert("Data berhasil ditambahkan!");
        document.location.href = "/dashboard";
      });

    // console.log(fd);
  };

  render() {
    return (
      <>
        <Navbar />
        <section id="add">
          <div className="container add">
            <form encType="multipart/form-data">
              <div className="form-group">
                <label htmlFor="client">Nama Client</label>
                <input
                  type="text"
                  className="form-control"
                  id="client"
                  name="client"
                  placeholder="Nama Client"
                  onChange={(event) => this.handleChange(event)}
                  required
                />
                <small className="form-text text-muted">
                  Contoh: "Jay {"&"} Jennie"
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="category">Kategori</label>
                <select
                  className="custom-select"
                  name="category"
                  id="category"
                  onChange={this.optionSelectedHandler}
                  required
                >
                  <option value="-">-</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Pre-Wedding">Pre-Wedding</option>
                  <option value="Wedding">Wedding</option>
                </select>
                <small className="form-text text-muted">Pilih Kategori</small>
              </div>

              <div className="form-group">
                <label htmlFor="date">Tanggal acara</label>
                <br />
                <input
                  type="date"
                  name="date"
                  id="date"
                  className="w-100"
                  onChange={(event) => this.handleChange(event)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="thumbnail">Pilih foto thumbnail: </label>
                <br />
                <input
                  type="file"
                  name="thumbnail"
                  id="thumbnail"
                  onChange={this.fileSelectedHandler}
                />
                <img id="preview" src="" alt="preview" />
              </div>

              <div className="buttons d-flex justify-content-between">
                <div className="btn btn-primary" onClick={this.validatingData}>
                  Simpan
                </div>
                <Link to="/dashboard">
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
