import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useUser } from '@clerk/clerk-react';

const Timesheet = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [timesheet, setTimesheet] = useState([{ project: '', startTime: '', endTime: '' }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get('http://localhost:8080/api/projects-by-name');
        const fetchedProjects = projectsResponse.data;

        const hardcodedProjects = [
          'Bio Break', 'Planning Work', 'Office Work', 'Client Consulting', 'Business Development',
          'Office Training', 'Office Down Time', 'Office Celebration', 'Office Meeting', 'Idle Time',
          'Outside Training', 'Bio Break'
        ];

        // Format hardcoded projects for the dropdown
        const hardcodedOptions = hardcodedProjects.map(project => ({
          value: project,
          label: project
        }));

        // Format fetched projects for the dropdown
        const billableOptions = fetchedProjects.map(project => ({
          value: project.value,
          label: project.label
        }));

        setProjects([
          { label: 'Non-Billable', options: hardcodedOptions },
          { label: 'Billable', options: billableOptions }
        ]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`${new Date().toDateString()} ${startTime}`);
    const end = new Date(`${new Date().toDateString()} ${endTime}`);
    return Math.round((end - start) / (1000 * 60)); // Duration in minutes
  };

  const handleProjectChange = (index, selectedOption) => {
    const newTimesheet = [...timesheet];
    if (index > 0 && !newTimesheet[index - 1].endTime) {
      newTimesheet[index - 1].endTime = formatTime(new Date());
    }
    newTimesheet[index].project = selectedOption ? selectedOption.label : '';
    newTimesheet[index].startTime = formatTime(new Date());
    setTimesheet(newTimesheet);

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
    const userName = user ? user.fullName : 'Unknown User';
    const entries = timesheet
      .filter(entry => entry.project && entry.startTime && entry.endTime)
      .map(entry => ({
        project: entry.project,
        startTime: new Date(`${new Date().toDateString()} ${entry.startTime}`),
        endTime: new Date(`${new Date().toDateString()} ${entry.endTime}`),
        date: new Date()
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

  const getTotalDuration = () => {
    const billableProjects = projects.find(group => group.label === 'Billable')?.options || [];
    const totalDuration = timesheet
      .filter(entry => billableProjects.some(option => option.label === entry.project) && entry.startTime && entry.endTime)
      .reduce((total, entry) => total + calculateDuration(entry.startTime, entry.endTime), 0);

    return totalDuration;
  };

  const currentDate = new Date().toLocaleDateString('en-GB');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Timesheet</h1>
      <div className="mb-4">
        <p className="text-lg">Date: {currentDate}</p>
        <p className="text-lg">Total Duration of Billable Tasks: {getTotalDuration()} minutes</p>
      </div>
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
            <th className="py-2 px-4 border-b">Duration (min)</th>
          </tr>
        </thead>
        <tbody>
          {timesheet.map((entry, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">
                <Select
                  value={projects.flatMap(group => group.options).find(option => option.label === entry.project) || null}
                  onChange={(selectedOption) => handleProjectChange(index, selectedOption)}
                  options={projects}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  className="w-full"
                  placeholder="Select Project"
                  formatGroupLabel={group => (
                    <div className="text-lg font-bold text-red-600">{group.label}</div>
                  )}
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
              <td className="py-2 px-4 border-b">
                {calculateDuration(entry.startTime, entry.endTime)}
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




