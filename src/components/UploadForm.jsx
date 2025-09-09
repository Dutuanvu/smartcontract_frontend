import { useState } from "react";

// Known vulnerability types
const knownVulns = [
  "Reentrancy",
  "Shadowing Local",
  "Unused Return",
  "Missing Events Arithmetic",
  "Missing Zero Address Validation",
  "Functions That Send Ether To Arbitrary Destinations",
  "Block Timestamp Dependency",
  "Divide Before Multiply",
  "Dangerous Usage of 'tx.origin'",
];

// Helper: generate warning message
const getWarningMessage = (issues) => {
  if (!issues || issues.length === 0) {
    return `⚠️ No issues detected. Please double-check with other tools.`;
  }

  const unknownIssues = issues.filter((v) => !knownVulns.includes(v));
  if (unknownIssues.length > 0) {
    return `⚠️ Some issues are outside the stored vulnerability set. Double-check with other tools.`;
  }

  return null;
};

export default function UploadForm({ setHistory }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.name.endsWith(".sol")
    );
    if (files.length) uploadToBackend(files[0]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.name.endsWith(".sol")
    );
    if (files.length) uploadToBackend(files[0]);
  };

  const uploadToBackend = async (file) => {
    setUploadingFile(file);
    setScanResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setSelectedFiles((prev) => [...prev, file]);
        setScanResult({ data, file });

        const { duration } = data;
        const issues =
          Object.values(data).flat().filter((v) => typeof v === "string") || [];

        const newEntry = {
          fileName: file.name,
          timestamp: new Date().toISOString(),
          duration: duration || "Unknown",
          issues,
          warning: getWarningMessage(issues),
          result: data,
        };

        const existing = JSON.parse(localStorage.getItem("scanHistory")) || [];
        const updatedHistory = [newEntry, ...existing];
        localStorage.setItem("scanHistory", JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      } else {
        setScanResult({ error: data.error || "Unknown error", file });
      }
    } catch (err) {
      setScanResult({ error: err.message, file });
    } finally {
      setUploadingFile(null);
    }
  };

  const handleRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setScanResult(null);
  };

  const renderScanResult = (scan) => {
    if (!scan) return null;

    const { data, file } = scan;
    const { duration, ...contracts } = data;

    // Flatten issues from all contracts
    let issues = [];
    Object.keys(contracts).forEach((k) => {
      if (Array.isArray(contracts[k])) issues.push(...contracts[k]);
    });

    const warning = getWarningMessage(issues);
    const fileName = file?.name || "Unknown";

    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">Scan Result</h3>
        <p className="text-sm text-gray-600 mb-1">📄 {fileName}</p>
        <p className="text-sm text-gray-600 mb-4">⏱ {duration || "Unknown"}s</p>

        {issues.length > 0 ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
            <p className="font-medium text-red-800 mb-1">Detected Issues:</p>
            <ul className="list-disc list-inside text-sm text-red-700">
              {issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>

            {/* Tool-specific warning */}
            <p className="mt-2 text-sm text-yellow-600">
              ⚠️ This result is based on Slither. Please double-check with other tools.
            </p>

            {/* Generic warning for unknown issues */}
            {warning && (
              <p className="mt-1 text-sm text-yellow-600 whitespace-pre-line">{warning}</p>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm text-yellow-800">
            ⚠️ No issues detected. Please double-check with other tools.
            <br />
            ℹ️ This app only registers the following:
            <ul className="list-disc list-inside ml-5 mt-1">
              {knownVulns.map((vuln, i) => (
                <li key={i}>{vuln}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-blue-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">
        Upload Your Smart Contracts
      </h2>

      {/* Drag & Drop */}
      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-2">☁️</div>
        <p>
          Drag & drop your <strong>.sol</strong> file or{" "}
          <label className="text-blue-600 underline cursor-pointer">
            Browse
            <input
              type="file"
              accept=".sol"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Only Solidity (.sol) smart contracts
        </p>
      </div>

      {/* Uploading Progress */}
      {uploadingFile && (
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-1">Uploading - 1/1 file</p>
          <div className="bg-gray-200 rounded-full h-2 mb-1">
            <div className="bg-blue-500 h-2 rounded-full w-2/3"></div>
          </div>
          <div className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
            <span className="text-sm">{uploadingFile.name}</span>
            <span>⏳</span>
          </div>
        </div>
      )}

      {/* Scan Result */}
      {scanResult && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          {renderScanResult(scanResult)}
        </div>
      )}
    </div>
  );
}
