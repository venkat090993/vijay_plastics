
import firebase from 'firebase'
 const firebaseConfig = {
    apiKey: "AIzaSyCVt647JuvUywCAvXFfbkCQO0_9-y7J6Qk",
    authDomain: "invoicebuilder-28adf.firebaseapp.com",
    databaseURL: "https://invoicebuilder-28adf.firebaseio.com",
    projectId: "invoicebuilder-28adf",
    storageBucket: "invoicebuilder-28adf.appspot.com",
    messagingSenderId: "776766195733",
    appId: "1:776766195733:web:49da8704b075ca8d08661c",
    measurementId: "G-469Q0D49K3"
  }
  // Initialize Firebase
 let fire =  firebase.initializeApp(firebaseConfig);
  export default fire;
