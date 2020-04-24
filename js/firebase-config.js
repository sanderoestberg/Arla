"use strict";

var firebaseConfig = {
    apiKey: "AIzaSyCajYf4jahIoK0pum0On1-CeCGoyP1PR1g",
    authDomain: "arla-gaarden-plus.firebaseapp.com",
    databaseURL: "https://arla-gaarden-plus.firebaseio.com",
    projectId: "arla-gaarden-plus",
    storageBucket: "arla-gaarden-plus.appspot.com",
    messagingSenderId: "110068475959",
    appId: "1:110068475959:web:b4ed2bf9f179a05ea1f7b2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const _db = firebase.firestore();
