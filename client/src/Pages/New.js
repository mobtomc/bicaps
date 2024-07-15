import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";


const New = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [person, setPerson] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
    axios
      .post("http://localhost:8080/api/clientgroups", {
        groupName: name,
        email: email,
        phoneNo: phone,
        personName: person
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(() => {
        navigate("/read");
      })
      .catch((error) => {
        console.error("Error creating client group:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Clients</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow-sm">
        <div className="form-group mb-3">
          <label className="form-label">Group Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Person</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setPerson(e.target.value)}
            value={person}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default New;
