import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

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
      const response = await axios.post("https://bicaps.onrender.com/api/projecttypes", {
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
      <h2 className="text-2xl font-bold mb-4">Add Project Type</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Project Type
          </label>
          <input
            type="text"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="projecttype" className="form-label">
            Time Period
          </label>
          <Select
            isMulti
            options={timePeriodOptions}
            value={timePeriods}
            onChange={setTimePeriods}
            className="basic-multi-select"
            placeholder="Select Time Period"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Project Type
        </button>
      </form>
    </div>
  );
};
export default AddProjectType;