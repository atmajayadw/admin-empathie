import React from "react";

const TableClient = () => {
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
            <td>1</td>
            <td>Foto.jpg</td>
            <td>
              <span
                className="btn btn-danger btn-delete"
                // onClick={() => this.handleDelete(photos.id)}
              >
                Hapus
              </span>
            </td>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableClient;
