import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default function CostPage() {
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [perHourCost, setPerHourCost] = useState('');
  const [staffNames, setStaffNames] = useState([]);
  const [costs, setCosts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch staff names for dropdown
    async function fetchStaffNames() {
      try {
        const response = await axios.get('http://localhost:8080/api/unique-staff-names');
        setStaffNames(response.data.map(name => ({ value: name, label: name })));
      } catch (error) {
        console.error('Error fetching staff names:', error);
      }
    }

    // Fetch costs for table
    async function fetchCosts() {
      try {
        const response = await axios.get('http://localhost:8080/api/costs');
        setCosts(response.data);
      } catch (error) {
        console.error('Error fetching costs:', error);
      }
    }

    fetchStaffNames();
    fetchCosts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (selectedStaff.length === 0) {
      setMessage('Please select at least one staff.');
      return;
    }

    try {
      const staffNames = selectedStaff.map(staff => staff.value);
      await axios.post('http://localhost:8080/api/costs', { userNames: staffNames, perHourCost });
      setMessage('Cost updated successfully!');
      setSelectedStaff([]);
      setPerHourCost('');
      // Refresh costs after update
      const response = await axios.get('http://localhost:8080/api/costs');
      setCosts(response.data);
    } catch (error) {
      console.error('Error setting cost:', error);
      setMessage('Failed to update cost.');
    }
  };

  return (
    <div>
      <h1>Manage Costs</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-lg font-semibold mb-2">Staff Names</label>
          <Select
            isMulti
            value={selectedStaff}
            onChange={setSelectedStaff}
            options={staffNames}
            className="mb-4"
            placeholder="Select Staff Names"
          />
        </div>
        <div>
          <label htmlFor="perHourCost">Per Hour Cost:</label>
          <input
            type="number"
            id="perHourCost"
            value={perHourCost}
            onChange={(e) => setPerHourCost(e.target.value)}
            required
          />
        </div>
        <button type="submit">Set Cost</button>
      </form>
      {message && <p>{message}</p>}

      <h2>Cost List</h2>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Per Hour Cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {costs.map((cost) => (
            <tr key={cost._id}>
              <td>{cost.userName}</td>
              <td>{cost.perHourCost}</td>
              <td>
                <button onClick={() => handleEdit(cost.userName, cost.perHourCost)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="/overview" className="btn bg-green-300">
            Back
          </a>
    </div>
  );

  function handleEdit(userName, currentCost) {
    setSelectedStaff([{ value: userName, label: userName }]);
    setPerHourCost(currentCost);
  }
}
