import axios from "axios";
import React, { useState,useId,useEffect} from "react";
import { useNavigate } from "react-router";



const Add = () => {

  const[personName,setpersonName]=useState("");
  const[email,setEmail]=useState("");
  const[phoneNo,setphoneNo]=useState("");
  const[pan,setpan]=useState("");
  const[groupName,setgroupName]=useState("");
  const[entityName,setentityName]=useState("");
  const [clientOptions, setClientOptions] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const history = useNavigate();

  
  const header={"Access-Control-Allow-Origin":"*"};
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with data: ", {
 
      groupName,
      entityName,
      personName,
      phoneNo,
      pan,
      email,
     
    });
    axios
      .post("http://localhost:8080/api/categories", {
        personName: personName,
        email: email,
        phoneNo:phoneNo,
        pan:pan,
        groupName :groupName,
        entityName:entityName,
   
      }).catch((err)=>console.error(err))
      // .then(() => {
      //   history("/read");
      // })
    };
    const handleChange = (e) => {
        const value = e.target.value;
        setState({
          ...state,
          [e.target.name]: value,
        });
      };
      const [state, setState] = useState({
       groupName: "",
       entitytype:'',
      });
    //attempt to make it multiplechoice dropdown
    // const handleGroupChange = (e) => {
    //   const options = Array.from(e.target.selectedOptions).map(option => option.value);
    //   setgroupName(options);
    // };
    //checkbox
    const handleGroupChange = (e) => {
      const value = e.target.value;
      const checked = e.target.checked;
      setgroupName(prevState => 
        checked ? [...prevState, value] : prevState.filter(item => item !== value)
      );
    };
  
   
  
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
          {/* multiple choice dropdown code */}
          {/* <select multiple required id="groupName" name="groupName" class="form-control" value={groupName}  onChange={handleGroupChange}>
          <option key="default" value="">Choose-ClientGroup</option>
            {clientOptions.map((option) => (
               <option key={option?._id} value={option?.groupName}>
               {option?.groupName}
             </option>
            ))}
        </select> */}
        <div>
            {clientOptions.map(option => (
              <div key={option._id}>
                <input
                  type="checkbox"
                  id={`groupName-${option._id}`}
                  value={option.groupName}
                  onChange={handleGroupChange}
                />
                <label htmlFor={`groupName-${option._id}`}>{option.groupName}</label>
              </div>
            ))}
          </div>
        </div>
        <div class="mb-3">
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">
            Entity Type:
          </label>
          <select required name="entitytype" id="entitytype" class="form-control" value={state.entityName} onChange={handleChange}>
          <option key="default" value="">Choose-EntityGroup</option>
          {console.log(entityOptions)}
            {entityOptions.map((option) => (
               <option key={option?._id} value={option?.entityName}>
               {option?.entityName}
             </option>
            ))}
        </select>
        </div>
        </div>
      <div className="mb-3">
        <label className="form-label mr-8">Name</label>
        <input type="text" className="form-control" onChange={(e)=>setpersonName(e.target.value)} value={personName}/>
       
      </div>
      <div className="mb-3">
        <label className="form-label mr-8">Phone</label>
        <input type="text" className="form-control" onChange={(e)=>setphoneNo(e.target.value)} value={phoneNo}/>
       
      </div>
      <div className="mb-3">
        <label className="form-label mr-8">Pan-no.</label>
        <input type="text" className="form-control" onChange={(e)=>setpan(e.target.value)} value={pan}/>
       
      </div>
      <div classNameName="mb-3">
        <label for="exampleInputEmail1" className="form-label pr-8">Email</label>
          <input 
            type="email" className="form-control" aria-describedby="emailHelp"
            onChange={(e)=>setEmail(e.target.value)} value={email}/>
          </div>
      <div className="mb-3 form-check">
        <label className="form-check-label" for="exampleCheck1"></label>
      </div>
      <button type="submit" className="btn btn-primary"   onClick={handleSubmit}>Submit</button>
    </form>
  </>
}

export default Add
