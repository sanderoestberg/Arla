"use strict";

// SPA-SERVICE
import SpaService from "./spa-service.js";
let _spaService = new SpaService("login");
window.pageChange = function () {
    _spaService.pageChange();
}


const _questionRef = _db.collection("questions");
const _userRef = _db.collection("users")

let _categories;
let _currentUser;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) { // if user exists and is authenticated
      userAuthenticated(user);
    } else { // if user is not logged in
      userNotAuthenticated();
    }
  });

  function userNotAuthenticated() {
    _currentUser = null; // reset _currentUser
    _spaService.showPage("login");
    // Firebase UI configuration
    const uiConfig = {
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: '#categories'
    };
    // Init Firebase UI Authentication
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  window.logout = function() {
    firebase.auth().signOut();
  }

  function userAuthenticated(user) {
    _currentUser = user;
    updateUser();
    init();
    _spaService.showPage("forum");
  }

  window.updateUser = function() {
    updateUser();
  }
  function updateUser() {
    let user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: document.querySelector('#name').value
    });
    _userRef.doc(_currentUser.uid).set({
      displayName: document.querySelector('#name').value,
    }, {
      merge: true
    });
}  
//----------------------------------------------------------------------------//
window.init = function() {
  init();}

function init() {
    _userRef.doc(_currentUser.uid).onSnapshot({
      includeMetadataChanges: true
    }, function(userData) {
      if (!userData.metadata.hasPendingWrites && userData.data()) {
        _currentUser = {
          ...firebase.auth().currentUser,
          ...userData.data()
        };
        
        
      }
    });
    _questionRef.onSnapshot(function(snapshotData) {
        _categories = [];
        snapshotData.forEach(function(doc) {
          let category = doc.data();
          category.id = doc.id;
          _categories.push(category);
        });
        appendCategories(_categories);
      });
}
//----------------------------------------------------------------------------//


function appendCategories(categories) {
    let htmlTemplate = "";
    for (let category of categories) {
      htmlTemplate += `
    <article class="${category.id}" style="grid-area: ${category.grid}">
    <a href="#${category.id}">
          <div class="${animalCounterCheck(category.animalsCounter, category.numberOfQuestions)}">
              <img src="${category.img}" class="question-icon" id="${imgCounterCheck(category.animalsCounter)}" alt="">
              <p><span>${category.animalsCounter}</span>/${category.numberOfQuestions}</p>
          </div>
          </a>
  </article>
      `;
    }
    document.querySelector('.grid-test-wrapper').innerHTML = htmlTemplate;    
    function animalCounterCheck(counter, TotalQuestions){
      console.log(TotalQuestions)
      console.log(counter)
    if(counter == TotalQuestions){
      return "gold-border"
    }
    else {
      return "icon-border"
    }
    
}
    function imgCounterCheck(counter){
    if(counter === 3){
      return "gold-icon"
      
    }
    else {
      return ""
    }
    
}
document.getElementById("gold-icon").src = "images/cow-gold.svg";
}



let animalsCounter = 0;
let question1 = "";
let question2 = "";
let question3 = "";

function gold(){
  if(animalsCounter === 3){
    document.getElementById("cow-icon").src = "images/cow-gold.svg";
    document.getElementById("cow-border").style.borderColor = "#D4AF34";
    document.getElementById("q1").style.borderColor = "#D4AF34";
    document.getElementById("q2").style.borderColor = "#D4AF34";
    document.getElementById("q3").style.borderColor = "#D4AF34";
    
    
  }
  else {
    document.getElementById("cow-icon").src = "images/cow.svg";  
    document.getElementById("cow-border").style.borderColor = "#006C3A";
    document.getElementById("q1").style.borderColor = "#006C3A";
    document.getElementById("q2").style.borderColor = "#006C3A";
    document.getElementById("q3").style.borderColor = "#006C3A";
  }
}
window.inputValue = function (value) {
  let inputField = document.querySelector('#q1')
  console.log(value)
  if (value > 0) {
  inputField.style.border = "3px solid #006C3A";
  animalsCounter ++
  question1 = value;
  }
  else {
      inputField.style.border = "none";
      animalsCounter --;
  }
  document.querySelector('#question-number').innerHTML = animalsCounter;
  gold();
  _questionRef.doc('Animals').set({
    question1,
    animalsCounter
}, {
    merge: true
  });
  }

window.inputValue2 = function (value) {
  let inputField = document.querySelector('#q2')
  console.log(value)
  if (value > 0) {
  inputField.style.border = "3px solid #006C3A";
  animalsCounter ++;
  question2 = value;
  }
  else {
      inputField.style.border = "none";
      animalsCounter --;
  }
  document.querySelector('#question-number').innerHTML = animalsCounter;
  gold();
  _questionRef.doc('Animals').set({
    question2,
    animalsCounter
}, {
    merge: true
  });
  }

window.inputValue3 = function (value) {
  let inputField = document.querySelector('#q3')
  console.log(value)
  if (value > 0) {
  inputField.style.border = "3px solid #006C3A";
  animalsCounter ++;
  question3 = value;
  }
  else {
      inputField.style.border = "none";
      animalsCounter --;
  }
  document.querySelector('#question-number').innerHTML = animalsCounter;
  gold();
  _questionRef.doc('Animals').set({
    question2,
    animalsCounter
}, {
    merge: true
  });
  }


window.addAnimal = function() {
  addAnimal();
}
  function addAnimal() {

    _questionRef.doc('Animals').set({
        question1,
        question2,
        question3,
        animalsCounter
    }, {
        merge: true
      });
    }