import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const AttendanceOverview = () => {
  const { user } = useUser();
  const [staffNames, setStaffNames] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (user) {
      const role = user.publicMetadata?.role;
      setIsAdmin(role === 'Admin');
    }
  }, [user]);

  useEffect(() => {
    axios.get(`${apiUrl}/api/unique-staff-names`)
      .then(response => {
        setStaffNames(response.data.map(name => ({ value: name, label: name })));
      })
      .catch(error => console.error('Error fetching staff names:', error));
  }, []);

  useEffect(() => {
    if (dateRange) {
      handleSearch(); // Trigger search whenever parameters change
    }
  }, [selectedStaff, dateRange]);

  const handleSearch = async () => {
  const { startDate, endDate } = dateRange;

  try {
    // Determine userNamesParam based on user role and selected staff
    const userNamesParam = isAdmin
      ? (selectedStaff.length === 0 ? 'all' : selectedStaff.map(option => option.value).join(','))
      : user.fullName;

    // Build request parameters
    const params = {
      userNames: userNamesParam,
      fromDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
      toDate: endDate ? endDate.toISOString().split('T')[0] : undefined
    };

    // Fetch attendance data
    const response = await axios.get(`${apiUrl}/api/filter-attendance`, { params });

    // Debugging: Log the response to check its structure
    console.log('API Response:', response.data);

    const logs = response.data;
    setAttendanceLogs(logs);

    // Calculate all dates in the range
    const allDates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Generate attendance records
    const records = [];
    const userNamesSet = new Set(logs.map(log => log.userName)); // Changed to userName

    userNamesSet.forEach(userName => {
      allDates.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        const logForDate = logs.find(log => log.userName === userName && log.date.startsWith(dateStr)); // Changed to userName
        if (logForDate) {
          records.push(logForDate);
        } else {
          records.push({ userName, date: dateStr, status: 'Absent' }); // Changed to userName
        }
      });
    });

    setAttendanceRecords(records);

    // Debugging: Log the generated records
    console.log('Generated Records:', records);

    // Calculate totals
    const presentCount = records.filter(record => record.status === 'Present').length;
    const absentCount = records.filter(record => record.status === 'Absent').length;

    setTotalPresent(presentCount);
    setTotalAbsent(absentCount);

  } catch (error) {
    console.error('Error fetching attendance logs:', error);
  }
};

  const handleDateChange = (ranges) => {
    setDateRange(ranges.selection);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'text-green-500 font-bold'; // Green and bold
      case 'Absent':
        return 'text-red-500 font-bold'; // Red and bold
      default:
        return '';
    }
  };

  return (
    <div className="p-4">
      {isAdmin && (
         
         <div className="flex justify-center mb-4">
         <div className="w-1/2">
            <label className="block text-lg font-semibold mb-2 text-center">Staff Names</label>
            <Select
            isMulti
            value={selectedStaff}
            onChange={setSelectedStaff}
            options={staffNames}
            className="w-full"
            placeholder="Select Staff Names (Optional)"
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: '#bce0da', // Input background color
                borderColor: state.isFocused ? '#333' : '#555', // Darker border, changes on focus
                borderWidth: '2px', // Make the border thicker for visibility
                boxShadow: state.isFocused ? '0 0 5px rgba(0, 0, 0, 0.3)' : 'none', // Add shadow on focus
                '&:hover': {
                  borderColor: '#333', // Darker border on hover
                },
              }),
            }}
            />
        </div>
        </div>

      )}

              <div className="flex-1 bg-[#bce0da] p-4 rounded-lg">
              <label className="items-end text-lg font-semibold mb-2 block">Date Range</label>
              <DateRangePicker
                ranges={[dateRange]}
                onChange={handleDateChange}
                className="custom-date-picker mb-4"
              />
            </div>

      <div className="mb-4">
        <p className="text-lg font-semibold mb-2">
          Total Present: {totalPresent} | Total Absent: {totalAbsent}
        </p>
      </div>

      <table className="min-w-full bg-[#bce0da] dark:bg-gray-800 mb-4 border-2 border-gray-400">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Staff Name</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record, index) => {
            const date = new Date(record.date);
            return (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{record.userName}</td> {/* Changed to userName */}
                <td className="py-2 px-4 border-b">{date.toLocaleDateString()}</td>
                <td className={`py-2 px-4 border-b ${statusColor(record.status)}`}>
                  {record.status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceOverview;