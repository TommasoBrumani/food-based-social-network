import { firebase } from '@firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage';

//parameters for connection with database
const firebaseConfig = {
  apiKey: "AIzaSyBjqyjWE1OImjrS8U2joJrxTGlLiIYp0to",
  authDomain: "eat-and-meet-76ed3.firebaseapp.com",
  projectId: "eat-and-meet-76ed3",
  storageBucket: "eat-and-meet-76ed3.appspot.com",
  messagingSenderId: "815220757891",
  appId: "1:815220757891:web:d5bc8525a1975faa3a92b6",
  measurementId: "G-0RL77VVFTL"
}
firebase.initializeApp(firebaseConfig)

//references
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const usersCollection = db.collection('users')
const commentsCollection = db.collection('comments')
const postsCollection = db.collection('posts')
const postMembersCollection = db.collection('postMembers')
const ratingsCollection = db.collection('ratings')

//exports
export {
  db,
  auth,
  storage,
  usersCollection,
  commentsCollection,
  postsCollection,
  postMembersCollection,
  ratingsCollection
}

// Firestore
const { TimeStamp, GeoPoint } = firebase.firestore
export {TimeStamp, GeoPoint}