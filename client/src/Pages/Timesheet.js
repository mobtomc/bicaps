import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useUser } from '@clerk/clerk-react';

const Timesheet = () => {
  const { user } = useUser();

  const [timesheet, setTimesheet] = useState(() => {
    const storedTimesheet = localStorage.getItem('timesheet');
    return storedTimesheet ? JSON.parse(storedTimesheet) : [{ project: '', startTime: '', endTime: '', description: '' }];
  });

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(null);
  const [description, setDescription] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get('http://localhost:8080/api/projects-by-name');
        const fetchedProjects = projectsResponse.data;

        const nonbillableProjects = [
          'Bio Break', 'Planning Work', 'Office Work', 'Client Consulting', 'Business Development',
          'Office Training', 'Office Down Time', 'Office Celebration', 'Office Meeting', 'Idle Time',
          'Outside Training', 'Bio Break'
        ];

        const nonbillableOptions = nonbillableProjects.map(project => ({
          value: project,
          label: project
        }));

        const billableOptions = fetchedProjects.map(project => ({
          value: project.value,
          label: project.label
        }));

        setProjects([
          { label: 'Non-Billable', options: nonbillableOptions },
          { label: 'Billable', options: billableOptions }
        ]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('timesheet', JSON.stringify(timesheet));
  }, [timesheet]);

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

  const handleDescriptionClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle expand/collapse
  };

  // const handleProjectChange = (index, selectedOption) => {
  //   const newTimesheet = [...timesheet];
  //   if (index > 0 && !newTimesheet[index - 1].endTime) {
  //     newTimesheet[index - 1].endTime = formatTime(new Date());
  //   }
  //   newTimesheet[index].project = selectedOption ? selectedOption.label : '';
  //   newTimesheet[index].startTime = formatTime(new Date());
  //   setTimesheet(newTimesheet);
  //   setCurrentEntryIndex(index);
  //   setDescription(newTimesheet[index].description || '');
  //   setIsModalOpen(true); // Open the modal to enter description

  //   if (index === timesheet.length - 1) {
  //     setTimesheet([...newTimesheet, { project: '', startTime: '', endTime: '', description: '' }]);
  //   }
  // };
  const handleProjectChange = (index, selectedOption) => {
    const newTimesheet = [...timesheet];
  
    // Check if the previous row is ongoing
    if (index > 0 && !newTimesheet[index - 1].endTime) {
      // End time for the previous entry
      newTimesheet[index - 1].endTime = formatTime(new Date());
  
      // Clear the LiveData entry for the previous task
      const previousEntry = newTimesheet[index - 1];
      if (previousEntry.project && previousEntry.startTime) {
        const formattedStartTime = new Date(`${new Date().toDateString()} ${previousEntry.startTime}`).toISOString();
  
        axios.delete('http://localhost:8080/api/live', {
          data: {
            project: previousEntry.project,
            startTime: formattedStartTime
          }
        })
        .then(response => {
          console.log('Data deleted from LiveData');
        })
        .catch(error => {
          console.error('Error deleting data from LiveData:', error);
        });
      }
    }
  
    // Update the current entry
    newTimesheet[index].project = selectedOption ? selectedOption.label : '';
    newTimesheet[index].startTime = formatTime(new Date());
    setTimesheet(newTimesheet);
    setCurrentEntryIndex(index);
    setDescription(newTimesheet[index].description || '');
    setIsModalOpen(true); // Open the modal to enter description
  
    // Add a new row if it's the last entry
    if (index === timesheet.length - 1) {
      setTimesheet([...newTimesheet, { project: '', startTime: '', endTime: '', description: '' }]);
    }
  };
  
  const handleEndTime = async (index) => {
    const newTimesheet = [...timesheet];
    const entry = newTimesheet[index];
  
    // Check if the project field is empty
    if (!entry.project) {
      alert('Please select a project before ending the task.');
      return;
    }
  
    const endTime = formatTime(new Date());
    newTimesheet[index].endTime = endTime;
    setTimesheet(newTimesheet);
  
    if (entry.endTime) {
      try {
        // Ensure the startTime is in ISO format
        const formattedStartTime = new Date(`${new Date().toDateString()} ${entry.startTime}`).toISOString();
  
        await axios.delete('http://localhost:8080/api/live', {
          data: {
            project: entry.project,
            startTime: formattedStartTime
          }
        });
        console.log('Data deleted from LiveData');
      } catch (error) {
        console.error('Error deleting data from LiveData:', error);
      }
    }
  };
  
  
  
  const handleDescriptionSave = () => {
    const newTimesheet = [...timesheet];
    newTimesheet[currentEntryIndex].description = description;
    setTimesheet(newTimesheet);
    setIsModalOpen(false); // Close the modal after saving
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
        date: new Date(),
        description: entry.description // Include description in submission
      }));

    axios.post('http://localhost:8080/api/submit', { userId, userName, entries })
      .then(response => {
        console.log('Timesheet submitted successfully:', response.data);
        alert('Timesheet submitted successfully!');
        setTimesheet([{ project: '', startTime: '', endTime: '', description: '' }]);
        localStorage.removeItem('timesheet');
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

  const handleSendToLiveData = (index) => {
    const entry = timesheet[index];
    const liveData = {
      userId: user ? user.id : 'someUserId',
      staffName: user ? user.fullName : 'Unknown User',
      project: entry.project,
      workDescription: entry.description,
      startTime: new Date(`${new Date().toDateString()} ${entry.startTime}`)
    };

    axios.post('http://localhost:8080/api/live', liveData)
      .then(response => {
        console.log('Data sent to LiveData:', response.data);
        alert('Data sent to LiveData successfully!');
      })
      .catch(error => {
        console.error('Error sending data to LiveData:', error);
        alert('Error sending data to LiveData.');
      });
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
            <th className="py-2 px-4 border-b">Work</th>
            <th className="py-2 px-4 border-b">Start Time</th>
            <th className="py-2 px-4 border-b">End Time</th>
            <th className="py-2 px-4 border-b">Duration (min)</th>
            <th className="py-2 px-4 border-b">Ongoing</th> 
          </tr>
        </thead>
        <tbody>
          {timesheet.map((entry, index) => (
            <tr key={index}>
              
              <td className="py-2 px-4 border-b ">
              <Select
              value={projects.flatMap(group => group.options).find(option => option.label === entry.project) || null}
              onChange={(selectedOption) => handleProjectChange(index, selectedOption)}
              options={projects}
              isDisabled={!!entry.endTime} // Disable dropdown if endTime is set
              className="min-w-[300px] w-full"
              styles={{
                control: (provided) => ({
                  ...provided,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }),
                menu: (provided) => ({
                  ...provided,
                  width: 'calc(100% + 16px)', 
                  marginTop: 0,
                }),
                groupHeading: (provided) => ({
                  ...provided,
                  color: '#EF4444', 
                  fontWeight: 'bold',
                }),
              }}
            />


              </td>
              <td className="py-2 px-4 border-b">
                <span
                  className="cursor-pointer"
                  onClick={() => handleDescriptionClick(index)}
                >
                  {expandedIndex === index ? entry.description : entry.description.substring(0, 20) + (entry.description.length > 20 ? '...' : '')}
                </span>
              </td>
              <td className="py-2 px-4 border-b">{entry.startTime}</td>
              <td className="py-2 px-4 border-b">
                {entry.endTime || (
                  <button
                    onClick={() => handleEndTime(index)}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    End Time
                  </button>
                )}
              </td>
              <td className="py-2 px-4 border-b">{calculateDuration(entry.startTime, entry.endTime)}</td>
              <td className="py-2 px-4 border-b">
                {entry.endTime ? (
                  <span className="text-green-500 font-semibold">Done</span>
                ) : (
                  <button
                    onClick={() => handleSendToLiveData(index)}
                    className="p-2 bg-yellow-200 text-white rounded-full animate-bounce"
                    title="Send to LiveData"
                  >
                    🔔
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit Timesheet
      </button>
      {/* Modal for entering description */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Enter Description</h2>
            <textarea
              className="w-full p-2 border rounded"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleDescriptionSave}
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timesheet;
