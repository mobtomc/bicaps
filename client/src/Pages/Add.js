import axios from "axios";
import React, { useState,useId,useEffect} from "react";
import { useNavigate } from "react-router";



const Add = () => {
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[Phone,setPhone]=useState("");
  const[Pan,setPan]=useState("");
  const[Client,setClient]=useState("");
  const[Entity,setEntity]=useState("");
  const [clientOptions, setClientOptions] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
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
       entity:'',
      });
      useEffect(() => {
        // Fetch client options
        const fetchClientOptions = async () => {
          try {
            const response = await axios.get('http://localhost:8080/api/clientgroups');
            setClientOptions(response.data); 
          } catch (error) {
            console.error('Error fetching client data:', error);
          }
        };
    
        // Fetch entity options
        const fetchEntityOptions = async () => {
          try {
            const response = await axios.get('http://localhost:8080/api/entitytypes');
            setEntityOptions(response.data); 
          } catch (error) {
            console.error('Error fetching entity data:', error);
          }
        };
    
        fetchClientOptions();
        fetchEntityOptions();
      }, []);
    
     
  return <>
  <h2 class="my-4 bg-violet-200 mx-8 w-24 h-6">Add clients</h2>
        <form class="mx-4">
        <div class="mb-3">

          <label for="exampleInputPassword1" class="form-label">
            Client Group:
          </label>
          <select required id="exampleInputPassword1" name="client" class="form-control" value={state.client} onChange={handleChange}>
          <option key="default" value="">Choose-ClientGroup</option>
            {clientOptions.map((option) => (
               <option key={option.name} value={option.name}>
               {option.name}
             </option>
            ))}
        </select>
        </div>
        <div class="mb-3">
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">
            Entity Type:
          </label>
          <select name="entity" required id="exampleInputPassword1" class="form-control" value={state.entity} onChange={handleChange}>
          <option key="default" value="">Choose-EntityGroup</option>
            {entityOptions.map((option) => (
               <option key={option.name} value={option.name}>
               {option.name}
             </option>
            ))}
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
