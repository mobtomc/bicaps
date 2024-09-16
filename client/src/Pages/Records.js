import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from 'react-select';
import ExportButton from "../Components/ExportButton";
import { useUser } from '@clerk/clerk-react'; // Import useUser
const apiUrl = process.env.REACT_APP_API_URL;

const Records = () => {
  const { user } = useUser(); // Get user data
  const [data, setData] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedPersonName, setSelectedPersonName] = useState(null);
  const [tabledark, setTableDark] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin

  const getData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/categories`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getGroupNames = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/clientgroups`);
      setGroupNames(res.data.map(group => ({ value: group.groupName, label: group.groupName })));
    } catch (error) {
      console.error("Error fetching group names:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/categories/${id}`);
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
      const response = await axios.get(`${apiUrl}/api/categories/search/${selectedPersonName.value}`);
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
    localStorage.setItem("clientgroup", JSON.stringify(groupName)); // convert to string for storage
    localStorage.setItem("entitytype", entityName);
  };

  useEffect(() => {
    getData();
    getGroupNames();
  }, []);

  useEffect(() => {
    getData();  // Fetch data when selectedGroup changes
  }, [selectedGroup]);

  useEffect(() => {
    if (user) {
      const role = user.publicMetadata?.role;
      setIsAdmin(role === 'Admin');
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        {/* left */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="flex items-center space-x-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tabledark === "table-dark"}
                onChange={() => setTableDark(tabledark === "table-dark" ? "" : "table-dark")}
                className="sr-only"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              <div className={`absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${tabledark === "table-dark" ? "translate-x-5 bg-blue-600" : ""}`}></div>
            </label>
            <label htmlFor="darkModeToggle" className="text-lg"></label>
          </div>
          <ExportButton displayedData={data} />
        </div>
        {/* center */}
        <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-0">
          <div className="flex items-center space-x-2">
            <Select
              options={groupNames}
              value={selectedGroup}
              onChange={setSelectedGroup}
              placeholder="Search by Group Name"
              className="w-full md:w-64"
            />
            <button   className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 scale-75 md:scale-100 md:px-4 md:py-2 md:text-base" onClick={handleSearchByGroup}>
              Search Group Name
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              options={data.map(item => ({ value: item.personName, label: item.personName }))}
              value={selectedPersonName}
              onChange={setSelectedPersonName}
              placeholder="Search by Person Name"
              className="w-full md:w-64"
            />
            <button   className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 scale-75 md:scale-100 md:px-4 md:py-2 md:text-base" onClick={handleSearchByPersonName}>
              Search Person Name
            </button>
          </div>
        </div>
        {/* right */}
        <div className="flex items-center  space-x-4 mb-4">
          <a href="/records" className="btn bg-gray-500 text-white">
            Back
          </a>
          <Link to="/replace" className="btn bg-green-400">
            Replace Group
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`table ${tabledark} min-w-full`}>
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
          <tbody>
            {data.map((eachData) => (
              <tr key={eachData._id}>
                <th scope="row">{eachData._id}</th>
                <td>{Array.isArray(eachData.groupName) ? eachData.groupName.join(", ") : eachData.groupName}</td>
                <td>{eachData.entityName}</td>
                <td>{eachData.personName}</td>
                <td>{eachData.email}</td>
                <td>{eachData.phoneNo}</td>
                <td>{eachData.pan}</td>
                {isAdmin && (
                  <>
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
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Records;
