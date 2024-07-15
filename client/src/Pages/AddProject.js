import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const AddProject = () => {
  const [clientGroupOptions, setClientGroupOptions] = useState([]);
  const [projectTypeOptions, setProjectTypeOptions] = useState([]);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState(null);
  const [formData, setFormData] = useState({
    clientGroupPerson: '',
    projectType: '',
    period: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientGroupsAndCategoriesResponse = await axios.get('http://localhost:8080/api/client-groups-and-categories');
        const projectTypesResponse = await axios.get('http://localhost:8080/api/projecttypes');

        const groupedClientGroupOptions = [
          {
            label: "Client Groups",
            options: clientGroupsAndCategoriesResponse.data.clientGroups.map(group => ({
              value: group._id,
              label: group.groupName
            }))
          },
          {
            label: "Person Names",
            options: clientGroupsAndCategoriesResponse.data.categories.map(category => ({
              value: category._id,
              label: category.personName
            }))
          }
        ];

        const projectTypeOptions = projectTypesResponse.data.map(type => ({
          value: type._id,
          label: type.projectType,
          periods: Array.isArray(type.timePeriods) ? type.timePeriods : type.timePeriods.split(',')
        }));

        setClientGroupOptions(groupedClientGroupOptions);
        setProjectTypeOptions(projectTypeOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProjectTypeChange = (selectedOption) => {
    setSelectedProjectType(selectedOption);
    setPeriodOptions(selectedOption.periods.map(period => ({
      value: period,
      label: period
    })));
    setFormData({
      ...formData,
      projectType: selectedOption.value,
      period: ''
    });
  };

  const handleFormChange = (selectedOption, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : ''
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Ensure period is always an array
      const dataToSend = {
        ...formData,
        period: [formData.period]  // Convert period to an array
      };

      console.log('Data to send:', dataToSend);  // Debug log

      await axios.post('http://localhost:8080/api/project', dataToSend);
      alert('Project added successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Client Group/Person:</label>
        <Select
          options={clientGroupOptions}
          name="clientGroupPerson"
          onChange={(option) => handleFormChange(option, { name: 'clientGroupPerson' })}
        />
      </div>
      <div>
        <label>Select Project Type:</label>
        <Select
          options={projectTypeOptions}
          name="projectType"
          onChange={handleProjectTypeChange}
        />
      </div>
      <div>
        <label>Period:</label>
        <Select
          options={periodOptions}
          name="period"
          onChange={(option) => handleFormChange(option, { name: 'period' })}
          isDisabled={!selectedProjectType}
        />
      </div>
      <button type="submit">Add Project</button>
    </form>
  );
};

export default AddProject;


