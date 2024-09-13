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
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientGroupsAndCategoriesResponse = await axios.get(`${apiUrl}/api/client-groups-and-categories`);
        const projectTypesResponse = await axios.get(`${apiUrl}/api/projecttypes`);

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
      await axios.post(`${apiUrl}/api/project`, formData);
      alert('Project added successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project');
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <form onSubmit={handleSubmit} className="border p-6 rounded bg-light shadow-[0_0_100px_50px_rgba(0,0,0,0.2)] max-w-md mx-auto">
        <h3 className="text-2xl font-bold mb-6">Add Project</h3>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Client Group/Person:</label>
          <Select
            options={clientGroupOptions}
            name="clientGroupPerson"
            onChange={handleClientGroupChange}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Project Type:</label>
          <Select
            options={projectTypeOptions}
            name="projectType"
            onChange={handleProjectTypeChange}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Period:</label>
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
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Year:</label>
            <Select
              options={years}
              name="year"
              onChange={handleYearChange}
              className="basic-single"
              classNamePrefix="select"
            />
            <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Quarter:</label>
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
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Year:</label>
            <Select
              options={years}
              name="year"
              onChange={handleYearChange}
              className="basic-single"
              classNamePrefix="select"
            />
            <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Month:</label>
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
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Year:</label>
            <Select
              options={years}
              name="year"
              onChange={handleYearChange}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
        )}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          Add Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;

