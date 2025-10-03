// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyArxKSE5KZmRKPl_yf7HwGAvC0ee6hRv7E",
  authDomain: "aqua04-67925.firebaseapp.com",
  databaseURL: "https://aqua04-67925-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aqua04-67925",
  storageBucket: "aqua04-67925.firebasestorage.app",
  messagingSenderId: "631247955123",
  appId: "1:631247955123:web:89da5ec4e51a28fe07bcc6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
