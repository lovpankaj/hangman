import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDemoKey123456789",
  authDomain: "hangman-game-local.firebaseapp.com",
  projectId: "hangman-game-local",
  storageBucket: "hangman-game-local.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}

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
