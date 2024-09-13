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
    if (selectedStaff.length > 0 || dateRange) {
      handleSearch(); // Trigger search whenever parameters change
    }
  }, [selectedStaff, dateRange]);

  const handleSearch = async () => {
    const { startDate, endDate } = dateRange;

    try {
      const userNamesParam = isAdmin
        ? (selectedStaff.length === 0 ? 'all' : selectedStaff.map(option => option.value).join(','))
        : user.fullName;

      const params = {
        userNames: userNamesParam,
        fromDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
        toDate: endDate ? endDate.toISOString().split('T')[0] : undefined
      };

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
      <h1 className="text-2xl font-semibold mb-4">Attendance Overview</h1>
      {isAdmin && (
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Staff Names</label>
          <Select
            isMulti
            value={selectedStaff}
            onChange={setSelectedStaff}
            options={staffNames}
            className="mb-4"
            placeholder="Select Staff Names (Optional)"
          />
          <DateRangePicker
            ranges={[dateRange]}
            onChange={handleDateChange}
            className="mb-4"
          />
        </div>
      )}

      <div className="mb-4">
        <p className="text-lg font-semibold mb-2">
          Total Present: {totalPresent} | Total Absent: {totalAbsent}
        </p>
      </div>

      <table className="min-w-full bg-white dark:bg-gray-800 mb-4 border border-gray-300">
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
