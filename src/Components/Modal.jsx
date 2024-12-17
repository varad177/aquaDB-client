import React from 'react';

const Modal = ({ showModal, onClose, onSave }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h3 className="text-lg font-semibold mb-4">Confirm Save</h3>
        <p>Do you want to save this data?</p>
        <div className="mt-4">
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            onClick={onSave}
          >
            Yes
          </button>
          <button 
            className="bg-red-500 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
