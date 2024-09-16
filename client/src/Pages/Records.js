import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from 'react-select';
import ExportButton from "../Components/ExportButton";
import { useUser } from '@clerk/clerk-react';

const apiUrl = process.env.REACT_APP_API_URL;

const Records = () => {
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedPersonName, setSelectedPersonName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getData();
    getGroupNames();
  }, []);

  useEffect(() => {
    getData();
  }, [selectedGroup]);

  useEffect(() => {
    if (user) {
      const role = user.publicMetadata?.role;
      setIsAdmin(role === 'Admin');
    }
  }, [user]);

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
    localStorage.setItem("clientgroup", JSON.stringify(groupName));
    localStorage.setItem("entitytype", entityName);
  };

  return (
    <div className="min-h-screen bg-[#bce0da]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center sm:text-left text-gray-900">Records</h1>
        
        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Left */}
          <div className="flex items-center justify-start w-full sm:w-auto">
            <ExportButton displayedData={data} />
          </div>
          <a href="/records" className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-center">
              Back
          </a>
          </div>
          {/* Center */}
          <div className="flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Select
            options={groupNames}
            value={selectedGroup}
            onChange={setSelectedGroup}
            placeholder="Search by Group"
            className="w-full sm:w-64"
          />
          <button onClick={handleSearchByGroup} className="w-full sm:w-auto px-4 py-2 bg-[#0c8f5b] text-white rounded hover:bg-[#0b8152] transition-colors">
            Search
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Select
            options={data.map(item => ({ value: item.personName, label: item.personName }))}
            value={selectedPersonName}
            onChange={setSelectedPersonName}
            placeholder="Search by Person"
            className="w-full sm:w-64"
          />
          <button onClick={handleSearchByPersonName} className="w-full sm:w-auto px-4 py-2 bg-[#0c8f5b] text-white rounded hover:bg-[#0b8152] transition-colors">
            Search
          </button>
        </div>
          </div>
          
          {/* Right */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/replace" className="w-full sm:w-auto px-4 py-2 bg-[#0a7249] text-white rounded hover:bg-[#0b8152] transition-colors text-center">
              Replace Group
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#0c8f5b]">
              <tr >
                {["Unique Id", "Client-Group", "Entity-Type", "Name", "Email", "Pan", "Phone", "", ""].map((header, index) => (
                  <th key={index} scope="col" className="px-6 py-3  text-xs font-medium text-white uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((eachData) => (
                <tr key={eachData._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{eachData._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{Array.isArray(eachData.groupName) ? eachData.groupName.join(", ") : eachData.groupName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{eachData.entityName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{eachData.personName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{eachData.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{eachData.phoneNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{eachData.pan}</td>
                  {isAdmin && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/update/${eachData._id}`} 
                              onClick={() => setToLocalStorage(eachData._id, eachData.personName, eachData.email, eachData.pan, eachData.phoneNo, eachData.groupName, eachData.entityName)}
                              className="text-[#0c8f5b] hover:text-[#0b8152]">
                          Edit
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDelete(eachData._id)} className="text-red-600 hover:text-red-900">
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
    </div>
  );
};

export default Records;