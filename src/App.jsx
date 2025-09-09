import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadForm from "./components/UploadForm";
import AboutSection from "./components/AboutSection";
import HistorySidebar from "./components/HistorySidebar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import backgroundImage from "./assets/background.png";

export default function App() {
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history once at mount
  useEffect(() => {
    const stored = localStorage.getItem("scanHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  // Re-scan handler
  const handleRescan = async (item) => {
    console.log("Re-scan triggered:", item);

    try {
      const response = await fetch("http://127.0.0.1:5000/rescan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: item.fileName }),
      });

      const data = await response.json();
      console.log("Re-scan result:", data);

      if (response.ok) {
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
        alert(`Re-scan failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Re-scan failed:", err);
      alert("Re-scan failed. Check console for details.");
    }
  };

  // Report handler
  const handleViewReport = (item) => {
    console.log("View Report:", item);
    alert("Report viewing not implemented yet.");
  };

  // Source handler
  const handleViewSource = (item) => {
    console.log("View Source:", item);
    alert("Source viewing not implemented yet.");
  };

  return (
    <Router>
      <div className="flex flex-col w-full relative">
        <Header user={user} onShowHistory={() => setShowHistory(true)} />

        {showHistory && (
          <HistorySidebar
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            onRescan={handleRescan}
            onViewReport={handleViewReport}
            onViewSource={handleViewSource}
            history={history}
            setHistory={setHistory}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <main
                className="flex flex-col w-full px-4 pt-24 min-h-screen bg-fixed bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, rgba(0,51,102,0.9), rgba(0,38,77,0.9)), url(${backgroundImage})`,
                }}
              >
                <section
                  id="upload"
                  className="w-full max-w-md mx-auto mb-16 scroll-mt-24"
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg">
                    <UploadForm setHistory={setHistory} />
                  </div>
                </section>
              </main>
            }
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        <section
          id="about"
          className="w-full min-h-screen bg-white px-8 py-20 scroll-mt-20"
        >
          <AboutSection />
        </section>

        <Footer />
      </div>
    </Router>
  );
}
