import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import qs from "qs";

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
    };
  }

  componentDidMount() {
    this.getAllData();
  }

  getAllData = () => {
    const URL = "http://localhost/empathie-rest-server/api/client/";
    axios
      .get(URL)
      .then((res) => {
        const results = res.data;
        this.setState({ results: results.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleDelete = (client_id) => {
    if (window.confirm("Anda Yakin?")) {
      const URL = "http://localhost/empathie-rest-server/api/client/";
      axios({
        method: "delete",
        url: URL,
        data: qs.stringify({
          client_id: client_id,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
        .then((res) => {
          alert("berhasil!");
          this.getAllData();
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(client_id);
    } else {
      return false;
    }
  };

  render() {
    const { results } = this.state;

    return (
      <>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">No</th>
                <th scope="col">Client</th>
                <th scope="col">Kategori</th>
                <th scope="col">Tanggal</th>
                <th scope="col">Thumbnail</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{result.client}</td>
                  <td>{result.category}</td>
                  <td>{result.date}</td>
                  <td>
                    <img
                      src={
                        "http://localhost/empathie-rest-server/uploads/thumbnail/" +
                        result.thumbnail
                      }
                      width={200}
                      alt=""
                    />
                  </td>
                  <td>
                    <Link
                      to={{
                        pathname: "/client/",
                        search: "?clientID=" + result.client_id,
                      }}
                    >
                      <span className="btn btn-info btn-edit mr-2">Detail</span>
                    </Link>
                    <span
                      className="btn btn-danger btn-delete"
                      onClick={() => this.handleDelete(result.client_id)}
                    >
                      Hapus
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
