import { Modal, Button } from "flowbite-react";
import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, msg }) => {
  const handleConfirm = () => {
    onConfirm(true); // Send true when user selects Yes
  };

  const handleCancel = () => {
    onConfirm(false); // Send false when user selects No
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl">
        <Modal.Header className="bg-gray-100 px-6 py-4 text-lg font-semibold text-gray-800">
          Confirm Action
        </Modal.Header>
        <Modal.Body className="px-6 py-4">
          <p className="text-gray-700 text-sm">
            {msg || "Are you sure you want to proceed?"}
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
          <Button
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
            onClick={handleCancel}
          >
            No
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            onClick={handleConfirm}
          >
            Yes
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
