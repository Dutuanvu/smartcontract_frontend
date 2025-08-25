import { useEffect, useState } from "react";

export default function HistorySidebar({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("scanHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const handleClear = () => {
    localStorage.removeItem("scanHistory");
    setHistory([]);
  };

  return (
    <aside
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
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
                Scanned: {new Date(item.timestamp).toLocaleDateString("en-GB")}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {item.duration ? `${item.duration}s` : "Unknown"}
              </p>

              <div className="flex justify-between mt-2">
                <button className="text-blue-600 hover:underline text-sm">
                  Re-scan
                </button>
                <button className="text-blue-600 hover:underline text-sm">
                  Report
                </button>
                <button className="text-blue-600 hover:underline text-sm">
                  Source
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
  );
}
