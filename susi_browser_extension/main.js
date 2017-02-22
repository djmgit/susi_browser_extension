$(document).ready(function(){
  // Global Variables
  var send_button = document.getElementById('message-send-button');
  var text = document.getElementById('message-text');
  var list = document.getElementById('message-data');
  var reply = undefined;
  var url = "https://api.asksusi.com/susi/chat.json?q=";
  var body = document.getElementById('window');

  /* notes object: used to take notes from users */

  var notes = {
    'currentnotes': [],
    'length': 0
  };

  /* function to retrieve the present notes if any */

  chrome.storage.local.get('notes', function (localnotes) {
    if (Object.keys(localnotes).length !== 0) {
      notes = localnotes.notes;
    }
  }); 

  /* process user message and take a decission */
  var processMessage = function(message) {
    var token_array = message.split(" ");
    console.log(token_array);
    if (token_array.indexOf("open") !== -1 || token_array.indexOf("OPEN") !== -1) {
      openPage(token_array[token_array.length - 1]);
    } else if (token_array[0].toLowerCase() === "search") {
      webSearch(token_array, message);
    } else if (message.indexOf("take note") !== -1 || message.indexOf("TAKE NOTE") !== -1) {
      takeNote(token_array, message);
    } else if (message.indexOf("show note") !== -1 || message.indexOf("SHOW NOTE") !== -1) {
      showNotes()
    } else if (message.indexOf("clear note") !== -1 || message.indexOf("CLEAR NOTE") !== -1) {
      clearNotes();	
    }
    else {
      send_message(message);
    }
  }

  /* search web */

  var webSearch = function(token_array, message) {
    var google = false;
    var duckduckgo = false;
    var bing = false;
    var num = 0;
    var search_term = "";
    if (token_array.indexOf("google") !== -1 || token_array.indexOf("GOOGLE") !== -1) {
      google = true;
      num += 1;
    }
    if (token_array.indexOf("bing") !== -1 || token_array.indexOf("BING") !== -1) {
      bing = true;
      num += 1;
    }
    if (token_array.indexOf("duckduckgo") !== -1 || token_array.indexOf("DUCKDUCKGO") !== -1) {
      duckduckgo = true;
      num += 1;
    }
    if (google === false && duckduckgo === false && bing === false) {
      append("Sorry! I dont know about this search engine. Please use google, bing or duckduckgo", { name: "class", val: "from-them" }, "text");
      return;
    }
    search_term = token_array.slice(num + 1).join('+');
    if (google === true) {
      var search_url = "https://www.google.co.in/search?site=&source=hp&q=" + search_term + "&oq=" + search_term + "&gs_l=hp.3..0l10.15130.23099.0.23503.30.24.2.3.3.0.379.3486.0j10j6j1.17.0....0...1c.1.64.hp..10.19.3036.0..35i39k1j0i131k1j0i10k1.46gxKrandYc";
      var search_tab = chrome.tabs.create({url: search_url});
    }
    if (bing === true) {
      var search_url = "http://www.bing.com/search?q=" + search_term + "&qs=n&form=QBLH&sp=-1&pq=" + search_term + "&sc=8-14&sk=&cvid=56D81D26436548CF9AA1B6296219240E";
      var search_tab = chrome.tabs.create({url: search_url});
    }
    if (duckduckgo === true) {
      var search_url = "https://beta.duckduckgo.com/?q=" + search_term + "&t=ha";
      var search_tab = chrome.tabs.create({url: search_url});
    }

    append("done!", { name: "class", val: "from-them" }, "text");
  }

  /* function to open a page specified by user */
  var openPage = function(pagename) {
    if (pagename.indexOf("http") === -1) {
      pagename = "http://" + pagename;
    }
    if (pagename.indexOf(".") === -1) {
      pagename += ".com";
    }
    chrome.tabs.create({url: pagename});
    append("done!", { name: "class", val: "from-them" }, "text");
  }

  /* function to save a note */

  var takeNote = function(token_array, message) {
    var note_title = token_array[2];
    var note_body = token_array.slice(3).join(' ');
    var note = {'title': note_title, 'body': note_body};
    notes.currentnotes.unshift(note);
    notes.length += 1;
    chrome.storage.local.set({'notes': notes}, function() {
      append("Note taken", { name: "class", val: "from-them" }, "text");
    });
  }

  var showNotes = function() {
    if (notes.length === 0) {
      append("You do not have any notes to show yet", { name: "class", val: "from-them" }, "text");
    } else {
      var formatted_notes = getFormattedNotes();
      append(getFormattedNotes(), { name: "class", val: "from-them" }, "html");
    }
  }

  var getFormattedNotes = function() {
    var formatted_notes = "";
	notes.currentnotes.forEach(function(note) {
      /*formatted_notes += '<div class="note">' + 
      						'<div class="note-title">' + note.title + '</div>' +
      						'<div class="note-body">' + note.body + '</div>' +
      					 '</div>'	*/
      	formatted_notes += '<strong>' + note.title + ':' + '</strong>' + '</br>' + note.body + '</br>';

    });
    return formatted_notes;
  }

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

  var clearNotes = function() {
 	notes = {
      'currentnotes': [],
      'length': 0
  	};
 	chrome.storage.local.set({}, function() {
      append("Cleared all notes", { name: "class", val: "from-them" }, "text");
    });
  }

  var append = function(text, attr, type){
    let el = document.createElement("div");
    el.setAttribute(attr.name, attr.val);
    if (type === "text") {
      el.appendChild(document.createTextNode(text));
    } else if (type === "html") {
    	el.innerHTML = text;
    }
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
      append(reply, { name: "class", val: "from-them" }, "text");
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
        append(message, { name: "class", val: "from-me" }, "text");
        processMessage(message);
        //send_message(message);
        //append(message, { name: "class", val: "from-me" });
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
