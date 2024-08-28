import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";


const Entity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
    axios
      .post("https://bicaps.onrender.com/api/entitytypes", {
        entityName: name,
        description: description,
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error creating entity:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Entities</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow-sm">
        <div className="form-group mb-3">
          <label className="form-label">Entity Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Entity;


