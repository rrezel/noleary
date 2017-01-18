function onMessage(request, sender, sendResponse) {
  if (request.method == "saveStats") { 
    console.log("Storing stats...");
    console.log ("Adding " + request.olearies + " O'Leary to stats.");
    chrome.storage.sync.get({
      olearies: 0,
      pages: 0
    }, function(items) {
      chrome.storage.sync.set({
        trumps: items.olearies + request.olearies,
        pages: items.pages + 1
      });
    });
    sendResponse({});
  } else {
    // Show icon
    console.log("Putting badge on address bar.");
    chrome.pageAction.show(sender.tab.id);

    // Log event with Google Analytics
    console.log("Logging Filter event...");
    chrome.storage.sync.get({
      filter: 'mild'
    }, function(items) {
      console.log("Filtering on " + items.filter + " setting.");
      ga('send', 'event', 'Filter', 'Trump', items.filter);
    });
    sendResponse({});
  }
}

chrome.runtime.onMessage.addListener(onMessage);
