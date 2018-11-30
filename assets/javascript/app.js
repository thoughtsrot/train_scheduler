// initialize and connect to firebase

let config = {
  apiKey: "AIzaSyBCA3mxMRF0jduhGd7S2zuC1U5cySo-WcQ",
  authDomain: "train-schedule-39c7d.firebaseapp.com",
  databaseURL: "https://train-schedule-39c7d.firebaseio.com",
  projectId: "train-schedule-39c7d",
  storageBucket: "train-schedule-39c7d.appspot.com",
  messagingSenderId: "265047602880"
};

firebase.initializeApp(config);

let db = firebase.database();

let $currentTime = $("#current-time");

function getCurrentTime() {
 
 var currentTime = moment().format("hh:mm");

 $currentTime.html(currentTime);

}

getCurrentTime();

setInterval(function() {
  getCurrentTime();
}, 1000);

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  let trainName = $("#train-name-input").val().trim();
  let trainOrigin = $("#origin-input").val().trim();
  let trainDest = $("#destination-input").val().trim();
  let trainStart = $("#start-input").val().trim();
  let trainFreq = $("#frequency-input").val().trim();

  let newTrain = {
    name: trainName,
    origin: trainOrigin,
    destination: trainDest,
    start: trainStart,
    frequency: trainFreq
  };

  // push train data to firebase
  db.ref().push(newTrain);

  alert("Train successfully added");

  $("#train-name-input").val("");
  $("#origin-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");

});

// print db data to html table
db.ref().on("child_added", function(childSnapshot) {

  let trainName = childSnapshot.val().name;
  let trainOrigin = childSnapshot.val().origin;
  let trainDest = childSnapshot.val().destination;
  let trainStart = childSnapshot.val().start;
  let trainFreq = childSnapshot.val().frequency;

  let convertTrainStart = moment(trainStart, "HH:mm").subtract(1, "years");

  // Difference between the times
  let diffTime = moment().diff(moment(convertTrainStart), "minutes");

  // Time apart (remainder)
  let tRemainder = diffTime % trainFreq;

  // Minute Until Train
  let minutesAway = trainFreq - tRemainder;

  // Next Train
  let nextTrain = moment().add(minutesAway, "minutes");


  let formatNextTrain = moment(nextTrain).format("HH:mm");

 let newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainOrigin),
    $("<td>").text(trainDest),
    $("<td>").text(trainFreq),
    $("<td>").text(formatNextTrain),
    $("<td>").text(minutesAway)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
