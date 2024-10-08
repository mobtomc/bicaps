import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default function CostPage() {
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [perHourCost, setPerHourCost] = useState('');
  const [staffNames, setStaffNames] = useState([]);
  const [costs, setCosts] = useState([]);
  const [message, setMessage] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Fetch staff names for dropdown
    async function fetchStaffNames() {
      try {
        const response = await axios.get(`${apiUrl}/api/unique-staff-names`);
        setStaffNames(response.data.map(name => ({ value: name, label: name })));
      } catch (error) {
        console.error('Error fetching staff names:', error);
      }
    }

    // Fetch costs for table
    async function fetchCosts() {
      try {
        const response = await axios.get(`${apiUrl}/api/costs`);
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
      await axios.post(`${apiUrl}/api/costs`, { userNames: staffNames, perHourCost });
      setMessage('Cost updated successfully!');
      setSelectedStaff([]);
      setPerHourCost('');
      // Refresh costs after update
      const response = await axios.get(`${apiUrl}/api/costs`);
      setCosts(response.data);
    } catch (error) {
      console.error('Error setting cost:', error);
      setMessage('Failed to update cost.');
    }
  };

  const handleDelete = async (userName) => {
    try {
      await axios.delete(`${apiUrl}/api/costs/${userName}`);
      setMessage('Cost deleted successfully!');
      // Refresh costs after delete
      const response = await axios.get(`${apiUrl}/api/costs`);
      setCosts(response.data);
    } catch (error) {
      console.error('Error deleting cost:', error);
      setMessage('Failed to delete cost.');
    }
  };

  return (
    <div className="p-6">
      <h1 className='text-2xl font-bold mb-6'>Manage Salaries</h1>
      <form onSubmit={handleSubmit} className="bg-[#bce0da] p-4 rounded-lg shadow-md">
  <div className="flex items-center space-x-4 mb-4">
    <div className="flex-1">
      <label className="block text-lg font-semibold mb-2">Staff Names</label>
      <Select
        isMulti
        value={selectedStaff}
        onChange={setSelectedStaff}
        options={staffNames}
        className="w-full bg-white"
        placeholder="Select Staff Names"
      />
    </div>
    <div className="flex-1">
      <label htmlFor="perHourCost" className="block text-lg font-semibold mb-2">Per Hour Cost:</label>
      <input
        type="number"
        id="perHourCost"
        value={perHourCost}
        onChange={(e) => setPerHourCost(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full bg-white"
        required
      />
    </div>
    <button type="submit" className="bg-[#0c8f5b] mt-8 text-white px-4 py-2 rounded flex-shrink-0">
      Set Cost
    </button>
  </div>
</form>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      <h2 className="text-xl font-semibold mb-4 mt-4">Cost List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#bce0da] border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 text-gray-600 font-medium">User Name</th>
              <th className="py-3 px-4 text-gray-600 font-medium">Per Hour Cost</th>
              <th className="py-3 px-4 text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {costs.map((cost) => (
              <tr key={cost._id} className="border-b border-gray-200">
                <td className="py-3 px-4">{cost.userName}</td>
                <td className="py-3 px-4">{cost.perHourCost}</td>
                <td className="py-3 px-4 text-center">
                  <button 
                    onClick={() => handleEdit(cost.userName, cost.perHourCost)} 
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(cost.userName)} 
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a href="/overview" className="inline-block mt-6 bg-gray-500 text-white px-4 py-2 rounded">Back</a>
    </div>
  );

  function handleEdit(userName, currentCost) {
    setSelectedStaff([{ value: userName, label: userName }]);
    setPerHourCost(currentCost);
  }
}
