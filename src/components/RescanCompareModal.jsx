import React from "react";

// Helper: flatten only strings that are vulnerabilities
const flattenIssues = (data) => {
  if (!data) return [];
  return Object.values(data)
    .flat()
    .filter((v) => typeof v === "string" && !v.endsWith(".sol")); // ignore filenames
};

export default function RescanCompareModal({ previousScan, newScan, onClose }) {
  if (!previousScan || !newScan) return null;

  const oldIssues = flattenIssues(previousScan.result);
  const newIssues = flattenIssues(newScan.data);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-red-500 text-lg font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Re-scan Comparison
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Old Scan */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Previous Scan</h3>
            <p className="text-sm text-gray-600 mb-1">
              📄 {previousScan.fileName}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              ⏱ {previousScan.duration || "Unknown"}s
            </p>
            <div className="mt-2">
              {oldIssues.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-red-700">
                  {oldIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-yellow-800">⚠️ No issues detected.</p>
              )}
            </div>
          </div>

          {/* New Scan */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-semibold mb-2">New Scan</h3>
            <p className="text-sm text-gray-600 mb-1">
              📄 {newScan.file.name}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              ⏱ {newScan.data.duration || "Unknown"}s
            </p>
            <div className="mt-2">
              {newIssues.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-red-700">
                  {newIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-yellow-800">⚠️ No issues detected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
