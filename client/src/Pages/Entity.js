import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";



const Entity = () => {
  const[name,setName]=useState("");
  const[description,setDescription]=useState("");
  const history = useNavigate();

  const header={"Access-Control-Allow-Origin":"*"};
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
    axios
      .post("http://localhost:8080/api/entitytypes", {
        entityname: name,
        description:description,
       
      })
      .then(() => {
        history("/read");     
      });
      
    };
  return <>
  <h2 class="my-4 bg-violet-200 mx-8 w-24 h-auto">Create Entities</h2>
        <form class="mx-4 " onSubmit={handleSubmit}>
       
      <div className="mb-3">
        <label className="form-label mr-8">Entity Name</label>
        <input type="text" className="form-control" onChange={(e)=>setName(e.target.value)} value={name}
            required/>
       
      </div>
       
      <div className="mb-3">
        <label className="form-label mr-8">Desciption</label>
        <input type="text" className="form-control" onChange={(e)=>setDescription(e.target.value)}  value={description} required/>      
      </div>
      <div className="mb-3 form-check">
        <label className="form-check-label" for="exampleCheck1"></label>
      </div>
      <button type="submit" className="btn btn-primary"   >Submit</button>
    </form>
  </>
}

export default Entity


