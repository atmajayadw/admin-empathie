import React, { Component } from "react";
import axios from "axios";
import qs from "qs";

export default class TableClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      photo: "",
    };
  }

  componentDidMount() {
    this.getAllData();
  }

  getAllData = () => {
    const authResult = new URLSearchParams(window.location.search);
    const client_id = authResult.get("clientID");

    const URL = "http://localhost/empathie-rest-server/api/portfolio/";
    axios
      .get(URL, { params: { client_id: client_id } })
      .then((res) => {
        const photos = res.data;
        this.setState({
          photos: photos.data,
          photo: photos.data[0].photo,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleDelete = (id) => {
    if (window.confirm("Anda Yakin?")) {
      const URL = "http://localhost/empathie-rest-server/api/portfolio/";
      axios({
        method: "delete",
        url: URL,
        data: qs.stringify({
          id: id,
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
    } else {
      return false;
    }
  };

  render() {
    const { photos } = this.state;

    return (
      <>
        <div className="table-responsive p-3">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No</th>
                <th>Foto</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {photos &&
                photos.map((photos, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={
                          "http://localhost/empathie-rest-server/uploads/" +
                          photos.photo
                        }
                        width={200}
                        alt=""
                      />
                    </td>
                    <td>
                      <span
                        className="btn btn-danger btn-delete"
                        onClick={() => this.handleDelete(photos.id)}
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
