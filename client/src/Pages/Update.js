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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/categories/${id}`);
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
        const response = await axios.get('http://localhost:8080/api/clientgroups');
        setClientOptions(response.data.map(client => ({ value: client.groupName, label: client.groupName })));
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    const fetchEntityOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/entitytypes');
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
    try {
      const updatedData = {
        personName,
        email,
        pan,
        phoneNo,
        groupName: selectedClientGroups.map(option => option.value),
        entityName: selectedEntityType.value
      };
      await axios.put(`http://localhost:8080/api/categories/${id}`, updatedData);
      navigate("/records");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div>
      <h2 className="mb-6">UPDATE:</h2>
      <form className="mx-4" onSubmit={handleUpdate}>
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Enter Name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Pan</label>
          <input
            type="text"
            className="form-control"
            value={pan}
            onChange={(e) => setPan(e.target.value)}
            placeholder="Enter Pan"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone No</label>
          <input
            type="text"
            className="form-control"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            placeholder="Enter Phone No"
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary mx-2"
        >
          Update
        </button>
        <Link to="/records">
          <button className="btn bg-green-300 mx-2">Back</button>
        </Link>
      </form>
    </div>
  );
};

export default Update;

