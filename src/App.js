



// import React, { useEffect, useState } from "react";
// import { database, ref, onValue } from "./firebaseConfig";
// import "./App.css";

// function App() {
//   const [fishTank, setFishTank] = useState({});
//   const [middleTank, setMiddleTank] = useState({});
//   const [plantTank, setPlantTank] = useState({});
//   const [timestamp, setTimestamp] = useState("");

//   useEffect(() => {
//     const uid = "UsersData"; // path root

//     // FishTank
//     const fishRef = ref(database, `${uid}/FishTank`);
//     onValue(fishRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setFishTank(data);
//         setTimestamp(data.timestamp || "");
//       }
//     });

//     // MiddleTank
//     const midRef = ref(database, `${uid}/MiddleTank`);
//     onValue(midRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setMiddleTank(data);
//       }
//     });

//     // PlantTank
//     const plantRef = ref(database, `${uid}/PlantTank`);
//     onValue(plantRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setPlantTank(data);
//       }
//     });
//   }, []);

//   return (
//     <div className="app-container">
//       <div className="header">
//         <h1 className="title">Aquaponic System Monitor</h1>
//         <p className="timestamp">อัปเดตล่าสุด: {timestamp || "--"}</p>
//       </div>

//       <div className="dashboard">
//         {/* Fish Tank */}
//         <div className="card fish">
//           <h2>Fish Tank</h2>
//           <div className="data-row">
//             <span>Water Level</span>
//             <span className="value">
//               {fishTank.waterLevel_cm !== undefined
//                 ? `${fishTank.waterLevel_cm} cm`
//                 : "-- cm"}
//             </span>
//           </div>
//           <div className="data-row">
//             <span>Volume</span>
//             <span className="value">
//               {fishTank.volume_L !== undefined
//                 ? `${fishTank.volume_L.toFixed(2)} L`
//                 : "-- L"}
//             </span>
//           </div>
//         </div>

//         {/* Middle Tank */}
//         <div className="card middle">
//           <h2>Middle Tank</h2>
//           <div className="data-row">
//             <span>Water Level</span>
//             <span className="value">
//               {middleTank.waterLevel || "รอ Sensor"}
//             </span>
//           </div>
//         </div>

//         {/* Plant Tank */}
//         <div className="card plant">
//           <h2>Plant Tank</h2>
//           <div className="data-row">
//             <span>Water Level</span>
//             <span className="value">
//               {plantTank.waterLevel || "รอ Sensor"}
//             </span>
//           </div>
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
  const [activeTank, setActiveTank] = useState("FishTank");
  const [fishTank, setFishTank] = useState({});
  const [plantTank, setPlantTank] = useState({});
  const [middleTank, setMiddleTank] = useState({});

  useEffect(() => {
    const uid = "UsersData"; // root ของ Firebase

    // FishTank
    const fishRef = ref(database, `${uid}/FishTank`);
    onValue(fishRef, (snap) => {
      if (snap.exists()) setFishTank(snap.val());
    });

    // PlantTank
    const plantRef = ref(database, `${uid}/PlantTank`);
    onValue(plantRef, (snap) => {
      if (snap.exists()) setPlantTank(snap.val());
    });

    // MiddleTank
    const middleRef = ref(database, `${uid}/MiddleTank`);
    onValue(middleRef, (snap) => {
      if (snap.exists()) setMiddleTank(snap.val());
    });
  }, []);

  const renderTank = () => {
    let data, title, imageClass;

    if (activeTank === "FishTank") {
      data = fishTank;
      title = "Fish Tank";
      imageClass = "fish-img";
    } else if (activeTank === "PlantTank") {
      data = plantTank;
      title = "Plant Tank";
      imageClass = "plant-img";
    } else {
      data = middleTank;
      title = "Middle Tank";
      imageClass = "middle-img";
    }

    return (
      <div className="card">
        <h2>{title}</h2>
        <div className={`image ${imageClass}`} />

        <div className="data-row">
          <span>Water Level</span>
          <span className="value">
            {data.waterLevel_cm !== undefined ? `${data.waterLevel_cm} cm` : "รอ Sensor"}
          </span>
        </div>

        <div className="data-row">
          <span>Volume</span>
          <span className="value">
            {data.volume_L !== undefined ? `${data.volume_L.toFixed(2)} L` : "รอ Sensor"}
          </span>
        </div>

        {activeTank === "FishTank" && (
          <div className="data-row">
            <span>Turbidity</span>
            <span className="value">
              {data.turbidity !== undefined ? `${data.turbidity}` : "รอ Sensor"}
            </span>
          </div>
        )}

        <div className="timestamp">
          {data.timestamp ? data.timestamp : "No data yet"}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar open">
        <div className="sidebar-header">
          <div className="logo">Aquaponic</div>
        </div>
        <ul>
          <li
            className={activeTank === "FishTank" ? "active" : ""}
            onClick={() => setActiveTank("FishTank")}
          >
            🐟 <span>Fish Tank</span>
          </li>
          <li
            className={activeTank === "PlantTank" ? "active" : ""}
            onClick={() => setActiveTank("PlantTank")}
          >
            🌿 <span>Plant Tank</span>
          </li>
          <li
            className={activeTank === "MiddleTank" ? "active" : ""}
            onClick={() => setActiveTank("MiddleTank")}
          >
            💧 <span>Middle Tank</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="title">Aquaponic Monitoring</h1>
        </div>
        {renderTank()}
      </div>
    </div>
  );
}

export default App;




