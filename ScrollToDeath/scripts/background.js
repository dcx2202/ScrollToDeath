
var timer_time;
var tracked = false;


chrome.storage.local.get(['timer'], function(data){

  // Get the total time
  timer_time = data.timer;

  if(timer_time == undefined)
  {
    chrome.storage.local.set({'timer': 0}, function() {});
    timer_time = 0;
  }

  // When the tab is changed
  chrome.tabs.onActivated.addListener(function(info) {
      
    processURLS();
  });

  // When the tab url changes
  chrome.tabs.onUpdated.addListener(function(info){

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

      if(tabs[0].url != "chrome-extension://bbpbpalmabjemgfacpmiehcpcejgofii/options.html")
        processURLS();
    });
  })

  chrome.runtime.onMessage.addListener(function(message, sender, response){

    if(message.msg === "tracked_urls_changed")
      processURLS();
  })
});

function processURLS()
{
  // Get the tracked urls
  chrome.storage.local.get(['tracked_urls'], function(data) {
        
    var tracked_urls = data.tracked_urls;

    if(tracked_urls == undefined || tracked_urls.length == 0)
    {
      tracked = false;
      return;
    }

    //Get the currently visible/active tab
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

      var url = tabs[0].url + "";
      
      // If it's the options page we want to refresh it to display the up to date tracked websites list
      if(url === "chrome-extension://bbpbpalmabjemgfacpmiehcpcejgofii/options.html")
        chrome.tabs.reload(tabs[0].id);

      // For each of the tracked urls we check if this tab we are in currently is being tracked

      tracked = false;

      for(url of tracked_urls)
      {
        // If it is then we start keeping track of the time
        if(tabs[0].url.startsWith(url))
        {
          tracked = true;
          break;
        }
      }
    });
  });
}

setInterval(function(){
  if(tracked)
  {
    timer_time++;
    chrome.storage.local.set({'timer': timer_time}, function() {});
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

      chrome.tabs.sendMessage(tabs[0].id, {msg: timer_time});
    });
  }
}, 1000);