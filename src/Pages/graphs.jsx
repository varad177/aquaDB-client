import React, { useState, useEffect } from 'react';
import BarChart from '../graphs/BarChart';
import BubbleChart from '../graphs/BubbleChart';
import DoughnutChart from '../graphs/DoughnutChart';
import LineChart from '../graphs/LineChart';
import MixedChart from '../graphs/MixedChart';
import PieChart from '../graphs/PieChart';
import ScatterChart from '../graphs/ScatterChart';
import { Button, Modal } from "flowbite-react";
import AnimationWrapper from './Animation-page';

const ChartComponent = () => {
  const [openModalBar, setOpenModalBar] = useState(false);
  const [openModalBub, setOpenModalBub] = useState(false);
  const [openModald, setOpenModald] = useState(false);
  const [openModall, setOpenModall] = useState(false);
  const [openModalp, setOpenModalp] = useState(false);
  const [openModals, setOpenModals] = useState(false);
  // Get dates from localStorage or set default values
  const storedFromDate = localStorage.getItem('fromDate') || '2024-01-01';
  const storedToDate = localStorage.getItem('toDate') || '2024-12-31';

  const [fromDate, setFromDate] = useState(storedFromDate);
  const [toDate, setToDate] = useState(storedToDate);
  const [selectedOption, setSelectedOption] = useState('by-date');
  const [selectedOptionBub, setSelectedOptionBub] = useState('getCatchDataForBubbleChart');
  const [selectedOptiond, setSelectedOptiond] = useState('getSpeciesDistribution');
  const [selectedOptionl, setSelectedOptionl] = useState('getTotalCatchWeightPerMonth');
  const [selectedOptionp, setSelectedOptionp] = useState('getSpeciesData');
  const [selectedOptions, setSelectedOptions] = useState('getLatitudeDepthData');

  const [selectedCharts, setSelectedCharts] = useState({
    bar: true,
    bubble: true,
    doughnut: true,
    line: true,
    pie: false,
    scatter: false,
  });


  const handleCheckboxChange = (chartType) => {
    setSelectedCharts({
      ...selectedCharts,
      [chartType]: !selectedCharts[chartType],
    });
  };

  const options = [
    { label: 'Catch Weight by Date', value: 'by-date' },
    { label: 'Catch Weight by Species', value: 'by-species' },
    { label: 'Catch Weight by Sea', value: 'by-sea' },
    { label: 'Catch Weight by State', value: 'by-state' },
    { label: 'Catch Weight by Depth', value: 'by-depth' },
    { label: 'Catch Weight by Data Type', value: 'by-data-type' }
  ];
  const optionsbubble = [
    { label: 'getCatchDataForBubbleChart', value: 'getCatchDataForBubbleChart' },
    { label: 'getCatchWeightVsDepth', value: 'getCatchWeightVsDepth' },
    { label: 'getLocationDataForBubbleChart', value: 'getLocationDataForBubbleChart' }
  ];
  const optionsd = [
    { label: 'getSpeciesDistribution ', value: 'getSpeciesDistribution ' },
    { label: 'getCatchWeightBySea ', value: 'getCatchWeightBySea ' },
    { label: 'getCatchWeightByState ', value: 'getCatchWeightByState ' }
  ];
  const optionsl = [
    { label: 'getTotalCatchWeightPerMonth ', value: 'getTotalCatchWeightPerMonth ' },
    { label: 'getNumberOfCatchesPerMonth ', value: 'getNumberOfCatchesPerMonth ' },
    { label: 'getCatchCountBySpeciesPerMonth ', value: 'getCatchCountBySpeciesPerMonth ' },
    { label: 'getCatchWeightForEachSpeciesPerMonth ', value: 'getCatchWeightForEachSpeciesPerMonth ' }
  ];
  const optionsp = [
    { label: 'getSpeciesData', value: 'getSpeciesData ' },
    { label: 'getCatchTypeData ', value: 'getCatchTypeData ' },
    { label: 'getSeaData ', value: 'getSeaData ' },
    { label: 'getStateData ', value: 'getStateData ' }
  ];
  const optionss = [
    { label: 'getLatitudeDepthData', value: 'getLatitudeDepthData ' },
    { label: 'getDateTotalWeightData ', value: 'getDateTotalWeightData ' }
  ];

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'from') {
      setFromDate(value);
      localStorage.setItem('fromDate', value);  // Store 'fromDate' in localStorage
    }
    if (name === 'to') {
      setToDate(value);
      localStorage.setItem('toDate', value);  // Store 'toDate' in localStorage
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
    setOpenModalBar(false)
  };
  const handleDropdownChangebub = (event) => {
    setSelectedOptionBub(event.target.value);
    setOpenModalBub(false)
  };
  const handleDropdownChanged = (event) => {
    setSelectedOptiond(event.target.value);
    setOpenModald(false)
  };
  const handleDropdownChangel = (event) => {
    setSelectedOptionl(event.target.value);
    setOpenModall(false)
  };
  const handleDropdownChangep = (event) => {
    setSelectedOptionp(event.target.value);
    setOpenModalp(false)
  };
  const handleDropdownChanges = (event) => {
    setSelectedOptions(event.target.value);
    setOpenModals(false)
  };

  return (
    <AnimationWrapper>
      {/* Navigation Section */}
      <nav className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <div className="text-white text-xl mb-4">Graphs</div>
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4">
          {/* From Date */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <label className="text-white">From Date:</label>
            <input
              type="date"
              name="from"
              value={fromDate}
              onChange={handleDateChange}
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* To Date */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <label className="text-white">To Date:</label>
            <input
              type="date"
              name="to"
              value={toDate}
              onChange={handleDateChange}
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <h1 className='text-yellow-400 text-2xl font-bold '>Please select the proper data here</h1>

        </div>
      </nav>


      <Modal show={openModalBar} onClose={() => setOpenModalBar(false)}>
        {/* Modal background */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Select Data Type</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setOpenModalBar(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Dropdown for selecting the data type */}
              <div className="flex items-center space-x-2">
                <label htmlFor="dataType" className="text-gray-700">Data Type:</label>
                <select
                  id="dataType"
                  onChange={handleDropdownChange}
                  value={selectedOption}
                  className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Select Data Type</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setOpenModalBar(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Modal>


      {/* //bubb model  */}
      <Modal show={openModalBub} onClose={() => setOpenModalBub(false)}>
        {/* Modal background */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Select Data Type</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setOpenModalBub(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Dropdown for selecting the data type */}
              <div className="flex items-center space-x-2">
                <label htmlFor="dataType" className="text-gray-700">Data Type:</label>
                <select
                  id="dataType"
                  onChange={handleDropdownChangebub}
                  value={selectedOptionBub}
                  className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Select Data Type</option>
                  {optionsbubble.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setOpenModalBub(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Modal>



      {/* //dg model  */}
      <Modal show={openModald} onClose={() => setOpenModald(false)}>
        {/* Modal background */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Select Data Type</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setOpenModald(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Dropdown for selecting the data type */}
              <div className="flex items-center space-x-2">
                <label htmlFor="dataType" className="text-gray-700">Data Type:</label>
                <select
                  id="dataType"
                  onChange={handleDropdownChanged}
                  value={selectedOptiond}
                  className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Select Data Type</option>
                  {optionsd.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setOpenModald(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Modal>


      {/* //lc model  */}
      <Modal show={openModall} onClose={() => setOpenModall(false)}>
        {/* Modal background */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Select Data Type</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setOpenModall(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Dropdown for selecting the data type */}
              <div className="flex items-center space-x-2">
                <label htmlFor="dataType" className="text-gray-700">Data Type:</label>
                <select
                  id="dataType"
                  onChange={handleDropdownChangel}
                  value={selectedOptionl}
                  className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Select Data Type</option>
                  {optionsl.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setOpenModall(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* //pie  model  */}
      <Modal show={openModalp} onClose={() => setOpenModalp(false)}>
        {/* Modal background */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Select Data Type</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setOpenModalp(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Dropdown for selecting the data type */}
              <div className="flex items-center space-x-2">
                <label htmlFor="dataType" className="text-gray-700">Data Type:</label>
                <select
                  id="dataType"
                  onChange={handleDropdownChangep}
                  value={selectedOptionp}
                  className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Select Data Type</option>
                  {optionsp.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setOpenModalp(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Modal>


      <Modal show={openModals} onClose={() => setOpenModals(false)}>
        {/* Modal background */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Select Data Type</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setOpenModals(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Dropdown for selecting the data type */}
              <div className="flex items-center space-x-2">
                <label htmlFor="dataType" className="text-gray-700">Data Type:</label>
                <select
                  id="dataType"
                  onChange={handleDropdownChanges}
                  value={selectedOptions}
                  className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Select Data Type</option>
                  {optionss.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setOpenModals(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Modal>



      <div>
        <div className="flex flex-wrap justify-center mb-4 text-white gap-4">
          {['bar', 'bubble', 'doughnut', 'line', 'pie', 'scatter'].map((chart) => (
            <label
              key={chart}
              className="flex items-center bg-gray-800 p-2 rounded-lg shadow-md hover:bg-gray-700 transition-all cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCharts[chart]}
                onChange={() => handleCheckboxChange(chart)}
                className="appearance-none h-5 w-5 border border-gray-400 rounded-md checked:bg-green-500 focus:ring focus:ring-green-300 mr-2"
              />
              <span className="capitalize">{chart} Chart</span>
            </label>
          ))}
        </div>

        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {/* Checkbox filters */}


          {/* Conditional rendering based on selected charts */}
          {selectedCharts.bar && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md relative">
              <h3 className="text-white text-center text-lg mb-4">Bar Chart</h3>
              <BarChart toDate={toDate} fromDate={fromDate} selectedOption={selectedOption} />
              <i onClick={() => setOpenModalBar(true)} className="fa-solid fa-filter text-2xl cursor-pointer text-white absolute right-3 top-3 hover:text-3xl transition-all duration-150"></i>
            </div>
          )}

          {selectedCharts.bubble && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md relative">
              <h3 className="text-white text-center text-lg mb-4">Bubble Chart</h3>
              <BubbleChart toDate={toDate} fromDate={fromDate} selectedOptionBub={selectedOptionBub} />
              <i onClick={() => setOpenModalBub(true)} className="fa-solid fa-filter text-2xl cursor-pointer text-white absolute right-3 top-3 hover:text-3xl transition-all duration-150"></i>
            </div>
          )}

          {selectedCharts.doughnut && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md relative">
              <h3 className="text-white text-center text-lg mb-4">Doughnut Chart</h3>
              <DoughnutChart toDate={toDate} fromDate={fromDate} selectedOptiond={selectedOptiond} />
              <i onClick={() => setOpenModald(true)} className="fa-solid fa-filter text-2xl cursor-pointer text-white absolute right-3 top-3 hover:text-3xl transition-all duration-150"></i>
            </div>
          )}

          {selectedCharts.line && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md relative">
              <h3 className="text-white text-center text-lg mb-4">Line Chart</h3>
              <LineChart toDate={toDate} fromDate={fromDate} selectedOptionl={selectedOptionl} />
              <i onClick={() => setOpenModall(true)} className="fa-solid fa-filter text-2xl cursor-pointer text-white absolute right-3 top-3 hover:text-3xl transition-all duration-150"></i>
            </div>
          )}

          {selectedCharts.pie && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md relative">
              <h3 className="text-white text-center text-lg mb-4">Pie Chart</h3>
              <PieChart toDate={toDate} fromDate={fromDate} selectedOptionp={selectedOptionp} />
              <i onClick={() => setOpenModalp(true)} className="fa-solid fa-filter text-2xl cursor-pointer text-white absolute right-3 top-3 hover:text-3xl transition-all duration-150"></i>
            </div>
          )}

          {selectedCharts.scatter && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md relative">
              <h3 className="text-white text-center text-lg mb-4">Scatter Chart</h3>
              <ScatterChart toDate={toDate} fromDate={fromDate} selectedOptions={selectedOptions} />
              <i onClick={() => setOpenModals(true)} className="fa-solid fa-filter text-2xl cursor-pointer text-white absolute right-3 top-3 hover:text-3xl transition-all duration-150"></i>
            </div>
          )}
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default ChartComponent;
