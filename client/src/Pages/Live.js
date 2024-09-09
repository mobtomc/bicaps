import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const Live = () => {
  const [staffData, setStaffData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await axios.get('https://bicaps.onrender.com/api/live-data');
        setStaffData(response.data);
      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    fetchLiveData();
    const intervalId = setInterval(fetchLiveData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('https://bicaps.onrender.com/api/attendance-log'); // Update this URL to your attendance API
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
    const intervalId = setInterval(fetchAttendanceData, 10000);
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

  if (!isLoaded) return null;

  if (!isSignedIn || user?.publicMetadata?.role !== 'Admin') {
    return <Navigate to="/unauthorized" />;
  }

  const handleDescriptionClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle expand/collapse
  };

  // Filter data for present staff
  const presentData = attendanceData.filter(entry => entry.status === 'Present');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Live Project Updates</h1>

      {/* Ongoing Projects Table */}
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 mb-6">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Staff Name</th>
            <th className="py-2 px-4 border-b">Project</th>
            <th className="py-2 px-4 border-b">Work Description</th>
            <th className="py-2 px-4 border-b">Start Time</th>
          </tr>
        </thead>
        <tbody>
          {staffData.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-4 px-4 border-b text-center text-gray-500">
                No ongoing project updates available.
              </td>
            </tr>
          ) : (
            staffData.map((entry, index) => {
              const description = entry.workDescription || ''; // Default to an empty string if workDescription is undefined

              return (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{entry.staffName}</td>
                  <td className="py-2 px-4 border-b">{entry.project}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleDescriptionClick(index)}
                    >
                      {expandedIndex === index
                        ? description
                        : description.length > 20
                          ? `${description.substring(0, 20)}...`
                          : description}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{formatTime(entry.startTime)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Present Staff Table */}
      <h2 className="text-xl font-semibold mb-4">Present Staff</h2>
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Staff Name</th>
            <th className="py-2 px-4 border-b">Project</th>
            <th className="py-2 px-4 border-b">Work Description</th>
            <th className="py-2 px-4 border-b">Start Time</th>
          </tr>
        </thead>
        <tbody>
          {presentData.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-4 px-4 border-b text-center text-gray-500">
                No staff marked as present.
              </td>
            </tr>
          ) : (
            presentData.map((entry, index) => {
              const description = entry.workDescription || ''; // Default to an empty string if workDescription is undefined

              return (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{entry.staffName}</td>
                  <td className="py-2 px-4 border-b">{entry.project}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleDescriptionClick(index)}
                    >
                      {expandedIndex === index
                        ? description
                        : description.length > 20
                          ? `${description.substring(0, 20)}...`
                          : description}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{formatTime(entry.startTime)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Live;


