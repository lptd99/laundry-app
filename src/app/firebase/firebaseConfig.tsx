import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAH-wBTYexEZ4yaJkkkMKLVn22rLf8B4Zs",
  authDomain: "laundry-app-b4352.firebaseapp.com",
  projectId: "laundry-app-b4352",
  storageBucket: "laundry-app-b4352.appspot.com",
  messagingSenderId: "799333956022",
  appId: "1:799333956022:web:21af7fce5da99b6a232917",
  measurementId: "G-Z76WL3067R",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
export { auth, db };
