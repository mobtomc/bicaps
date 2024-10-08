import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Select from 'react-select';

const Add = () => {
  const [personName, setPersonName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [pan, setPan] = useState("");
  const [clientOptions, setClientOptions] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form with data: ", {
      groupName: selectedValues.map(option => option.value),
      entityName: selectedOption?.value,
      personName,
      phoneNo,
      pan,
      email,
    });

    try {
      await axios.post(`${apiUrl}/api/categories`, {
        personName,
        email,
        phoneNo,
        pan,
        groupName: selectedValues.map(option => option.value),
        entityName: selectedOption?.value,
      });
      navigate("/read");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    // Fetch client options
    const fetchClientOptions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/clientgroups`);
        setClientOptions(response.data.map(client => ({ value: client.groupName, label: client.groupName })));
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    // Fetch entity options
    const fetchEntityOptions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/entitytypes`);
        setEntityOptions(response.data.map(entity => ({ value: entity.entityName, label: entity.entityName })));
      } catch (error) {
        console.error('Error fetching entity data:', error);
      }
    };

    fetchClientOptions();
    fetchEntityOptions();
  }, []);

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="w-75">
        <h3 className="mb-4 text-center font-bold text-2xl">Add Clients</h3>
        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded bg-light"
          style={{
            boxShadow: "0 0 100px rgba(0, 0, 0, 0.2)" // Adjust shadow size here
          }}
        >
          <div className="form-group mb-3">
            <label htmlFor="groupName" className="form-label">Client Group:</label>
            <Select
              isMulti
              options={clientOptions}
              value={selectedValues}
              onChange={setSelectedValues}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="entityType" className="form-label">Entity Type:</label>
            <Select
              options={entityOptions}
              value={selectedOption}
              onChange={setSelectedOption}
              className="basic-single-select"
              classNamePrefix="select"
              placeholder="Choose Entity Type"
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setPersonName(e.target.value)}
              value={personName}
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setPhoneNo(e.target.value)}
              value={phoneNo}
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Pan-no.</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setPan(e.target.value)}
              value={pan}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Add;


