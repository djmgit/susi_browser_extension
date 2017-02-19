/* Handles background features independent of the chatpane */

var DEFAULT_CHUNK_SIZE = 125;
var US_CHUNK_SIZE = 1024;

/* functions for preprocessing the text */

function parsePhase0(s) {
  var out = "";
        s = s.replace(/\u00AD/g, '-');

  // Convert currency like "$1,000" to "$1000"
  for(var i = 0; i < s.length; i++) {
    var ch = s.charAt(i);
    if(ch == ',' && i > 0 && (i+1) < s.length) {
      // If we are "surrounded" by numbers, simply remove the commas....
      var prevChar = s.charAt(i-1);
      var nextChar = s.charAt(i+1);
      out += ch;
    } else if(false) {
    } else {
      out += ch;
    }
  }
  return out;
}

function parsePhase1(s) {
  var out = "";

  // Take out URLs
  var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  out = s.replace(urlRegex, "{LINK}");

  return out;
}

function getChunkSize() {
  var cs = DEFAULT_CHUNK_SIZE;
  var selectedVoice = 'Google US English';
  if(selectedVoice == 'native') {
    cs = US_CHUNK_SIZE;
  }
  return cs;
}

function getChunks(s) {
  // First pass, convert/handle commas around currency, and various special characters
  s = parsePhase0(s);

  // Second pass, take out URLs, etc
  s = parsePhase1(s);

  // Chunk up the data
  var chunkList = [];
  chunkList = chunker(s, getChunkSize());
  return chunkList;
}

function chunker(s, max) {
  var chunks = [];
  var l = [];
  //l = s.split(/\.\s+|\n|,/);  // Split on: (period, comma, carriage-return)
  l = s.split(/\n/);  // Split on <CR>
  for(var i = 0; i < l.length; i++) {
    var chunk = l[i];
    if(chunk == '') {
        continue;
    }
    var siz = chunk.length;
    if(siz <= max) {
      chunks.push(chunk);
    } else {
      while(chunk.length > 0) {
        var smallerChunk = subChunker(chunk, max);
        chunks.push(smallerChunk);
        chunk = chunk.substr(smallerChunk.length);
      }
    }
  }
  return chunks;
}

function subChunker(s, max) {
  var chunk = s.substr(0, max);

  if(chunk.charAt(max) == ' ') {  // Lucky...
    return chunk;
  }

  // Start 'rewinding' until a space is found{hopefully}
  for(var i = chunk.length; i > 0; i--) {
    if(chunk.charAt(i) == ' ') {  // Stop!
      return chunk.substr(0, i);
    }
  }

  // No space found-- last resort have to cut in mid-word
  return chunk;
}

/* function to read text */

function readText(info, tab) {
  //starting for the text to speech conversion using web speech api
  read_content = info.selectionText;
  var chunkList = getChunks(read_content);
  chunkList.forEach(function(chunk) {
    doSpeak(chunk);
  });

  return false;
}

function doSpeak(s) {
  var selectedVoice = 'Google UK English Female';
  var msg = new SpeechSynthesisUtterance();

  // If the user had selected a voice, use it...
  if(selectedVoice) {
    msg.voice = window.speechSynthesis.getVoices().filter(function(voice) {
      return voice.name == selectedVoice;
    })[0];
  }

  msg.rate = 1; // 0.1 to 10
  msg.pitch = 1; // 0 to 2
  msg.text = s;

  // Now speak...
  window.speechSynthesis.speak(msg);
  return false;
}

/* function to read text */

/*var readText = function (info, tab) {
  alert(info.selectionText);
  window.speechSynthesis.getVoices();
  read_content = info.selectionText;
  read_content.toLowerCase();

  var selectedVoice = 'Google UK English Female';
  var msg = new SpeechSynthesisUtterance();

  // If the user had selected a voice, use it...
  if(selectedVoice) {
    msg.voice = window.speechSynthesis.getVoices().filter(function(voice) {
        return voice.name == selectedVoice;
      })[0];
  }

  msg.rate = 1; // 0.1 to 10
  msg.pitch = 1; // 0 to 2
  msg.text = read_content;

  // Now speak...
  window.speechSynthesis.speak(msg);
  return false;  
}*/

/* creating context menu item to read text */

var readTextMenuItem = chrome.contextMenus.create({"title": "Read this Susi", "contexts":["selection"], "onclick":readText});
