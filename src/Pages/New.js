import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";


const New = () => {
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");

  const[Phone,setPhone]=useState("");

  const[Person,setPerson]=useState("");
  const history = useNavigate();

  const header={"Access-Control-Allow-Origin":"*"};
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
    axios
      .post("https://formspree.io/f/xyzgykgr", {
        name: name,
        email: email,

        Phone:Phone,
        Person:Person
       
      })
      .then(() => {
        history("/read");
      });
    };
    const handleChange = (e) => {
        const value = e.target.value;
        setState({
          ...state,
          [e.target.name]: value,
        });
      };
      const [state, setState] = useState({
       client: "",
      });
  return <>
  <h2 class="my-4 bg-violet-200 mx-8 w-24 h-6">Create clients</h2>
        <form class="mx-4">
       
      <div className="mb-3">
        <label className="form-label mr-8">Group Name</label>
        <input type="text" className="form-control" onChange={(e)=>setName(e.target.value)}/>
       
      </div>
       
      <div className="mb-3">
        <label className="form-label mr-8">Person</label>
        <input type="text" className="form-control" onChange={(e)=>setPerson(e.target.value)}/>
       
      </div>
      <div className="mb-3">
        <label className="form-label mr-8">Phone</label>
        <input type="text" className="form-control" onChange={(e)=>setPhone(e.target.value)}/>
       
      </div>
      
      <div classNameName="mb-3">
        <label for="exampleInputEmail1" className="form-label pr-8">Email</label>
          <input 
            type="email" className="form-control" aria-describedby="emailHelp"
            onChange={(e)=>setEmail(e.target.value)}/>
          </div>
      <div className="mb-3 form-check">
        <label className="form-check-label" for="exampleCheck1"></label>
      </div>
      <button type="submit" className="btn btn-primary"   onClick={handleSubmit}>Submit</button>
    </form>
  </>
}

export default New

