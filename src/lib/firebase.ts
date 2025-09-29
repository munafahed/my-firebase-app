// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-2268895776-4703d",
  "appId": "1:268736197735:web:a1f9639e780450849450c2",
  "apiKey": "AIzaSyChryKSsnY_HSQtI_iLSDT_FnfXVVTkYh4",
  "authDomain": "studio-2268895776-4703d.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "268736197735"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance: Auth | null = null;

// A function to get the auth instance, ensuring it's created only on the client side.
const auth = (): Auth => {
  if (typeof window === 'undefined') {
    // This is a guard against server-side execution.
    // We return a null-like object to prevent crashes, but it won't work.
    // The real logic in pages ensures this isn't used server-side.
    return {} as Auth; 
  }
  if (!authInstance) {
    authInstance = getAuth(app);
  }
  return authInstance;
}

export { app, auth };
