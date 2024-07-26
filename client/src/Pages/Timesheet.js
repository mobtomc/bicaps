import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const Timesheet = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [timesheet, setTimesheet] = useState([{ project: '', startTime: '', endTime: '' }]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/project')
      .then(response => {
        console.log('API response:', response.data);
        setProjects(response.data);
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleProjectChange = (index, selectedOption) => {
    console.log('Selected Option:', selectedOption);
    const newTimesheet = [...timesheet];

    // Trigger the end time for the previous task if it's not already set
    if (index > 0 && !newTimesheet[index - 1].endTime) {
      newTimesheet[index - 1].endTime = formatTime(new Date());
    }

    newTimesheet[index].project = selectedOption ? selectedOption.label : ''; // Store project name
    newTimesheet[index].startTime = formatTime(new Date());
    setTimesheet(newTimesheet);

    // Add a new row if the last row is being filled
    if (index === timesheet.length - 1) {
      setTimesheet([...newTimesheet, { project: '', startTime: '', endTime: '' }]);
    }
  };

  const handleEndTime = (index) => {
    const newTimesheet = [...timesheet];
    newTimesheet[index].endTime = formatTime(new Date());
    setTimesheet(newTimesheet);
  };

  const handleSubmit = () => {
    const userId = user ? user.id : 'someUserId'; 
    const userName = user ? user.fullName : 'Unknown User'; // Get the user's full name
    const entries = timesheet
      .filter(entry => entry.project && entry.startTime && entry.endTime)
      .map(entry => ({
        project: entry.project,
        startTime: entry.startTime,
        endTime: entry.endTime
      }));

    axios.post('http://localhost:8080/api/submit', { userId, userName, entries })
      .then(response => {
        console.log('Timesheet submitted successfully:', response.data);
        alert('Timesheet submitted successfully!');
      })
      .catch(error => {
        console.error('Error submitting timesheet:', error);
        alert('Error submitting timesheet.');
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Timesheet</h1>
      {user && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Logged in as: {user.fullName}</h2>
        </div>
      )}
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Project</th>
            <th className="py-2 px-4 border-b">Start Time</th>
            <th className="py-2 px-4 border-b">End Time</th>
          </tr>
        </thead>
        <tbody>
          {timesheet.map((entry, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">
                <Select
                  value={projects.find(project => project.label === entry.project)}
                  onChange={(selectedOption) => handleProjectChange(index, selectedOption)}
                  options={projects}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.label} 
                  className="w-full"
                  placeholder="Select Project"
                />
              </td>
              <td className="py-2 px-4 border-b">{entry.startTime}</td>
              <td className="py-2 px-4 border-b">
                {entry.endTime ? entry.endTime : (
                  index === timesheet.length - 1 ? '' : (
                    <button
                      onClick={() => handleEndTime(index)}
                      className="p-2 bg-blue-500 text-white rounded"
                    >
                      End Task
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="p-2 bg-green-500 text-white rounded"
        >
          Submit Timesheet
        </button>
      </div>
    </div>
  );
};

export default Timesheet;












