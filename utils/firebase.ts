import firebase from "firebase";

// IMPORTANT: DON'T RE-INITIALIZE ON DEV RELOAD WHEN NOT IN PROD
const app = !firebase.apps.length
  ? firebase.initializeApp({
      apiKey: "AIzaSyCNGXmPC5o6goq6ZMBW0H2vZFdBP9OekXI",
      authDomain: "whatsapp-4dc5f.firebaseapp.com",
      projectId: "whatsapp-4dc5f",
      storageBucket: "whatsapp-4dc5f.appspot.com",
      messagingSenderId: "937200145765",
      appId: "1:937200145765:web:2b4362ae510d19f5a63d8c",
    })
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
