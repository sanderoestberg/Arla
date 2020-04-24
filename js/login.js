"use strict";

import SpaService from "./spa-service.js";

let _spaService = new SpaService("login");

const _userRef = _db.collection("users")

window.pageChange = function () {
    _spaService.pageChange();
}

let _currentUser;

// ========== FIREBASE AUTH ========== //

// En del af Firebase Authentication som checker om brugeren er logget ind eller ej, med if og else statement
// Som kører en af de to funktioner:
firebase.auth().onAuthStateChanged(function(user) {
    if (user) { // if user exists and is authenticated
      userAuthenticated(user);
    } else { // if user is not logged in
      userNotAuthenticated();
    }
  });
  
  // Hvis brugeren er logget ind bliver de sendt via _spaService.showPage videre til forsiden 'Fridge'
  // Tabbaren bliver vist og funktionen init, initialiserer meget indhold fra Databasen til siden.
  
  function userAuthenticated(user) {
    //appendUserData(user);
    _currentUser = user;
    //hideTabbar(false);
    updateUser();
    init();
    _spaService.showPage("catergories");
    //showLoader(false);
  }
  
  // Denne function er til hvis brugeren ikke er logget ind, som derfor sender brugeren videre til siden "login"
  // Her efter kommer Firebase Authentication login UI frem og giver brugeren mulighed for at sign-in eller sign-up.
  // Når log-in er fuldført bliver man sendt videre til forsiden "#fridge"
  function userNotAuthenticated() {
    _currentUser = null; // reset _currentUser
    //hideTabbar(true);
    _spaService.showPage("login");
  
    // Firebase UI configuration
    const uiConfig = {
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: '#catergories'
    };
    // Init Firebase UI Authentication
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
    //showLoader(false);
  }

  window.updateUser = function() {
    updateUser();
  }
  
  function updateUser() {
    let user = firebase.auth().currentUser;
  
    // For at opdatere navnet under Firebase Auth properties.
    user.updateProfile({
      displayName: document.querySelector('#name').value
    });
  
    // Fot at opdatere og tilføje brugerens navn og email i Databasen "users"
    _userRef.doc(_currentUser.uid).set({
      displayName: document.querySelector('#name').value,
      email: document.querySelector('#mail').value
  
    }, {
      merge: true
    });
}  

  function init() {
    // init user data og mad i digitalt køleskab
    _userRef.doc(_currentUser.uid).onSnapshot({
      includeMetadataChanges: true
    }, function(userData) {
      if (!userData.metadata.hasPendingWrites && userData.data()) {
        _currentUser = {
          ...firebase.auth().currentUser,
          ...userData.data()
        }; //concating two objects: authUser object and userData objec from the db
        //appendFridge(_currentUser.Fridge);
        // Kører function til at append tilføjede mad i brugerens digitale køleskab.
      }
    });
}

window.logout = function() {
    firebase.auth().signOut();
  }

  window.addToDB = function() {
    addToDB()
  }

  function addToDB() {
    //showLoader(true);
    // Når man har valgt dato og klikker på knappen "tilføj" laver den en ny collection under userID
    // Hvor den tilføjer madId. Samt ExpireDate fra global variablen. 
    _userRef.doc(_currentUser.uid).collection('fridge').add({
    animalcounter: 0
    });
  }

  window.addTest = function() {
    addTest()
  }
  function addTest() {

    _userRef.doc(_currentUser.uid).collection('fridge').doc('animals').set({
        question1: 1,
        question2: 9957,
        question3: 132
    }, {
        merge: true
      });
    }


    window.inputValue = function (value) {
        let htmlTemplate = "";
        let inputField = document.querySelector('input[name="question1"]')
        console.log(value)
        if (value > 0) {
        inputField.style.border = "3px solid #006C3A";
        htmlTemplate += +1;
        _userRef.doc(_currentUser.uid).collection('fridge').doc('animals').set({
            question1: value
        }, {
            merge: true
          });
        }
        else {
            inputField.style.border = "none";
            htmlTemplate = 0;
        }
        document.querySelector('#question-number').innerHTML = htmlTemplate;
        }