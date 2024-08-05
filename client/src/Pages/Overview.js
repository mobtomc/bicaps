import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const Overview = () => {
  const { user } = useUser();
  const [staffNames, setStaffNames] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
  const [timesheets, setTimesheets] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [costs, setCosts] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    // Fetch staff names
    axios.get('http://localhost:8080/api/unique-staff-names')
      .then(response => {
        setStaffNames(response.data.map(name => ({ value: name, label: name })));
      })
      .catch(error => console.error('Error fetching staff names:', error));

    // Fetch projects
    axios.get('http://localhost:8080/api/projects-by-name')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => console.error('Error fetching projects:', error));

    // Fetch costs
    axios.get('http://localhost:8080/api/costs')
      .then(response => {
        const costMap = response.data.reduce((map, cost) => {
          map[cost.userName] = cost.perHourCost;
          return map;
        }, {});
        setCosts(costMap);
      })
      .catch(error => console.error('Error fetching costs:', error));
  }, []);

  useEffect(() => {
    handleSearch(); // Trigger search whenever parameters change
  }, [selectedStaff, projectSearch, dateRange]);

  const handleSearch = async () => {
    const { startDate, endDate } = dateRange;

    try {
      const staffNamesParam = selectedStaff.length === 0
        ? 'all'
        : selectedStaff.map(option => option.value).join(',');

      const params = {
        staffNames: staffNamesParam,
        projectSubstring: projectSearch.trim(), // Trim spaces around search term
        fromDate: startDate ? startDate.toISOString() : undefined,
        toDate: endDate ? endDate.toISOString() : undefined
      };

      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));

      const response = await axios.get('http://localhost:8080/api/filter-timesheets', {
        params: filteredParams
      });

      console.log('API Response:', response.data);

      const { timesheets, totalDuration } = response.data;

      setTimesheets(timesheets);
      setTotalDuration(totalDuration);

      // Calculate total cost
      const totalCost = timesheets.reduce((acc, entry) => {
        const perHourCost = costs[entry.userName] || 0;
        const start = new Date(entry.startTime);
        const end = new Date(entry.endTime);
        const duration = (!isNaN(start.getTime()) && !isNaN(end.getTime())) 
          ? (end - start) / (1000 * 60) 
          : 0; // duration in minutes
        return acc + (perHourCost * (duration / 60)); // duration in hours
      }, 0);

      setTotalCost(totalCost);

      // Aggregate data by staff
      const staffMap = timesheets.reduce((map, entry) => {
        const perHourCost = costs[entry.userName] || 0;
        const start = new Date(entry.startTime);
        const end = new Date(entry.endTime);
        const duration = (!isNaN(start.getTime()) && !isNaN(end.getTime())) 
          ? (end - start) / (1000 * 60) 
          : 0; // duration in minutes
        if (!map[entry.userName]) {
          map[entry.userName] = { totalDuration: 0, totalCost: 0 };
        }
        map[entry.userName].totalDuration += duration;
        map[entry.userName].totalCost += (perHourCost * (duration / 60)); // duration in hours
        return map;
      }, {});

      setStaffData(Object.entries(staffMap).map(([userName, data]) => ({
        userName,
        totalDuration: data.totalDuration,
        totalCost: data.totalCost
      })));

    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };

  const handleDateChange = (ranges) => {
    setDateRange(ranges.selection);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Timesheet Overview</h1>

      {user && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Logged in as: {user.fullName}</h2>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-lg font-semibold mb-2">Staff Names</label>
          <Select
            isMulti
            value={selectedStaff}
            onChange={setSelectedStaff}
            options={staffNames}
            className="mb-4"
            placeholder="Select Staff Names (Optional)"
          />

          <label className="block text-lg font-semibold mb-2 mt-16">Project Search</label>
          <input
            type="text"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            placeholder="Search projects"
            className="mb-4 p-2 border rounded mx-2"
          />
          <button
            onClick={() => window.location.href = '/costs'}
            className="p-2 bg-green-500 text-white rounded mb-2 mx-4"
          >
            Set Salaries
          </button>
        </div>

        <div className="flex-1">
          <label className="block text-lg font-semibold mb-2">Date Range</label>
          <DateRangePicker
            ranges={[dateRange]}
            onChange={handleDateChange}
            className="mb-4"
          />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Staff Summary:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffData.map((data, index) => (
            <div key={index} className="p-4 border rounded shadow-md bg-white">
              <h3 className="text-lg font-semibold">{data.userName}</h3>
              <p>Total Duration: {data.totalDuration.toLocaleString()} minutes</p>
              <p>Total Cost: {formatCurrency(data.totalCost)}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Results</h2>
        <p className="mb-4">Total Duration: {totalDuration.toLocaleString()} minutes, Total Cost: {formatCurrency(totalCost)}</p>

        <table className="min-w-full bg-white dark:bg-gray-800 mb-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User Name</th>
              <th className="py-2 px-4 border-b">Project</th>
              <th className="py-2 px-4 border-b">Start Time</th>
              <th className="py-2 px-4 border-b">End Time</th>
              <th className="py-2 px-4 border-b">Duration (Minutes)</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((entry, index) => {
              const start = new Date(entry.startTime);
              const end = new Date(entry.endTime);
              const duration = (!isNaN(start.getTime()) && !isNaN(end.getTime()))
                ? ((end - start) / (1000 * 60)).toFixed(2)
                : '0.00'; // duration in minutes

              return (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{entry.userName}</td>
                  <td className="py-2 px-4 border-b">{entry.project}</td>
                  <td className="py-2 px-4 border-b">{start.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{end.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{duration}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Overview;


