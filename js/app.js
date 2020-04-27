"use strict";

// SPA-SERVICE
import SpaService from "./spa-service.js";
let _spaService = new SpaService("login");
window.pageChange = function () {
    _spaService.pageChange();
}


const _questionRef = _db.collection("questions");
const _userRef = _db.collection("users")
const _dataRef = _db.collection("sustainabilityData")

let _categories;
let _currentUser;
let _sustainabilityData;


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
    _spaService.showPage("categories");
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

    _dataRef.orderBy("year").onSnapshot(function(snapshotData) {
        _sustainabilityData = [];
        snapshotData.forEach(function(doc) {
          let data = doc.data();
          data.id = doc.id;
          _sustainabilityData.push(data);
        });
        console.log(_sustainabilityData)

        appendDataChart(_sustainabilityData);
        appendBarDataChart(_sustainabilityData);
      });
}

//------------------------------------DATA - CHART----------------------------------------//




function prepareData(sustainabilityData) {
  let cows = [];
  let years = [];
  let milkProduced = [];
  let carbonFootprint = [];
  let cowConsumption = [];
  let energyDiesel = [];
  let energyElectricity = [];
  let suffInFeed = [];
  let CO2OutputDiesel = [];
  let CO2OutputElectricity = [];
  let CO2OutputFeed = [];
  let CO2OutputMethane = [];
  sustainabilityData.forEach(data => {
    cows.push(data.herdYearCows);
    years.push(data.year);
    milkProduced.push(data.herdMilkProduction);
    carbonFootprint.push(data.TotalCarbonFootprint);
    cowConsumption.push(data.cowsFeedConsumption);
    energyDiesel.push(data.energyDiesel);
    energyElectricity.push(data.energyElectricity);
    suffInFeed.push(data.herdSelfSufficiencyInFeed);
    CO2OutputDiesel.push(data.CO2KgMilkDiesel);
    CO2OutputElectricity.push(data.CO2KgMilkElectricity);
    CO2OutputFeed.push(data.CO2KgMilkFeed);
    CO2OutputMethane.push(data.CO2KgMilkMethane);
  });
  return {
    cows,
    years,
    milkProduced,
    carbonFootprint,
    cowConsumption,
    energyDiesel,
    energyElectricity,
    suffInFeed,
    CO2OutputDiesel,
    CO2OutputElectricity,
    CO2OutputFeed,
    CO2OutputMethane
  }
}

function appendDataChart(sustainabilityData){
  let data = prepareData(sustainabilityData);
  console.log(data);

  let chartContainer = document.querySelector('#barChart')
  let barChart = new Chart(chartContainer, {
    type: 'bar',
    data: {
      datasets: [
        {data: data.CO2OutputDiesel,
        label: "Diesel",
        backgroundColor: "rgb(75, 177, 49, 0.5)",
        borderColor: "rgb(75, 177, 49)"},
        {data: data.CO2OutputElectricity,
          label: "Strøm",
          backgroundColor: "rgb(0, 108, 58, 0.5)"},
        {data: data.CO2OutputFeed,
          label: "Importeret foder",
          backgroundColor: "rgb(255, 204, 50, 0.5)"},
        {data: data.CO2OutputMethane,
          label: "Methane",
          backgroundColor: "rgb(255, 126, 5, 0.5)"}],
      labels: data.years,
    },
    options: {
      title: {
        display: true,
        text: 'kg CO2 per kg mælk',
        fontSize: 20
    }
  }
});
}

let chart;

function appendBarDataChart(sustainabilityData){
  let data = prepareData(sustainabilityData);
  console.log(data);

  let chartContainer = document.querySelector('#myChart')
  chart = new Chart(chartContainer, {
    type: 'line',
    data: {
      datasets: [],
      labels: data.years
    },
    /*options: {
      scales: {
        yAxes: [{
          ticks: {
            min: (Math.min() - 2),
            max: (Math.max() + 2)
          }
        }]
      }
    }*/
});

window.AddCow = function(element) {
var randomColorStroke = "#" + Math.floor(Math.random()*16777215).toString(16);
var randomColorDot = "#" + Math.floor(Math.random()*16777215).toString(16);
  let datasetToAdd = {
    label: 'Antal køer',
      data: data.cows,
      fill: false,
      borderColor: randomColorStroke,
      backgroundColor: randomColorStroke,
      pointBackgroundColor: randomColorDot,
      pointBorderColor: randomColorDot,
      pointHoverBackgroundColor: randomColorDot,
      pointHoverBorderColor: randomColorDot,
      type: 'line'
    };
    if (element.checked) {
      chart.data.datasets.push(datasetToAdd);
      chart.update();
  }
    else {
    let removeIndex = chart.data.datasets.map(function(datasetToAdd) { return datasetToAdd.data; }).indexOf(data.cows);
    chart.data.datasets.splice(removeIndex, 1);
    chart.update(); 
    }
}
window.AddMilk = function(element) {
var randomColorStroke = "#" + Math.floor(Math.random()*16777215).toString(16);
var randomColorDot = "#" + Math.floor(Math.random()*16777215).toString(16);
  let datasetToAdd = {
    label: 'Mælk produceret per ko (kg)',
      data: data.milkProduced,
      fill: false,
      borderColor: randomColorStroke,
      backgroundColor: randomColorStroke,
      pointBackgroundColor: randomColorDot,
      pointBorderColor: randomColorDot,
      pointHoverBackgroundColor: randomColorDot,
      pointHoverBorderColor: randomColorDot,
      type: 'line'
    };
    if (element.checked) {
      chart.data.datasets.push(datasetToAdd);
      chart.update();
  }
    else {
    let removeIndex = chart.data.datasets.map(function(datasetToAdd) { return datasetToAdd.data; }).indexOf(data.milkProduced);
    chart.data.datasets.splice(removeIndex, 1);
    chart.update(); 
    }
}

window.AddcowCon = function(element) {
var randomColorStroke = "#" + Math.floor(Math.random()*16777215).toString(16);
var randomColorDot = "#" + Math.floor(Math.random()*16777215).toString(16);
  let datasetToAdd = {
    label: 'Tørfoder per ko (kg)',
      data: data.cowConsumption,
      fill: false,
      borderColor: randomColorStroke,
      backgroundColor: randomColorStroke,
      pointBackgroundColor: randomColorDot,
      pointBorderColor: randomColorDot,
      pointHoverBackgroundColor: randomColorDot,
      pointHoverBorderColor: randomColorDot,
      type: 'line'
    };
    if (element.checked) {
      chart.data.datasets.push(datasetToAdd);
      chart.update();
  }
    else {
    let removeIndex = chart.data.datasets.map(function(datasetToAdd) { return datasetToAdd.data; }).indexOf(data.cowConsumption);
    chart.data.datasets.splice(removeIndex, 1);
    chart.update(); 
    }
}
window.AddSuffInFeed = function(element) {
var randomColorStroke = "#" + Math.floor(Math.random()*16777215).toString(16);
var randomColorDot = "#" + Math.floor(Math.random()*16777215).toString(16);
  let datasetToAdd = {
    label: 'Procent tørfoder af kost (%)',
      data: data.suffInFeed,
      fill: false,
      borderColor: randomColorStroke,
      backgroundColor: randomColorStroke,
      pointBackgroundColor: randomColorDot,
      pointBorderColor: randomColorDot,
      pointHoverBackgroundColor: randomColorDot,
      pointHoverBorderColor: randomColorDot,
      type: 'line'
    };
    if (element.checked) {
      chart.data.datasets.push(datasetToAdd);
      chart.update();
  }
    else {
    let removeIndex = chart.data.datasets.map(function(datasetToAdd) { return datasetToAdd.data; }).indexOf(data.suffInFeed);
    chart.data.datasets.splice(removeIndex, 1);
    chart.update(); 
    }
}
window.AddenergyDiesel = function(element) {
var randomColorStroke = "#" + Math.floor(Math.random()*16777215).toString(16);
var randomColorDot = "#" + Math.floor(Math.random()*16777215).toString(16);
  let datasetToAdd = {
    label: 'Energi - Diesel (liter)',
      data: data.energyDiesel,
      fill: false,
      borderColor: randomColorStroke,
      backgroundColor: randomColorStroke,
      pointBackgroundColor: randomColorDot,
      pointBorderColor: randomColorDot,
      pointHoverBackgroundColor: randomColorDot,
      pointHoverBorderColor: randomColorDot,
      type: 'line'
    };
    if (element.checked) {
      chart.data.datasets.push(datasetToAdd);
      chart.update();
  }
    else {
    let removeIndex = chart.data.datasets.map(function(datasetToAdd) { return datasetToAdd.data; }).indexOf(data.energyDiesel);
    chart.data.datasets.splice(removeIndex, 1);
    chart.update(); 
    }
}
window.AddenergyElectricity = function(element) {
var randomColorStroke = "#" + Math.floor(Math.random()*16777215).toString(16);
var randomColorDot = "#" + Math.floor(Math.random()*16777215).toString(16);
  let datasetToAdd = {
    label: 'Energi - Strøm (kWh)',
      data: data.energyElectricity,
      fill: false,
      borderColor: randomColorStroke,
      backgroundColor: randomColorStroke,
      pointBackgroundColor: randomColorDot,
      pointBorderColor: randomColorDot,
      pointHoverBackgroundColor: randomColorDot,
      pointHoverBorderColor: randomColorDot,
      type: 'line'
    };
    if (element.checked) {
      chart.data.datasets.push(datasetToAdd);
      chart.update();
  }
    else {
    let removeIndex = chart.data.datasets.map(function(datasetToAdd) { return datasetToAdd.data; }).indexOf(data.energyElectricity);
    chart.data.datasets.splice(removeIndex, 1);
    chart.update(); 
    }
}
window.Addcarbon = function(element) {
var randomColorStroke = "#" + Math.floor(Math.random()*16777215).toString(16);
var randomColorDot = "#" + Math.floor(Math.random()*16777215).toString(16);
  let datasetToAdd = {
    label: 'Totalt CO2 fodspor (ton)',
      data: data.carbonFootprint,
      fill: false,
      borderColor: randomColorStroke,
      backgroundColor: randomColorStroke,
      pointBackgroundColor: randomColorDot,
      pointBorderColor: randomColorDot,
      pointHoverBackgroundColor: randomColorDot,
      pointHoverBorderColor: randomColorDot,
      type: 'line'
    };
    if (element.checked) {
      chart.data.datasets.push(datasetToAdd);
      chart.update();
  }
    else {
    let removeIndex = chart.data.datasets.map(function(datasetToAdd) { return datasetToAdd.data; }).indexOf(data.carbonFootprint);
    chart.data.datasets.splice(removeIndex, 1);
    chart.update(); 
    }
}

}


//--------------------------------------CATEGORIES---------------------------------//



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


