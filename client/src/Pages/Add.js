import axios from "axios";
import React, { useState, useEffect } from "react";
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
      await axios.post("http://localhost:8080/api/categories", {
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
        const response = await axios.get('http://localhost:8080/api/clientgroups');
        setClientOptions(response.data.map(client => ({ value: client.groupName, label: client.groupName })));
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    // Fetch entity options
    const fetchEntityOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/entitytypes');
        setEntityOptions(response.data.map(entity => ({ value: entity.entityName, label: entity.entityName })));
      } catch (error) {
        console.error('Error fetching entity data:', error);
      }
    };

    fetchClientOptions();
    fetchEntityOptions();
  }, []);

  return (
    <>
      <h2 className="my-4 bg-violet-200 mx-8 w-24 h-6">Add clients</h2>
      <form className="mx-4" onSubmit={handleSubmit}>
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="mb-3">
          <label className="form-label mr-8">Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setPersonName(e.target.value)}
            value={personName}
          />
        </div>
        <div className="mb-3">
          <label className="form-label mr-8">Phone</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setPhoneNo(e.target.value)}
            value={phoneNo}
          />
        </div>
        <div className="mb-3">
          <label className="form-label mr-8">Pan-no.</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setPan(e.target.value)}
            value={pan}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label pr-8">Email</label>
          <input
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="mb-3 form-check">
          <label className="form-check-label" htmlFor="exampleCheck1"></label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </>
  );
};

export default Add;
