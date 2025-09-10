import { useState, useEffect } from "react";

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

// Reference map
const vulnReferences = {
  Reentrancy:
    "https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities",
  "Shadowing Local":
    "https://github.com/crytic/slither/wiki/Detector-Documentation#local-variable-shadowing",
  "Unused Return":
    "https://github.com/crytic/slither/wiki/Detector-Documentation#unused-return",
  "Missing Events Arithmetic":
    "https://github.com/crytic/slither/wiki/Detector-Documentation#missing-events-arithmetic",
  "Missing Zero Address Validation":
    "https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation",
  "Functions That Send Ether To Arbitrary Destinations":
    "https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations",
  "Block Timestamp Dependency":
    "https://github.com/crytic/slither/wiki/Detector-Documentation#block-timestamp",
  "Divide Before Multiply":
    "https://github.com/crytic/slither/wiki/Detector-Documentation#divide-before-multiply",
  "Dangerous Usage of 'tx.origin'":
    "https://github.com/crytic/slither/wiki/Detector-Documentation#dangerous-usage-of-txorigin",
};

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

// Countdown component
const Countdown = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, Math.floor(expiresAt - Date.now() / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor(expiresAt - Date.now() / 1000));
      setTimeLeft(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeLeft <= 0)
    return <p className="text-sm text-red-600">File expired</p>;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <p className="text-sm text-gray-600">
      ⏳ Expires in {hours}h {minutes}m {seconds}s
    </p>
  );
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

        const { duration, expires_at } = data;
        let issues = [];
        Object.keys(data).forEach((k) => {
          if (Array.isArray(data[k])) issues.push(...data[k]);
        });
        issues = [...new Set(issues)];

        const newEntry = {
          fileName: file.name,
          timestamp: new Date().toISOString(),
          duration: duration || "Unknown",
          issues,
          expires_at,
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

    const { data, file, error } = scan;

    // show error when can't compile
    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded mt-2">
          <p className="font-medium text-red-800 mb-1">
            Compilation / Scan Failed
          </p>
          <p className="text-sm text-red-700">{error}</p>
          <p className="mt-2 text-sm text-gray-600">
            ⚠️ Please check your Solidity file or try another tool.
          </p>
        </div>
      );
    }

    const { duration, expires_at, ...contracts } = data || {};

    let issues = [];
    Object.keys(contracts).forEach((k) => {
      if (Array.isArray(contracts[k])) issues.push(...contracts[k]);
    });
    issues = [...new Set(issues)];

    const warning = getWarningMessage(issues);
    const fileName = file?.name || "Unknown";

    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">Scan Result</h3>
        <p className="text-sm text-gray-600 mb-1">📄 {fileName}</p>
        <p className="text-sm text-gray-600 mb-1">
          ⏱ {duration || "Unknown"}s
        </p>

        {expires_at && <Countdown expiresAt={expires_at} />}

        {issues.length > 0 ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded mt-2">
            <p className="font-medium text-red-800 mb-1">Detected Issues:</p>
            <ul className="list-disc list-outside text-sm text-red-700 ml-5">
              {issues.map((issue, i) => (
                <li key={i}>
                  {issue}{" "}
                  {vulnReferences[issue] && (
                    <a
                      href={vulnReferences[issue]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-500 align-super text-xs"
                      title="View reference"
                    >
                      🗗
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <p className="mt-2 text-sm text-yellow-600">
              ⚠️ This result is based on Slither. Please double-check with other
              tools.
            </p>

            {warning && (
              <p className="mt-1 text-sm text-yellow-600 whitespace-pre-line">
                {warning}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm text-yellow-800 mt-2">
            ⚠️ No issues detected. Please double-check with other tools.
            <br />
            ℹ️ This app only registers the following:
            <ul className="list-disc list-outside ml-5 mt-1">
              {knownVulns.map((vuln, i) => (
                <li key={i}>
                  {vuln}{" "}
                  {vulnReferences[vuln] && (
                    <a
                      href={vulnReferences[vuln]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-500 align-super text-xs"
                      title="View reference"
                    >
                      🗗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-blue-100 p-6 rounded-lg shadow-md relative">
      <h2 className="text-xl font-bold text-center mb-4">
        Upload Your Smart Contracts
      </h2>

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

      {scanResult && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          {renderScanResult(scanResult)}
        </div>
      )}
    </div>
  );
}
