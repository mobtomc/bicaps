import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Records = () => {
  const [data, setData] = useState([]);
  const [tabledark, setTableDark] = useState("");

  function getData() {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => {
        setData(res.data);
      });
  }

  function handleDelete(id) {
    axios
      .delete(`http://localhost:8080/api/categories/${id}`)
      .then(() => {
        getData();
      });
  }

  const setToLocalStorage = (id, name, email,pan,phoneNo,groupName,entityName) => {
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("pan",pan);
    localStorage.setItem("phoneNo",phoneNo);
    localStorage.setItem("clientgroup",groupName);
    localStorage.setItem("entitytype",entityName);
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
            <th scope="col">Entity-Type</th>
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
                  {/* console.log({`id`}) */}
                  <td>{eachData.groupName}</td>
                  <td>{eachData.entityName}</td>
                  <td>{eachData.personName}</td>
                  <td>{eachData.email}</td>
                  <td>{eachData.phoneNo}</td>
                  <td>{eachData.pan}</td>
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
                            eachData.groupName,
                            eachData.entityName,
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
