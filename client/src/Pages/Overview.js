import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const Overview = () => {
  const [staffNamesOptions, setStaffNamesOptions] = useState([]);
  const [selectedStaffNames, setSelectedStaffNames] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8080/api/staff-names')
      .then(response => {
        const options = response.data.map(name => ({ value: name, label: name }));
        setStaffNamesOptions(options);
      })
      .catch(error => console.error('Error fetching staff names:', error));
  }, []);

  const handleSearch = () => {
    const staffNames = selectedStaffNames.map(name => name.value).join(',');
    axios.get('http://localhost:8080/api/filter-timesheets', {
      params: {
        staffNames,
        fromDate,
        toDate
      }
    })
      .then(response => {
        setFilteredTimesheets(response.data.timesheets);
        setTotalDuration(response.data.totalDuration);
      })
      .catch(error => console.error('Error fetching filtered timesheets:', error));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Overview</h1>
      <div className="mb-4">
        <Select
          isMulti
          value={selectedStaffNames}
          onChange={setSelectedStaffNames}
          options={staffNamesOptions}
          placeholder="Select staff names"
        />
      </div>
      <div className="mb-4">
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />
      </div>
      <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded">Search</button>
      <table className="min-w-full bg-white dark:bg-gray-800 mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">User Name</th>
            <th className="py-2 px-4 border-b">Project</th>
            <th className="py-2 px-4 border-b">Start Time</th>
            <th className="py-2 px-4 border-b">End Time</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Duration (minutes)</th>
          </tr>
        </thead>
        <tbody>
          {filteredTimesheets.map((entry, index) => {
            const start = new Date(`${entry.date}T${entry.startTime}`);
            const end = new Date(`${entry.date}T${entry.endTime}`);
            const duration = (end - start) / 1000 / 60; // Duration in minutes
            return (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{entry.userName}</td>
                <td className="py-2 px-4 border-b">{entry.project}</td>
                <td className="py-2 px-4 border-b">{entry.startTime}</td>
                <td className="py-2 px-4 border-b">{entry.endTime}</td>
                <td className="py-2 px-4 border-b">{entry.date}</td>
                <td className="py-2 px-4 border-b">{duration.toFixed(2)}</td>
              </tr>
            );
          })}
          {filteredTimesheets.length > 0 && (
            <tr>
              <td colSpan="5" className="py-2 px-4 border-b font-bold">Total Duration</td>
              <td className="py-2 px-4 border-b font-bold">{totalDuration.toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Overview;
