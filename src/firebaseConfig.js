// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDx85lsI80he0gg_VR31dq1iHxQF6YI61s",
  authDomain: "aqua03.firebaseapp.com",
  databaseURL: "https://aqua03-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aqua03",
  storageBucket: "aqua03.firebasestorage.app",
  messagingSenderId: "236580882",
  appId: "1:236580882:web:6a1de2df130308b17368cb"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
