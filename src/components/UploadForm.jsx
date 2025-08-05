import { useState } from "react";

export default function UploadForm() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.sol'));
    if (files.length) {
      uploadToBackend(files);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.name.endsWith('.sol'));
    if (files.length) {
      uploadToBackend(files);
    }
  };

  // Gửi file lên backend Flask
  const uploadToBackend = async (files) => {
    const file = files[0];
    setUploadingFile(file);
    setScanResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      // Upload thành công → thêm file vào list + hiển thị kết quả
      setSelectedFiles(prev => [...prev, file]);
      setScanResult(data);
    } catch (err) {
      setScanResult({ error: err.message });
    } finally {
      setUploadingFile(null);
    }
  };

  const handleRemove = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setScanResult(null);
  };

  return (
    <div className="w-full bg-blue-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Upload Your Smart Contracts</h2>

      {/* Drag & Drop box */}
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
          Solidity smart contracts only (.sol)
        </p>
      </div>

      {/* Uploading file progress */}
      {uploadingFile && (
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-1">
            Uploading - 1/1 file
          </p>
          <div className="bg-gray-200 rounded-full h-2 mb-1">
            <div className="bg-blue-500 h-2 rounded-full w-2/3"></div>
          </div>
          <div className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
            <span className="text-sm">{uploadingFile.name}</span>
            <span>⏳</span>
          </div>
        </div>
      )}

      {/* Uploaded files list */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 w-full">
          <p className="text-sm text-gray-700 mb-1">
            Uploaded - {selectedFiles.length} file
            {selectedFiles.length > 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border border-green-400 px-2 py-1 rounded"
              >
                <span className="text-sm">{file.name}</span>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => handleRemove(idx)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan Result */}
      {scanResult && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Scan Result</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap break-words overflow-x-auto">
            {JSON.stringify(scanResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
