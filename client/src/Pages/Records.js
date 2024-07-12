import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from 'react-select';
import ExportButton from "../Components/ExportButton";

const Records = () => {
  const [data, setData] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedPersonName, setSelectedPersonName] = useState(null);
  const [tabledark, setTableDark] = useState("");

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setData(res.data);
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

  const handleSearchByGroup = () => {
    if (!selectedGroup) return;
    const filteredData = data.filter((item) =>
      item.groupName.includes(selectedGroup.value)
    );
    setData(filteredData);
  };

  const handleSearchByPersonName = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/categories/search/${selectedPersonName.value}`);
      setData(response.data);
    } catch (error) {
      console.error("Error searching by person name:", error);
    }
  };

  const setToLocalStorage = (id, name, email, pan, phoneNo, groupName, entityName) => {
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("pan", pan);
    localStorage.setItem("phoneNo", phoneNo);
    localStorage.setItem("clientgroup", JSON.stringify(groupName));//convert to string for storage
    localStorage.setItem("entitytype", entityName);
  };

  useEffect(() => {
    getData();
    getGroupNames();
  }, []);

  useEffect(() => {
    getData();  // Fetch data when selectedGroup changes,very very imp. state must be latest
  }, [selectedGroup]);

  return (
    <><div className="">
        
        
      </div>
      <div className="d-flex justify-content-between m-2">
      <div className="form-check form-switch grid grid-rows-2 gap-4 ml-0">
         
          <input
            className="form-check-input p-3"
            type="checkbox"
            onClick={() => {
              setTableDark(tabledark === "table-dark" ? "" : "table-dark");           
            }}

          />
          <div >
          <ExportButton displayedData={data} />
          </div>
        </div>
        <div className="mb-3">
          
          <div className="d-flex">
            <Select
              options={groupNames}
              value={selectedGroup}
              onChange={setSelectedGroup}
              placeholder="Search by Group Name"
            />
            <button className="btn btn-primary mx-2 pr-5" onClick={handleSearchByGroup}>
              Search Group Name
            </button>
          </div>
          <div className="d-flex mt-2">
            <Select
              options={data.map(item => ({ value: item.personName, label: item.personName }))}
              value={selectedPersonName}
              onChange={setSelectedPersonName}
              placeholder="Search by Person Name"
            />
            <button className="btn btn-primary mx-2" onClick={handleSearchByPersonName}>
              Search Person Name
            </button>
          </div>
          <div>
            <button className="btn bg-green-300 mx-2 mt-2">
              <a href="/records">Back</a>
            </button>
            <button className="btn bg-green-400 mx-2 mt-2">
              <Link to="/replace">Replace Group</Link>
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
        {data.map((eachData) => (
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
