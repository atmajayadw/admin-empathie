import React, { Component } from "react";
import Navbar from "../components/Navbar";
import TableClient from "../components/TableClient";
import axios from "axios";
import { Link } from "react-router-dom";

export default class Client extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      client: "",
      category: "",
      thumbnail: "",
      date: "",
      client_id: "",
      result: [],
      // photos: [],
      // photo: "",
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
          client: result.data[0].client,
          category: result.data[0].category,
          date: result.data[0].date,
          thumbnail: result.data[0].thumbnail,
          id: result.data[0].id,
          client_id: result.data[0].client_id,
        });
        // this.getPhoto();
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log(code);
  };

  render() {
    const { result } = this.state;

    return (
      <>
        <Navbar />
        <section id="client">
          <div className="container client">
            <div className="row">
              <div className="col-md">
                {result &&
                  result.map((res, index) => (
                    <div className="result" key={index}>
                      <h1>{res.client}</h1>
                      <h5>{res.category}</h5>
                      <h5>{res.date}</h5>
                      <Link
                        to={{
                          pathname: "/update/",
                          search: "?clientID=" + res.client_id,
                        }}
                      >
                        <span className="btn btn-warning btn-edit mr-2">
                          Edit Client
                        </span>
                      </Link>
                      <Link
                        to={{
                          pathname: "/add-photo/",
                          search: "?clientID=" + res.client_id,
                        }}
                      >
                        <span className="btn btn-success btn-addphoto">
                          Add Photo
                        </span>
                      </Link>
                    </div>
                  ))}
              </div>

              <div className="col-md d-flex justify-content-lg-end mr-5">
                <img
                  className="mt-3 "
                  // src={
                  //   "http://localhost/empathie-rest-server/uploads/thumbnail/" +
                  //   result.thumbnail
                  // }

                  src={
                    "http://localhost/empathie-rest-server/uploads/thumbnail/614cae7364683.jpg"
                  }
                  width={200}
                  alt=""
                />
              </div>
            </div>
          </div>
          <hr />
          <TableClient />
        </section>
      </>
    );
  }
}
