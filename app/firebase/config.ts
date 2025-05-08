import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDiryIyRULcuI4hspcckFegnkR8FkMrmfk",
  authDomain: "honeydos-84e3d.firebaseapp.com",
  projectId: "honeydos-84e3d",
  storageBucket: "honeydos-84e3d.firebasestorage.app",
  messagingSenderId: "125150172805",
  appId: "1:125150172805:web:0779a9302787bc6afa7bec",
  measurementId: "G-WN0G2GFXT3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db } 