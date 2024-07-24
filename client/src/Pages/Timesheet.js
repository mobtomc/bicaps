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

  const handleProjectChange = (index, selectedOption) => {
    console.log('Selected Option:', selectedOption); 
    const newTimesheet = [...timesheet];
    newTimesheet[index].project = selectedOption ? selectedOption.value : '';
    newTimesheet[index].startTime = new Date().toLocaleString();
    setTimesheet(newTimesheet);
    if (index === timesheet.length - 1) {
      setTimesheet([...newTimesheet, { project: '', startTime: '', endTime: '' }]);
    }
  };

  const handleEndTime = (index) => {
    const newTimesheet = [...timesheet];
    newTimesheet[index].endTime = new Date().toLocaleString();
    setTimesheet(newTimesheet);
  };

  // const formatDate = (date) => {
  //   const d = new Date(date);
  //   return d.toISOString();
  // };

  // const handleSubmit = () => {
  //   if (!user) {
  //     alert('User not logged in');
  //     return;
  //   }

  //   const userId = user.id; 

    
  //   const formattedTimesheet = timesheet.map(entry => {
  //     return {
  //       project: entry.project,
  //       startTime: entry.startTime ? formatDate(entry.startTime) : null,
  //       endTime: entry.endTime ? formatDate(entry.endTime) : null,
  //       date: new Date().toISOString(), // Or format as needed
  //       month: new Date().toLocaleString('default', { month: 'long' }), // Format as needed
  //       year: new Date().getFullYear()
  //     };
  //   });

  //   axios.post('http://localhost:8080/api/submit', { userId, timesheet: formattedTimesheet })
  //     .then(response => {
  //       console.log('Timesheet submitted successfully:', response.data);
  //       alert('Timesheet submitted successfully!');
  //     })
  //     .catch(error => {
  //       console.error('Error submitting timesheet:', error.response ? error.response.data : error.message);
  //       alert('Error submitting timesheet.');
  //     });
  // };

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
                  value={projects.find(project => project.value === entry.project)}
                  onChange={(selectedOption) => handleProjectChange(index, selectedOption)}
                  options={projects}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
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
          // onClick={handleSubmit}
          className="p-2 bg-green-500 text-white rounded"
        >
          Submit Timesheet
        </button>
      </div>
    </div>
  );
};

export default Timesheet;







