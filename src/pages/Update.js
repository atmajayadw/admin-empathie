import React, { Component } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import $ from "jquery";

export default class Update extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      old_client_id: "",
      client_id: "",
      client: "",
      category: "",
      date: "",
      thumbnail: "",
      status: "",
      result: [],
      porto_client_id: "",
    };
  }

  componentDidMount() {
    this.getClient();
  }

  getClient = () => {
    const authResult = new URLSearchParams(window.location.search);
    const code = authResult.get("clientID");

    const URL = "http://localhost/empathie-rest-server/api/client/";
    axios
      .get(URL, { params: { client_id: code } })
      .then((res) => {
        const result = res.data;
        this.setState({
          result: result.data,
          thumbnail: result.data[0].thumbnail,
          category: result.data[0].category,
          client: result.data[0].client,
          date: result.data[0].date,
          client_id: result.data[0].client_id,
          old_client_id: result.data[0].client_id,
          id: result.data[0].id,
        });
        this.getPortfolio();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getPortfolio = () => {
    const URL = "http://localhost/empathie-rest-server/api/portfolio/";
    axios
      .get(URL, { params: { client_id: this.state.client_id } })
      .then((res) => {
        const portfolio = res.data;
        this.setState({
          porto_client_id: portfolio.data[0].client_id,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          porto_client_id: this.state.old_client_id,
        });
      });
  };

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

    if (this.state.client_id !== this.state.old_client_id) {
      this.checkDataExist();
    } else {
      this.submitData();
    }
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
    const id = this.state.id;
    const client_id = this.state.client_id;
    const client = this.state.client;
    const category = this.state.category;
    const date = this.state.date;
    const thumbnail = this.state.thumbnail;

    const req = "put";
    const URL = "http://localhost/empathie-rest-server/api/client/";

    if ($("#newThumbnail").get(0).files.length === 0) {
      const data = {
        req: req,
        id: id,
        client: client,
        category: category,
        date: date,
        thumbnail: thumbnail,
        client_id: client_id,
      };

      axios
        .post(URL, data)
        .then((res) => {
          console.log(res);
          this.updatePortfolio();
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      const fd = new FormData();
      fd.append("file", this.state.thumbnail, this.state.thumbnail.name);
      fd.append("client_id", client_id);
      fd.append("client", client);
      fd.append("category", category);
      fd.append("date", date);
      fd.append("id", id);
      fd.append("req", "put");

      axios
        .post(URL, fd)
        .then((res) => {
          console.log(res);
          alert("Data updated!");
          document.location.href = "/dashboard";
          this.updatePortfolio();
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  updatePortfolio = () => {
    const old_client_id = this.state.porto_client_id;
    const new_client_id = this.state.client_id;
    const URL = "http://localhost/empathie-rest-server/api/portfolio/";

    const data = {
      old_client_id: old_client_id,
      new_client_id: new_client_id,
    };

    axios
      .put(URL, data)
      .then((res) => {
        console.log(res);
        alert("Data updated!");
        document.location.href = "/dashboard";
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  render() {
    const { result } = this.state;

    return (
      <>
        <Navbar />
        <section id="update">
          <div className="container update">
            {result &&
              result.map((res, index) => (
                <form encType="multipart/form-data" key="index">
                  {/* {result && result.map((res, index) =>())} */}

                  <div className="form-group">
                    <label htmlFor="client">Nama Client</label>
                    <input
                      type="text"
                      className="form-control"
                      name="client"
                      placeholder="Nama Client"
                      onChange={(event) => this.handleChange(event)}
                      defaultValue={res.client}
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
                      <option value={res.category}>{res.category}</option>
                      <option value="-">-</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Wedding">Wedding</option>
                    </select>
                    <small className="form-text text-muted">
                      Pilih Kategori
                    </small>
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
                      defaultValue={res.date}
                    />
                  </div>

                  <div className="form-group">
                    <hr />
                    <h5>Thumbnail</h5>
                    <div className="row">
                      <div className="col-md">
                        <p>Before</p>
                        <img
                          key={index}
                          id="thumbnail"
                          className="img=fluid"
                          src={
                            "http://localhost/empathie-rest-server/uploads/thumbnail/" +
                            res.thumbnail
                          }
                          alt={res.thumbnail}
                          width="400px"
                        />
                      </div>
                      <div className="col-md">
                        <p>After</p>
                        <img
                          id="preview"
                          src=""
                          className="img-fluid"
                          alt="preview"
                        />
                      </div>
                    </div>
                    <br />
                    <label htmlFor="thumbnail">
                      Pilih foto thumbnail baru:{" "}
                    </label>
                    <br />
                    <input
                      type="file"
                      name="thumbnail"
                      id="newThumbnail"
                      onChange={this.fileSelectedHandler}
                    />
                  </div>

                  <div className="buttons d-flex justify-content-between">
                    <div
                      className="btn btn-primary"
                      onClick={this.validatingData}
                    >
                      Simpan
                    </div>
                    <Link to="/dashboard">
                      <div className="btn btn-warning">Kembali</div>
                    </Link>
                  </div>
                </form>
              ))}
          </div>
        </section>
      </>
    );
  }
}
