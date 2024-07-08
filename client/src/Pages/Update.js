import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate,useParams } from "react-router-dom";

const Update = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const[pan,setpan]=useState("");
  const[phoneNo,setphoneNo]=useState("");
  const { id } = useParams(); // Use useParams to get the ID from the URL

  const navigate = useNavigate();
  

  useEffect(() => {
    // Fetch data using the ID from the URL
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/categories/${id}`);
        const { personName, email, pan, phoneNo } = response.data;
        setName(personName);
        setEmail(email);
        setpan(pan);
        phoneNo(phoneNo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { personName: name, email,pan,phoneNo };
      await axios.put(`http://localhost:8080/api/categories/${id}`, updatedData);
      navigate("/records"); 
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div >
      <h2 className="mb-6">UPDATE:</h2>
      <form className="mx-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Pan</label>
          <input
            type="email"
            className="form-control"
            value={pan}
            onChange={(e) => setpan(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">PhoneNo</label>
          <input
            type="email"
            className="form-control"
            value={phoneNo}
            onChange={(e) => setphoneNo(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mx-2"
          onClick={handleUpdate}
        >
          Update
        </button>
        <Link to={"/records"}>
          <button className="btn bg-green-300 mx-2"> Back </button>
        </Link>
      </form>
    </div>
  );
};

export default Update;
