$(document).ready(function(){
  // Global Variables
  var send_button = document.getElementById('message-send-button');
  var text = document.getElementById('message-text');
  var list = document.getElementById('message-data');
  var reply = undefined;
  var url = "https://api.asksusi.com/susi/chat.json?q=";
  var body = document.getElementById('window');

  var send_message = function(message) {
    $.ajax({
      url: url + encodeURI(message),
      async: true,
      type: "GET",
      cache: false,
      crossDomain: true,
      dataType: "jsonp",
      success: function(response){
        var response = JSON.stringify(response);
        data = JSON.parse(response);
        reply = undefined;
        reply = data.answers[0].data[0].answer;
        addReply();
      }, 
      error: function(xhr){
        reply = undefined;
        reply = "Sorry. There seems to be a problem."
        addReply();
      }

    });
       
  }

  var append = function(text, attr){
    let el = document.createElement("div");
    el.setAttribute(attr.name, attr.val);
    el.appendChild(document.createTextNode(text));
    list.appendChild(el);
    if (attr.val === "from-them") {
      addTime({ name: "class", val: "susi-time", text: "susi" });
    } else {
      addTime({ name: "class", val: "me-time", text: "you" });
    }
    let clear = document.createElement("div");
    clear.setAttribute("class", "clear");
    list.appendChild(clear);
    $('html,body').animate({
      scrollTop: $("#message-data").offset().top + list.scrollHeight}, 1200);
  }

  var addReply = function() {
    if(reply != undefined) {
      append(reply, { name: "class", val: "from-them" });
      reply = undefined;
    }
  }

  var addTime = function(attr) {
    let date = new Date();
    let time = document.createElement("div");
    time.setAttribute(attr.name, attr.val);
    time.innerHTML = attr.text + "    " + date.getHours() + ":" +date.getMinutes();
    list.appendChild(time);
  }

  text.onkeypress = function(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      e.preventDefault();
      let message = text.value;
      if (message.length !== 0) {
        text.value = "";
        send_message(message);
        append(message, { name: "class", val: "from-me" });
        //addReply();
      }
    }
  }

  var applyLightTheme = function() {
    if (document.getElementById('dark-theme') !== null) {
      $('#dark-theme').remove();
    }
    if (document.getElementById('light-theme') === null) {
      $('head').append('<link id="light-theme" rel="stylesheet" type="text/css" href="./css/themes/light_theme.css">'); 
    }
    $(".theme-content").hide();
  }

  var applyDarkTheme = function() {
   if (document.getElementById('light-theme') !== null) {
      $('#light-theme').remove();
    }
    if (document.getElementById('dark-theme') === null) {
      $('head').append('<link id="dark-theme" rel="stylesheet" type="text/css" href="./css/themes/dark_theme.css">'); 
    }
    $(".theme-content").hide();
  }

  $(".applyLightThemeOption").click(function () {
    applyLightTheme();
  });

  $(".applyDarkThemeOption").click(function () {
    applyDarkTheme();
  });

  $(".theme").click(function () {
    $(".theme-content").toggle();
  });

  $(".settings").click(function () {
    $(".theme-content").hide();

    /* Other stuff to be added here */
  });
});
