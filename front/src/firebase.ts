import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'

// For Firebase JS SDK v7.20.0 and later
const firebaseConfig = {
  apiKey: 'AIzaSyCtU80vOzZbExp1hTMztlt1lCuZF5jUDKE',
  authDomain: 'crystal-brc.firebaseapp.com',
  projectId: 'crystal-brc',
  storageBucket: 'crystal-brc.appspot.com',
  messagingSenderId: '1049317636242',
  appId: '1:1049317636242:web:6e703294ed571f7e4b4e4b',
  measurementId: 'G-7TTV7DDQPR',
}

export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
