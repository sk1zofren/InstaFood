import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl37bPaoWaI_3506To8M-KrS672HHEn18",
  authDomain: "monappmobile-8f2a4.firebaseapp.com",
  projectId: "monappmobile-8f2a4",
  storageBucket: "monappmobile-8f2a4.appspot.com",
  messagingSenderId: "825258538942",
  appId: "1:825258538942:web:0fe0e2493d156498116bef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Obtenez l'objet d'authentification Firebase
const auth = getAuth(app);

// Export Firestore
const db = getFirestore(app);

const storage = getStorage(app);

export { app, auth, db, storage };
