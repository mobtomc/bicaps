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

        const currentYear = new Date().getFullYear();
        setYears(Array.from({ length: 10 }, (_, i) => currentYear + i).map(year => ({
          value: year,
          label: year.toString()
        })));

        setQuarters([
          { value: 'Q1', label: 'Q1' },
          { value: 'Q2', label: 'Q2' },
          { value: 'Q3', label: 'Q3' },
          { value: 'Q4', label: 'Q4' }
        ]);

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
      projectType: selectedOption.label,
      period: '',
      year: '',
      month: '',
      quarter: ''
    });
  };

  const handlePeriodChange = (selectedOption) => {
    setFormData({
      ...formData,
      period: selectedOption.value,
      year: '',
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

  const handleMonthChange = (selectedOption) => {
    setFormData({
      ...formData,
      month: selectedOption.value
    });
  };

  const handleQuarterChange = (selectedOption) => {
    setFormData({
      ...formData,
      quarter: selectedOption.value
    });
  };

  const handleClientGroupChange = (selectedOption) => {
    setFormData({
      ...formData,
      clientGroupPerson: selectedOption.label
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
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow-sm">
        <h3 className="mb-4">Add Project</h3>
        <div className="form-group mb-3">
          <label>Client Group/Person:</label>
          <Select
            options={clientGroupOptions}
            name="clientGroupPerson"
            onChange={handleClientGroupChange}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>
        <div className="form-group mb-3">
          <label>Select Project Type:</label>
          <Select
            options={projectTypeOptions}
            name="projectType"
            onChange={handleProjectTypeChange}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>
        <div className="form-group mb-3">
          <label>Period:</label>
          <Select
            options={periodOptions}
            name="period"
            onChange={handlePeriodChange}
            isDisabled={!selectedProjectType}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>
        {formData.period === 'Quarterly' && (
          <div className="form-group mb-3">
            <label>Year:</label>
            <Select
              options={years}
              name="year"
              onChange={handleYearChange}
              className="basic-single"
              classNamePrefix="select"
            />
            <label>Quarter:</label>
            <Select
              options={quarters}
              name="quarter"
              onChange={handleQuarterChange}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
        )}
        {formData.period === 'Monthly' && (
          <div className="form-group mb-3">
            <label>Year:</label>
            <Select
              options={years}
              name="year"
              onChange={handleYearChange}
              className="basic-single"
              classNamePrefix="select"
            />
            <label>Month:</label>
            <Select
              options={months}
              name="month"
              onChange={handleMonthChange}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
        )}
        {formData.period === 'Annual' && (
          <div className="form-group mb-3">
            <label>Year:</label>
            <Select
              options={years}
              name="year"
              onChange={handleYearChange}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
