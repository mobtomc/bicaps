import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Live = () => {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/live-data');
        setStaffData(response.data);
      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    // Fetch data initially
    fetchLiveData();

    // Set up a timer to fetch data every 10 seconds
    const intervalId = setInterval(fetchLiveData, 10000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-GB', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Live Project Updates</h1>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Staff Name</th>
            <th className="py-2 px-4 border-b">Project</th>
            <th className="py-2 px-4 border-b">Work Description</th>
            <th className="py-2 px-4 border-b">Start Time</th>
          </tr>
        </thead>
        <tbody>
          {staffData.map((entry, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{entry.staffName}</td>
              <td className="py-2 px-4 border-b">{entry.project}</td>
              <td className="py-2 px-4 border-b">{entry.workDescription}</td>
              <td className="py-2 px-4 border-b">{formatTime(entry.startTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Live;


