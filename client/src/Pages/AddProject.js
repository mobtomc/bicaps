import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const AddProject = () => {
  const [clientGroupOptions, setClientGroupOptions] = useState([]);
  const [projectTypeOptions, setProjectTypeOptions] = useState([]);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [years, setYears] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [months, setMonths] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState(null);
  const [formData, setFormData] = useState({
    clientGroupPerson: '',
    projectType: '',
    period: '',
    year: '',
    semester: '',
    month: '',
    quarter: ''
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

        // Set years for calendar selection
        const currentYear = new Date().getFullYear();
        setYears(Array.from({ length: 10 }, (_, i) => currentYear + i).map(year => ({
          value: year,
          label: year.toString()
        })));

        // Set quarters
        setQuarters([
          { value: 'Q1', label: 'Q1' },
          { value: 'Q2', label: 'Q2' },
          { value: 'Q3', label: 'Q3' },
          { value: 'Q4', label: 'Q4' }
        ]);

        // Set months
        setMonths([
          { value: 'January', label: 'January' },
          { value: 'February', label: 'February' },
          { value: 'March', label: 'March' },
          { value: 'April', label: 'April' },
          { value: 'May', label: 'May' },
          { value: 'June', label: 'June' },
          { value: 'July', label: 'July' },
          { value: 'August', label: 'August' },
          { value: 'September', label: 'September' },
          { value: 'October', label: 'October' },
          { value: 'November', label: 'November' },
          { value: 'December', label: 'December' }
        ]);

        // Set semesters
        setSemesters([
          { value: 'Semester 1', label: 'Semester 1' },
          { value: 'Semester 2', label: 'Semester 2' }
        ]);
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
      period: '',
      year: '',
      semester: '',
      month: '',
      quarter: ''
    });
  };

  const handlePeriodChange = (selectedOption) => {
    setFormData({
      ...formData,
      period: selectedOption.value,
      year: '',
      semester: '',
      month: '',
      quarter: ''
    });
  };

  const handleYearChange = (selectedOption) => {
    setFormData({
      ...formData,
      year: selectedOption.value
    });
  };

  const handleSemesterChange = (selectedOption) => {
    setFormData({
      ...formData,
      semester: selectedOption ? selectedOption.value : ''
    });
  };

  const handleMonthChange = (selectedOption) => {
    setFormData({
      ...formData,
      month: selectedOption ? selectedOption.value : ''
    });
  };

  const handleQuarterChange = (selectedOption) => {
    setFormData({
      ...formData,
      quarter: selectedOption ? selectedOption.value : ''
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
      await axios.post('http://localhost:8080/api/project', formData);
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
          onChange={handleFormChange}
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
          onChange={handlePeriodChange}
          isDisabled={!selectedProjectType}
        />
      </div>
      {formData.period === 'Quarterly' && (
        <div>
          <label>Year:</label>
          <Select
            options={years}
            name="year"
            onChange={handleYearChange}
          />
          <label>Quarter:</label>
          <Select
            options={quarters}
            name="quarter"
            onChange={handleQuarterChange}
          />
        </div>
      )}
      {formData.period === 'Monthly' && (
        <div>
          <label>Year:</label>
          <Select
            options={years}
            name="year"
            onChange={handleYearChange}
          />
          <label>Month:</label>
          <Select
            options={months}
            name="month"
            onChange={handleMonthChange}
          />
        </div>
      )}
      {formData.period === 'Semi-Annual' && (
        <div>
          <label>Year:</label>
          <Select
            options={years}
            name="year"
            onChange={handleYearChange}
          />
          <label>Semester:</label>
          <Select
            options={semesters}
            name="semester"
            onChange={handleSemesterChange}
          />
        </div>
      )}
      {formData.period === 'Annual' && (
        <div>
          <label>Year:</label>
          <Select
            options={years}
            name="year"
            onChange={handleYearChange}
          />
        </div>
      )}
      <button type="submit">Add Project</button>
    </form>
  );
};

export default AddProject;

