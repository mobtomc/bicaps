import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const New = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [person, setPerson] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
    axios
      .post(`${apiUrl}/api/clientgroups`, {
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
        navigate("/");
      })
      .catch((error) => {
        console.error("Error creating client group:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-2xl mb-4 text-center font-bold">Create Clients</h1>
      <form 
        onSubmit={handleSubmit} 
        className="border p-4 rounded bg-light shadow-[0_0_100px_50px_rgba(0,0,0,0.2)] max-w-md mx-auto"
      >
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
