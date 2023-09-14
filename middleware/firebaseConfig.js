import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCAMl2mFD8lQo08bPQ5sAbXFKqJjrNf7o8",
    authDomain: "social-media-app-5baed.firebaseapp.com",
    projectId: "social-media-app-5baed",
    storageBucket: "social-media-app-5baed.appspot.com",
    messagingSenderId: "459594786905",
    appId: "1:459594786905:web:ed33dd0e9079837242e948",
    measurementId: "G-DJC5N0RYC0"
  };
firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);