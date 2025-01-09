// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC1Ycm5MaBCMA9dPtVugLiopxTL1ZQ1fuI',
  authDomain: 'household-app-8a7f0.firebaseapp.com',
  projectId: 'household-app-8a7f0',
  storageBucket: 'household-app-8a7f0.firebasestorage.app',
  messagingSenderId: '711477100351',
  appId: '1:711477100351:web:378d7122419df874f65d8a',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
