import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfVv_wv6zPAc81G0rNDHXbcYrwOq-eZf0",
  authDomain: "todolist-application01.firebaseapp.com",
  projectId: "todolist-application01",
  storageBucket: "todolist-application01.appspot.com",
  messagingSenderId: "120194720719",
  appId: "1:120194720719:web:227ad5b5e0b9a55b0e68ba",
  measurementId: "G-PS8E76SP77",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
