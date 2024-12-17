import React from 'react'
import { Button, Modal } from "flowbite-react";

const BarChartModal = ({setOpenModalBar  , openModalBar}) => {
  return (
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
  )
}

export default BarChartModal