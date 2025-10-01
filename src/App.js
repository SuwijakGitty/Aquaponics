










import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "./firebaseConfig";
import "./App.css";

function App() {
  const [data, setData] = useState({});
  const [timestamp, setTimestamp] = useState("");
  const [activeTab, setActiveTab] = useState("fish");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const uid = "JPiKLeK1WzTM1dlObvnAog6NP6k2";
    const dataRef = ref(database, `UsersData/${uid}`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);

        if (val.timestamp) {
          const currentDate = new Date();
          const [hours, minutes, seconds] = val.timestamp.split(":");
          currentDate.setHours(hours);
          currentDate.setMinutes(minutes);
          currentDate.setSeconds(seconds);
          setTimestamp(currentDate.toLocaleString());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2 className="logo">🌿 {sidebarOpen && "Aquaponic"}</h2>
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>
        <p className="timestamp">{timestamp}</p>
        <ul>
          <li
            className={activeTab === "fish" ? "active" : ""}
            onClick={() => setActiveTab("fish")}
          >
            🐟 {sidebarOpen && "Fish Tank"}
          </li>
          <li
            className={activeTab === "plant" ? "active" : ""}
            onClick={() => setActiveTab("plant")}
          >
            🌱 {sidebarOpen && "Plant Bed"}
          </li>
          <li
            className={activeTab === "middle" ? "active" : ""}
            onClick={() => setActiveTab("middle")}
          >
            💧 {sidebarOpen && "Middle Tank"}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="title">Aquaponic Dashboard</h1>
        </div>

        <div className="dashboard">
          {activeTab === "fish" && (
            <div className="card fish">
              <h2>Fish Tank</h2>
              <div className="image fish-img" />
              <div className="data-row">
                <span>pH</span>
                <span>{data.FishTank?.ph ?? "--"}</span>
              </div>
              <div className="data-row">
                <span>Water Level</span>
                <span>{data.FishTank?.level ?? "--"} cm</span>
              </div>
              <div className="data-row">
                <span>Turbidity</span>
                <span>{data.FishTank?.turbidity ?? "--"} NTU</span>
              </div>
            </div>
          )}

          {activeTab === "plant" && (
            <div className="card plant">
              <h2>Plant Bed</h2>
              <div className="image plant-img" />
              <div className="data-row">
                <span>pH</span>
                <span>{data.PlantBed?.ph ?? "--"}</span>
              </div>
              <div className="data-row">
                <span>Water Level</span>
                <span>{data.PlantBed?.level ?? "--"} cm</span>
              </div>
            </div>
          )}

          {activeTab === "middle" && (
            <div className="card middle">
              <h2>Middle Tank</h2>
              <div className="image middle-img" />
              <div className="data-row">
                <span>Water Level</span>
                <span>{data.MiddleTank?.level ?? "--"} cm</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;







