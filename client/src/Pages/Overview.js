import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import StaffSummaryExportButton from '../Components/StaffSummaryExportButton';

const NON_BILLABLE_PROJECTS = [
  'Bio Break',
  'Planning Work',
  'Office Work',
  'Client Consulting',
  'Business Development',
  'Office Training',
  'Office Down Time',
  'Office Celebration',
  'Office Meeting',
  'Idle Time',
  'Outside Training'
];

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
  const [billableDuration, setBillableDuration] = useState(0);
  const [billableFilter, setBillableFilter] = useState('All');
  const [costs, setCosts] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [staffData, setStaffData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const role = user.publicMetadata?.role;
      setIsAdmin(role === 'Admin');
    }
  }, [user]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/unique-staff-names')
      .then(response => {
        setStaffNames(response.data.map(name => ({ value: name, label: name })));
      })
      .catch(error => console.error('Error fetching staff names:', error));

    axios.get('http://localhost:8080/api/projects-by-name')
      .then(response => {
        setProjects(response.data.map(project => ({ value: project, label: project })));
      })
      .catch(error => console.error('Error fetching projects:', error));

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
      const staffNamesParam = isAdmin
        ? (selectedStaff.length === 0 ? 'all' : selectedStaff.map(option => option.value).join(','))
        : user.fullName;
  
      const params = {
        staffNames: staffNamesParam,
        projectSubstring: projectSearch.trim(),
        fromDate: startDate ? startDate.toISOString() : undefined,
        toDate: endDate ? endDate.toISOString() : undefined
      };
  
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));
  
      const response = await axios.get('http://localhost:8080/api/filter-timesheets', {
        params: filteredParams
      });
  
      const { timesheets, totalDuration } = response.data;

      setTimesheets(timesheets);
      setTotalDuration(totalDuration);
  
      let totalBillableDuration = 0;
      const totalCost = timesheets.reduce((acc, entry) => {
        const isNonBillable = NON_BILLABLE_PROJECTS.includes(entry.project);
        const perHourCost = isNonBillable ? 0 : (costs[entry.userName] || 0);
        const start = new Date(entry.startTime);
        const end = new Date(entry.endTime);
        const duration = (!isNaN(start.getTime()) && !isNaN(end.getTime())) 
          ? (end - start) / (1000 * 60) 
          : 0;
        if (!isNonBillable) {
          totalBillableDuration += duration; // Accumulate billable duration
        }
        return acc + (perHourCost * (duration / 60)); // duration in hours
      }, 0);
  
      setBillableDuration(totalBillableDuration); // Set billable duration
      setTotalCost(totalCost);
  
      const staffMap = timesheets.reduce((map, entry) => {
        const isNonBillable = NON_BILLABLE_PROJECTS.includes(entry.project);
        const perHourCost = isNonBillable ? 0 : (costs[entry.userName] || 0);
        const start = new Date(entry.startTime);
        const end = new Date(entry.endTime);
        const duration = (!isNaN(start.getTime()) && !isNaN(end.getTime())) 
          ? (end - start) / (1000 * 60) 
          : 0;
        if (!map[entry.userName]) {
          map[entry.userName] = { totalDuration: 0, totalCost: 0, totalBillableDuration: 0, totalNonBillableDuration: 0 };
        }
        map[entry.userName].totalDuration += duration;
        map[entry.userName].totalCost += (perHourCost * (duration / 60)); // duration in hours
        if (!isNonBillable) {
          map[entry.userName].totalBillableDuration += duration; // Accumulate billable duration
        } else {
          map[entry.userName].totalNonBillableDuration += duration; // Accumulate non-billable duration
        }
        return map;
      }, {});
  
      setStaffData(Object.entries(staffMap).map(([userName, data]) => ({
        userName,
        totalDuration: data.totalDuration,
        totalCost: data.totalCost,
        totalBillableDuration: data.totalBillableDuration,
        totalNonBillableDuration: data.totalNonBillableDuration
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

  const isBillable = (project) => {
    return !NON_BILLABLE_PROJECTS.includes(project) ? 'Yes' : <span className="text-red-600 font-bold">No</span>;
  };
  const formattedStaffData = staffData.map(data => ({
    userName: data.userName,
    totalBillableDuration: data.totalBillableDuration.toFixed(2),
    totalNonBillableDuration: data.totalNonBillableDuration.toFixed(2),
    totalCost: formatCurrency(data.totalCost)
  }));
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Timesheet Overview</h1>

      {user && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Logged in as: {user.fullName}</h2>
        </div>
      )}

      <div className="flex flex-col ml-8 md:flex-row gap-4 mb-4">
        {isAdmin && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold flex items-center justify-center mb-4">
              Staff Summary: 
              <div className='mx-2'> <StaffSummaryExportButton staffData={formattedStaffData} /> </div>
            </h2>
            <table className="min-w-full bg-white dark:bg-gray-800 mb-4 border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Staff Name</th>
          
                  <th className="py-2 px-4 border-b">Total Billable Duration (min)</th>
                  <th className="py-2 px-4 border-b">Total Non-Billable Duration (min)</th>
                  <th className="py-2 px-4 border-b">Total cost</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((data, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{data.userName}</td>
                 
                    <td className="py-2 px-4 border-b">{data.totalBillableDuration.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{data.totalNonBillableDuration.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{formatCurrency(data.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex-1">
          <label className="items-end text-lg font-semibold mb-2"></label>
          <DateRangePicker
            ranges={[dateRange]}
            onChange={handleDateChange}
            className="mb-4"
          />
        </div>
      </div>

      {isAdmin ? (
        <div className="flex-1">
          {/* serach by username */}
          <label className="block text-lg font-semibold mb-2">Staff Names</label>
          <Select
            isMulti
            value={selectedStaff}
            onChange={setSelectedStaff}
            options={staffNames}
            className="mb-4"
            placeholder="Select Staff Names (Optional)"
          />
          {/* by project */}
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
      ) : (
        <div className="flex-1">
          <label className="block text-lg font-semibold mb-2">Project Search</label>
          <input
            type="text"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            placeholder="Search projects"
            className="mb-4 p-2 border rounded mx-2"
          />
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Results</h2>
        <p className="mb-4">
          Total Duration: {totalDuration.toLocaleString()} minutes,
          Billable Duration: {billableDuration.toLocaleString()} minutes, 
          Total Cost: {formatCurrency(totalCost)}
        </p>

        <table className="min-w-full bg-white dark:bg-gray-800 mb-4 border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User Name</th>
              <th className="py-2 px-4 border-b">Project</th>
              <th className="py-2 px-4 border-b">Start Time</th>
              <th className="py-2 px-4 border-b">End Time</th>
              <th className="py-2 px-4 border-b">Duration (min)</th>
              <th className="py-2 px-4 border-b">Billable</th> 
            </tr>
          </thead>
          <tbody>
            {timesheets.map((entry, index) => {
              const start = new Date(entry.startTime);
              const end = new Date(entry.endTime);
              const duration = (!isNaN(start.getTime()) && !isNaN(end.getTime())) 
                ? (end - start) / (1000 * 60) 
                : 0;
              return (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{entry.userName}</td>
                  <td className="py-2 px-4 border-b">{entry.project}</td>
                  <td className="py-2 px-4 border-b">{start.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{end.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{duration.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{isBillable(entry.project)}</td> 
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