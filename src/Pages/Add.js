import axios from "axios";
import React, { useState,useId } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";


const Add = () => {
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[Phone,setPhone]=useState("");
  const[Pan,setPan]=useState("");
  const[Client,setClient]=useState("");
  const[Entity,setEntity]=useState("");
  const history = useNavigate();
  const idprefix = useId();
  const uniqueId = `${idprefix}-${name}`;
  const header={"Access-Control-Allow-Origin":"*"};
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
    axios
      .post("https://66802d8556c2c76b495b61de.mockapi.io/xrud", {
        name: name,
        email: email,
        Phone:Phone,
        Pan:Pan,
        ClientGroup :Client,
        Entity:Entity,
        UniqueId:uniqueId,
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
  <h2 class="my-4 bg-violet-200 mx-8 w-24 h-6">Add clients</h2>
        <form class="mx-4">
        <div class="mb-3">

          <label for="exampleInputPassword1" class="form-label">
            Client Group:
          </label>
          <select required id="exampleInputPassword1" class="form-control" value={state.client} onChange={handleChange}>
          <option >Choose-ClientGroup</option>
          <option >adgips</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
        </div>
        <div class="mb-3">
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">
            Entity Type:
          </label>
          <select name="department" required id="exampleInputPassword1" class="form-control" value={state.entity} onChange={handleChange}>
          <option >Choose-Entity Type</option>
          <option >1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
        </div>
        </div>
      <div className="mb-3">
        <label className="form-label mr-8">Name</label>
        <input type="text" className="form-control" onChange={(e)=>setName(e.target.value)}/>
       
      </div>
      <div className="mb-3">
        <label className="form-label mr-8">Phone</label>
        <input type="text" className="form-control" onChange={(e)=>setPhone(e.target.value)}/>
       
      </div>
      <div className="mb-3">
        <label className="form-label mr-8">Pan-no.</label>
        <input type="text" className="form-control" onChange={(e)=>setPan(e.target.value)}/>
       
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

export default Add
