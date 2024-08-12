import React, { useState } from "react";
import axios from "axios";

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/x6tvzw3maxfva";

const ExportButton = ({ displayedData }) => {
  const [showModal, setShowModal] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy Timestamp");

  const handleExport = async () => {
    const newTimestamp = new Date().toISOString();
    const rows = displayedData.map((record) => ({
      id: record._id,
      groupName: record.groupName.join(", "),
      entityName: record.entityName,
      personName: record.personName,
      email: record.email,
      phoneNo: record.phoneNo,
      pan: record.pan,
      timestamp: newTimestamp,
    }));

    try {
      await axios.post(SHEETDB_API_URL, { data: rows });
      setTimestamp(newTimestamp);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export data");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(timestamp).then(() => {
      setCopyButtonText("Copied!");

      // Revert back to "Copy Timestamp" after 2 seconds
      setTimeout(() => {
        setCopyButtonText("Copy Timestamp");
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handleExport}>
        Export
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Data exported successfully!</h2>
            <p>
              Timestamp: <span className="font-mono">{timestamp}</span>
            </p>
            <button
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={copyToClipboard}
            >
              {copyButtonText}
            </button>
            <button
              className="mt-2 ml-2 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportButton;