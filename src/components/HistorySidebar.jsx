import React, { useState, useEffect } from "react";
import RescanCompareModal from "./RescanCompareModal";
import DownloadModal from "./DownloadModal";

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

// Helper: flatten string vulnerabilities from scan result
function flattenIssues(data) {
  if (!data) return [];
  return Object.values(data)
    .flat()
    .filter((v) => typeof v === "string" && !v.endsWith(".sol"));
}

export default function HistorySidebar({
  isOpen,
  onClose,
  onViewReport,
  history,
  setHistory,
}) {
  const [showRescanModal, setShowRescanModal] = useState(false);
  const [newScan, setNewScan] = useState(null);
  const [currentRescan, setCurrentRescan] = useState(null);
  const [downloadFile, setDownloadFile] = useState(null);

  // Fetch backend files and sync with history
  useEffect(() => {
    const fetchBackendFiles = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/list_files");
        const data = await res.json();
        if (res.ok && Array.isArray(data.files)) {
          // Remove local history items that no longer exist on backend
          const validHistory = history.filter((h) =>
            data.files.includes(h.fileName)
          );

          // Add backend files not in local history
          const missingFiles = data.files.filter(
            (f) => !validHistory.some((h) => h.fileName === f)
          );

          const newHistoryItems = missingFiles.map((f) => ({
            fileName: f,
            timestamp: new Date().toISOString(),
            duration: "Unknown",
            issues: [],
            expires_at: null,
          }));

          const updatedHistory = [...newHistoryItems, ...validHistory];
          setHistory(updatedHistory);
          localStorage.setItem("scanHistory", JSON.stringify(updatedHistory));
        }
      } catch (err) {
        console.error("Failed to fetch backend files:", err);
      }
    };

    fetchBackendFiles();
  }, [setHistory, history]);

  const handleClear = () => {
    localStorage.removeItem("scanHistory");
    setHistory([]);
  };

  const handleRescan = async (item) => {
    setCurrentRescan(item);
    try {
      const response = await fetch("http://127.0.0.1:5000/rescan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: item.fileName }),
      });
      const data = await response.json();
      if (response.ok) {
        setNewScan({ data, file: { name: item.fileName } });
        setShowRescanModal(true);

        const updatedEntry = {
          ...item,
          result: data,
          duration: data.duration || "Unknown",
          timestamp: new Date().toISOString(),
        };
        const updatedHistory = [
          updatedEntry,
          ...history.filter((h) => h.fileName !== item.fileName),
        ];
        setHistory(updatedHistory);
        localStorage.setItem("scanHistory", JSON.stringify(updatedHistory));
      } else {
        alert(data.error || "Rescan failed");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <aside
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Scan History</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-100px)]">
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No history found</p>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-300 rounded-md p-3 shadow-sm bg-gray-50"
              >
                <p className="font-medium truncate">{item.fileName}</p>
                <p className="text-sm text-gray-500">
                  Scanned:{" "}
                  {new Date(item.timestamp).toLocaleDateString("en-GB")}
                </p>
                <p className="text-sm text-gray-500">
                  Duration: {item.duration ? `${item.duration}s` : "Unknown"}
                </p>

                {item.expires_at && <Countdown expiresAt={item.expires_at} />}

                <div className="flex justify-between mt-2">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => handleRescan(item)}
                  >
                    Re-scan
                  </button>
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => setDownloadFile(item)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t text-center">
          <button
            className="text-red-500 hover:underline text-sm"
            onClick={handleClear}
          >
            Clear History
          </button>
        </div>
      </aside>

      {/* Rescan Comparison Modal */}
      {showRescanModal && (
        <RescanCompareModal
          previousScan={currentRescan}
          newScan={newScan}
          onClose={() => setShowRescanModal(false)}
        />
      )}

      {/* Download Modal */}
      {downloadFile && (
        <DownloadModal
          fileName={downloadFile.fileName}
          issues={downloadFile.issues || flattenIssues(downloadFile.result)}
          onClose={() => setDownloadFile(null)}
        />
      )}
    </>
  );
}
