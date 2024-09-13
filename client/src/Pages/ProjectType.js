import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

const apiUrl = process.env.REACT_APP_API_URL;

const timePeriodOptions = [
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Annual", label: "Annual" }
];

const AddProjectType = () => {
  const [projectType, setProjectType] = useState("");
  const [timePeriods, setTimePeriods] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/api/projecttypes`, {
        projectType,
        timePeriods: timePeriods.map(option => option.value)  // Convert selected options to their values
      });

      if (response.status === 201) {
        alert("Project type added successfully!");
        setProjectType("");
        setTimePeriods([]);
      } else {
        alert("Failed to add project type.");
      }
    } catch (error) {
      console.error("There was an error adding the project type!", error);
      alert("Failed to add project type.");
    }
  };

  return (
    <div className="container mx-auto my-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Project Type</h2>
      <form 
        onSubmit={handleSubmit} 
        className="border p-6 rounded bg-light shadow-[0_0_100px_50px_rgba(0,0,0,0.2)] max-w-md mx-auto"
      >
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Project Type
          </label>
          <input
            type="text"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="form-control p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Time Period
          </label>
          <Select
            isMulti
            options={timePeriodOptions}
            value={timePeriods}
            onChange={setTimePeriods}
            className="basic-multi-select w-full"
            placeholder="Select Time Period"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Add Project Type
        </button>
      </form>
    </div>
  );
};

export default AddProjectType;
