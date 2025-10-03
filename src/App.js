



// import React, { useEffect, useState } from "react";
// import { database, ref, onValue } from "./firebaseConfig";
// import "./App.css";

// function App() {
//   const [fishData, setFishData] = useState({});
//   const [middleData, setMiddleData] = useState({});
//   const [plantData, setPlantData] = useState({});
//   const [timestamp, setTimestamp] = useState("");

//   useEffect(() => {
//     const uid = "UsersData"; // root ที่เรามีจริง
//     const fishRef = ref(database, `${uid}/FishTank`);
//     const middleRef = ref(database, `${uid}/MiddleTank`);
//     const plantRef = ref(database, `${uid}/PlantTank`);

//     // Fish Tank
//     onValue(fishRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setFishData(data);
//         setTimestamp(data.timestamp || "");
//       }
//     });

//     // Middle Tank
//     onValue(middleRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) setMiddleData(data);
//     });

//     // Plant Tank
//     onValue(plantRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) setPlantData(data);
//     });
//   }, []);

//   return (
//     <div className="app-container">
//       <div className="header">
//         <h1 className="title">Aquaponic Test 01</h1>
//         <p className="timestamp">{timestamp}</p>
//       </div>

//       <div className="dashboard">
//         {/* Fish Tank */}
//         <div className="card fish">
//           <h2>Fish Tank</h2>
//           <div className="image fish-img" />
//           <div className="data-row"><span>pH</span><span>{fishData.ph ?? "--"}</span></div>
//           <div className="data-row"><span>Water Level</span><span>{fishData.waterLevel ?? "--"} mL</span></div>
//           <div className="data-row"><span>Turbidity</span><span>{fishData.turbidity ?? "--"} %</span></div>
//         </div>

//         {/* Middle Tank */}
//         <div className="card middle">
//           <h2>Middle Tank</h2>
//           <div className="image middle-img" />
//           <div className="data-row"><span>Water Level</span><span>{middleData.waterLevel ?? "--"} mL</span></div>
//         </div>

//         {/* Plant Tank */}
//         <div className="card plant">
//           <h2>Plant Tank</h2>
//           <div className="image plant-img" />
//           <div className="data-row"><span>pH</span><span>{plantData.ph ?? "--"}</span></div>
//           <div className="data-row"><span>Water Level</span><span>{plantData.waterLevel ?? "--"} mL</span></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;






import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "./firebaseConfig";
import "./App.css";

function App() {
  const [data, setData] = useState({
    FishTank: {},
    PlantTank: {},
    MiddleTank: {}
  });
  const [timestamp, setTimestamp] = useState("");
  const [activeTab, setActiveTab] = useState("fish");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // FishTank
    const fishRef = ref(database, "UsersData/FishTank");
    const unsubFish = onValue(fishRef, (snapshot) => {
      const val = snapshot.val();
      setData((prev) => ({ ...prev, FishTank: val || {} }));

      if (val?.timestamp) {
        setTimestamp(val.timestamp);
      }
    });

    // PlantTank
    const plantRef = ref(database, "UsersData/PlantTank");
    const unsubPlant = onValue(plantRef, (snapshot) => {
      const val = snapshot.val();
      setData((prev) => ({ ...prev, PlantTank: val || {} }));
    });

    // MiddleTank
    const middleRef = ref(database, "UsersData/MiddleTank");
    const unsubMiddle = onValue(middleRef, (snapshot) => {
      const val = snapshot.val();
      setData((prev) => ({ ...prev, MiddleTank: val || {} }));
    });

    return () => {
      unsubFish();
      unsubPlant();
      unsubMiddle();
    };
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2 className="logo">{sidebarOpen && "🌿 Aquaponic"}</h2>
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
            🌱 {sidebarOpen && "Plant Tank"}
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
          {/* Fish Tank */}
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
                <span>{data.FishTank?.waterLevel ?? "--"} mL</span>
              </div>
              <div className="data-row">
                <span>Turbidity</span>
                <span>{data.FishTank?.turbidity ?? "--"} %</span>
              </div>
            </div>
          )}

          {/* Plant Tank */}
          {activeTab === "plant" && (
            <div className="card plant">
              <h2>Plant Tank</h2>
              <div className="image plant-img" />
              <div className="data-row">
                <span>pH</span>
                <span>{data.PlantTank?.ph ?? "--"}</span>
              </div>
              <div className="data-row">
                <span>Water Level</span>
                <span>{data.PlantTank?.waterLevel ?? "--"} mL</span>
              </div>
            </div>
          )}

          {/* Middle Tank */}
          {activeTab === "middle" && (
            <div className="card middle">
              <h2>Middle Tank</h2>
              <div className="image middle-img" />
              <div className="data-row">
                <span>Water Level</span>
                <span>{data.MiddleTank?.waterLevel ?? "--"} mL</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


