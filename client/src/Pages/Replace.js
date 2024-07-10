import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';

const UpdateGroupName = () => {
  const [clientOptions, setClientOptions] = useState([]);
  const [selectedOldGroupName, setSelectedOldGroupName] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    const fetchClientOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/clientgroups');
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
      const response = await axios.put('http://localhost:8080/api/update-group-name', {
        oldGroupName: selectedOldGroupName.value,
        newGroupName
      });

      alert(response.data.message);
    } catch (error) {
      console.error('Error updating group name:', error);
      alert('Failed to update group name');
    }
  };

  return (
    <div>
      <h2 className="mb-6">Update Group Name:</h2>
      <form className="mx-4" onSubmit={handleUpdateGroupName}>
        <div className="mb-3">
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
        <div className="mb-3">
          <label className="form-label">New Group Name</label>
          <input
            type="text"
            className="form-control"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter New Group Name"
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Group Name</button>
       
        <button className="btn bg-green-400 mx-2">
              <a href="/records">Back</a>
            </button>
        
      </form>
    </div>
  );
};

export default UpdateGroupName;

