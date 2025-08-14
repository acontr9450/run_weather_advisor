import React from 'react';

const CustomModal = ({ isOpen, title, message, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transform transition-transform duration-300 scale-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default CustomModal;