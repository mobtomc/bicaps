import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from 'react-select';


const Update = () => {
  const [personName, setPersonName] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [clientOptions, setClientOptions] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const [selectedClientGroups, setSelectedClientGroups] = useState([]);
  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categories/${id}`);
        const { personName, email, pan, phoneNo, groupName, entityName } = response.data;
        setPersonName(personName);
        setEmail(email);
        setPan(pan);
        setPhoneNo(phoneNo);
        setSelectedClientGroups(groupName.map(group => ({ value: group, label: group })));
        setSelectedEntityType({ value: entityName, label: entityName });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchClientOptions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/clientgroups`);
        setClientOptions(response.data.map(client => ({ value: client.groupName, label: client.groupName })));
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    const fetchEntityOptions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/entitytypes`);
        setEntityOptions(response.data.map(entity => ({ value: entity.entityName, label: entity.entityName })));
      } catch (error) {
        console.error('Error fetching entity data:', error);
      }
    };

    fetchData();
    fetchClientOptions();
    fetchEntityOptions();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedEntityType) {
      alert("Please select an entity type.");
      return;
    }

    try {
      const updatedData = {
        personName,
        email,
        pan,
        phoneNo,
        groupName: selectedClientGroups.map(option => option.value),
        entityName: selectedEntityType.value
      };
      await axios.put(`${apiUrl}/api/categories/${id}`, updatedData);
      navigate("/records");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Update Category</h2>
      <form onSubmit={handleUpdate} className="border p-4 rounded bg-light shadow-sm">
        <div className="form-group mb-3">
          <label className="form-label">Client Group</label>
          <Select
            isMulti
            options={clientOptions}
            value={selectedClientGroups}
            onChange={setSelectedClientGroups}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select Client Groups"
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Entity Type</label>
          <Select
            options={entityOptions}
            value={selectedEntityType}
            onChange={setSelectedEntityType}
            className="basic-single-select"
            classNamePrefix="select"
            placeholder="Select Entity Type"
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Enter Name"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">PAN</label>
          <input
            type="text"
            className="form-control"
            value={pan}
            onChange={(e) => setPan(e.target.value)}
            placeholder="Enter PAN"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            placeholder="Enter Phone Number"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mx-2">Update</button>
        <Link to="/records">
          <button type="button" className="btn btn-secondary mx-2">Back</button>
        </Link>
      </form>
    </div>
  );
};

export default Update;
