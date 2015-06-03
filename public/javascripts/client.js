// connect to the socket server
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);
ws.onmessage = function(event){
  var nextUp = JSON.parse(event.data);
  console.log("Changing speakers");
  changeLiveSpeaker(nextUp.theatre, nextUp.title);
};


$(document).ready(function(){
  $('.all-talks').on('click', '.speaker-title', function(e){
    e.preventDefault();
    var title = $(this).text();
    var theatre = $(this).attr("data-theatre");
    var speaker = $(this).attr("data-speaker");
    var nextUp = { title: title, speaker: speaker, theatre: theatre};
    ws.send(JSON.stringify(nextUp)); // Message server to update all clients
  });
});

function changeLiveSpeaker(theatre, title){
  if (theatre == "Theatre 14") {
    $("#live-theatre-14").text(title);
  } else {
    $("#live-theatre-15").text(title);
  }
}

