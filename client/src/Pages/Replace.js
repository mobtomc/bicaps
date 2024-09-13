import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';
import { useNavigate } from "react-router";


const UpdateGroupName = () => {
  const [clientOptions, setClientOptions] = useState([]);
  const [selectedOldGroupName, setSelectedOldGroupName] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchClientOptions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/clientgroups`);
        setClientOptions(response.data.map(client => ({ value: client.groupName, label: client.groupName })));
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientOptions();
  }, []);

  const handleUpdateGroupName = async (e) => {
    e.preventDefault();

    if (!selectedOldGroupName || !newGroupName.trim()) {
      alert("Please select an old group name and enter a new group name.");
      return;
    }

    try {
      const response = await axios.patch(`${apiUrl}/api/clientgroups/update-group-name`, {
        oldGroupName: selectedOldGroupName.value,
        newGroupName
      });

      alert(response.data.message);
      // Navigate back to records page after successful update
      navigate("/records");
    } catch (error) {
      console.error('Error updating group name:', error);
      alert('Failed to update group name');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Update Group Name</h2>
      <form onSubmit={handleUpdateGroupName} className="border p-4 rounded bg-light shadow-sm">
        <div className="form-group mb-3">
          <label className="form-label">Old Group Name</label>
          <Select
            options={clientOptions}
            value={selectedOldGroupName}
            onChange={setSelectedOldGroupName}
            className="basic-single-select"
            classNamePrefix="select"
            placeholder="Select Old Group Name"
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">New Group Name</label>
          <input
            type="text"
            className="form-control"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter New Group Name"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Group Name</button>
        <button className="btn btn-secondary ml-2" onClick={() => navigate("/records")}>
          Back
        </button>
      </form>
    </div>
  );
};

export default UpdateGroupName;

