import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Records = () => {
  const [data, setData] = useState([]);
  const [tabledark, setTableDark] = useState("");

  function getData() {
    axios
      .get("https://66802d8556c2c76b495b61de.mockapi.io/xrud")
      .then((res) => {
        setData(res.data);
      });
  }

  function handleDelete(id) {
    axios
      .delete(`https://66802d8556c2c76b495b61de.mockapi.io/xrud/${id}`)
      .then(() => {
        getData();
      });
  }

  const setToLocalStorage = (id, name, email,Pan,Phone) => {
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("pan",Pan)
    localStorage.setItem("Phone",Phone)
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          onClick={() => {
            if (tabledark === "table-dark") setTableDark("");
            else setTableDark("table-dark");
          }}
        />
      </div>
      <div className="d-flex justify-content-between m-2">
        <h2>Available Records</h2>
        <Link to="/">
          <button className="btn btn-secondary">A</button>
        </Link>
      </div>
      <table className={`table ${tabledark}`}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Client-Group</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Pan</th>
            <th scope="col">Phone</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        {data.map((eachData) => {
          return (
            <>
              <tbody>
                <tr>
                  <th scope="row">{eachData.id}</th>
                  <td>{eachData.Client}</td>
                  <td>{eachData.name}</td>
                  <td>{eachData.email}</td>
                  <td>{eachData.Phone}</td>
                  <td>{eachData.Pan}</td>
                  <td>
                    <Link to="/update">
                      <button
                        className="px-4 bg-blue-400"
                        onClick={() =>
                          setToLocalStorage(
                            eachData.id,
                            eachData.name,
                            eachData.email,
                            eachData.Pan,
                            eachData.client,
                          )
                        }
                      >
                        Edit{" "}
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="bg-blue-300 px-2"
                      onClick={() => handleDelete(eachData.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </>
          );
        })}
      </table>
    </>
  );
};

export default Records;
