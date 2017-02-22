# Browser extension for Susi

This is a browser extension for api.asksusi.com. This extension works on both Chrome and Firefox.The aim of this 
extension is to provide browser assistance to users apart from letting users to chat with susi insde the browser 
itself.

## Features 
Presenty the extension provides the following features :

### Chatting with Susi
Users can chat with susi inside browser. The extension comes with a browser action (button), which on clicking opens,
the susi chat pane. Here the user can chat with susi.

### Openning any site

User can open any site just by asking susi to do so. For example to open http://facebook.com users just have to type
` open facebook ` in the chat and susi will open facebook for them.

### Searching any phrase using multiple search engines

User can search any phrase using the search engine of their choice. Presently three search engines are supported: **Google** ,
**Bing** and **DuckDuckGo**. For example to search the phrase 'Fossasia open source' using duckduckgo one needs to type
`search duckduckgo Fossasia open source` and susi will open the results in a separate tab.Similarly to search for the same
phrase using duckduckgo and bing one needs to type the following `search bing duckduckgo Fossasia open source` and susi will
open the respective search results in two tabs.

### Searching a selected text snippet

In chrome and firefox user can search a selected test snippet by selecting it and using the search google option from the context menu. Susi extension allows users to search for a selected text using duckduckgo and bing by adding these menu items in context menu. Susi extension adds a context menu item **Susi** which contains two other submenu items: **Read this Susi** and 
**Search this Susi** Search this Susi provides option to search a selected phrase using duckduckgo or bing.

### Reading out selected text

Susi can read out selected text.To use this feature user has to right click on the selected text and select the option 
**Read this Susi** form **Susi** submenu. Susi will read out the selected text to the user.

### taking notes

Susi can take notes for users. Users can ask susi to take note by typing the following in the chatpane 
`take note <note title> <note body>` and ask susi to show the notes by typing `show note(s)`. Susi will delete all notes 
if user types`clear note(s)`.

## Installing the extension

Presently only development version is available.In order to install and try out this extension please follow the below steps:

In order to load unpacked version (useful when making and testing changes during development) :

1. Clone this repository using `git clone https://github.com/djmgit/susi_browser_extension.git`
2. To install on Chrome: Open Chrome, Enter chrome://extensions in the url field, check developer mode, click
   on load unpacked extension and navigate to the extension folder which you just cloned.Navigate to the directory which
   contains manifest.json (susi_browser_extension/susi_browser_extension/) and click open. The extension will be installed on    chrome. Cheers !!.
3. To install on Firefox: Open Firefox, open about:debugging, click on load temporary addon, navigate to the extension folder, open the directory which contains manifest.json file (susi_browser_extension/susi_browser_extension/) and select and open any file in that folder. The extension will be installed in firefox. Cheers !!.

In order to install packaged version :

Presently packaged version is present only for Chrome which can be installed as follows :

Open Chrome, navigate to chrome://extensions, open susi_browser_extension/dist and drag and drop susi_browser_extension.crx into
the chrome://extensions page. The extension will be installed. Cheers !!.

# Contributing

Susi extension is in its very early stages of development now. Feel free to modify the source code, file issues, solve bugs and 
suggest new features and send pull requests.

# Future plans

Here I have listed some ideas which I want to add to susi extension in order to enhance it :

* Improving the user interface and look and feel of the chat pane.
* Implementing a settings section where user can personalise the app and change other settings, customise the app.
* Refactoring the code into various modules
* Using better method/algorithm to parse user message. Presently much of the commands are hard codded like search, open etc.
  This degrades the chat experience as user has to remember these. We need to overcome this.
* Adding more browser automation options and features, so that user's browsing experiencce imroves and susi can provide better
  assistance to the user.
* Providing more utility functions.

The aim of this extension is to provide assistance and automation to the user in form of a simple chat interface apart from 
the normal feature of chatting with susi which uses the susi AI api.So any new feature is welcome :)
