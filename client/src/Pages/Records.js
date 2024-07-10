import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from 'react-select';

const Records = () => {
  const [data, setData] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [tabledark, setTableDark] = useState("");

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setData(res.data);
      setOriginalData(res.data); // Keep original data for resetting
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getGroupNames = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/clientgroups");
      setGroupNames(res.data.map(group => ({ value: group.groupName, label: group.groupName })));
    } catch (error) {
      console.error("Error fetching group names:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`);
      getData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleSearch = () => {
    if (!selectedGroup) {
      setData(originalData); // Reset to original data if no group selected
      return;
    }
    const filteredData = originalData.filter(item =>
      item.groupName.includes(selectedGroup.value)
    );
    setData(filteredData);
  };

  const setToLocalStorage = (id, name, email, pan, phoneNo, groupName, entityName) => {
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("pan", pan);
    localStorage.setItem("phoneNo", phoneNo);
    localStorage.setItem("clientgroup", JSON.stringify(groupName));
    localStorage.setItem("entitytype", entityName);
  };

  useEffect(() => {
    getData();
    getGroupNames();
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
        <div className="mb-3">
          <Select
            options={groupNames}
            value={selectedGroup}
            onChange={setSelectedGroup}
            placeholder="Search by Group Name"
          />
          <div>
            <button className="btn bg-green-300 mx-2 mt-2">
              <a href="/records">Back</a>
            </button>
            <button className="btn bg-green-400 mx-2 mt-2">
              <a href="/replace">Replace</a>
            </button>
            <button className="btn btn-primary mt-2" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
      <table className={`table ${tabledark}`}>
        <thead>
          <tr>
            <th scope="col">Unique Id</th>
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
        {data.map(eachData => (
          <tbody key={eachData._id}>
            <tr>
              <th scope="row">{eachData._id}</th>
              <td>{Array.isArray(eachData.groupName) ? eachData.groupName.join(", ") : eachData.groupName}</td>
              <td>{eachData.entityName}</td>
              <td>{eachData.personName}</td>
              <td>{eachData.email}</td>
              <td>{eachData.phoneNo}</td>
              <td>{eachData.pan}</td>
              <td>
                <Link to={`/update/${eachData._id}`}>
                  <button
                    className="btn btn-primary mx-1"
                    onClick={() =>
                      setToLocalStorage(
                        eachData._id,
                        eachData.personName,
                        eachData.email,
                        eachData.pan,
                        eachData.phoneNo,
                        eachData.groupName,
                        eachData.entityName
                      )
                    }
                  >
                    Edit
                  </button>
                </Link>
              </td>
              <td>
                <button
                  className="btn btn-danger mx-1"
                  onClick={() => handleDelete(eachData._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </>
  );
};

export default Records;




