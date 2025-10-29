import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDfWw2r7i6Q5EiAU8-X1cCHqhUchY9WBJw",
  authDomain: "yuti-11eaa.firebaseapp.com",
  projectId: "yuti-11eaa",
  storageBucket: "yuti-11eaa.firebasestorage.app",
  messagingSenderId: "825430739423",
  appId: "1:825430739423:web:fa3083a16597fc3ae15c6a",
  measurementId: "G-P69YX6ZDZT",
  databaseURL: "https://yuti-11eaa-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getDatabase(app)

const useEmulator = window.location.hostname === 'localhost'

if (useEmulator) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  } catch (e) {
    console.log('Auth emulator already connected')
  }

  try {
    connectDatabaseEmulator(database, 'localhost', 9000)
  } catch (e) {
    console.log('Database emulator already connected')
  }
}

export default app
