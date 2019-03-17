var ratio = 0;
var closeNudgeActive = false;
var tryCloseNudgeActive = false;
var imagesNudgeActive = false;
var wordsNudgeActive = false;

var timer_time;
var tracked = false;

chrome.storage.local.get(['time_limit'], function(data){

  if(data.time_limit == undefined)
    chrome.storage.local.set({'time_limit': "01:00:00"}, function(){});
});

chrome.storage.local.get(['tracked_urls'], function(data){

  if(data.tracked_urls == undefined)
    chrome.storage.local.set({'tracked_urls': []}, function(){});
});

chrome.storage.local.get(['current_day'], function(data){

  if(data.current_day == undefined)
  {
    var date = new Date().getDate();
    chrome.storage.local.set({'timer': 0}, function(){});
    chrome.storage.local.set({'current_day': date}, function(){});
  }
});

chrome.storage.local.get(['timer'], function(data){

  // Get the total time
  timer_time = data.timer;

  if(timer_time == undefined)
  {
    chrome.storage.local.set({'timer': 0}, function(){});
    timer_time = 0;
  }

  // When the tab is changed
  chrome.tabs.onActivated.addListener(function(info) {
      
    processURLS();
    wordsNudgeActive = false;
    imagesNudgeActive = false;
    closeNudgeActive = false;
  });

  // When the tab url changes
  chrome.tabs.onUpdated.addListener(function(info){

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

      if(tabs[0].url != chrome.extension.getURL("options.html"))
      {
        processURLS();
        wordsNudgeActive = false;
        imagesNudgeActive = false;
        closeNudgeActive = false;
      }
    });
  })

  // When a message is received
  chrome.runtime.onMessage.addListener(function(message, sender, response){

    if(message.msg === "tracked_urls_changed") // Tracked URLs changed
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
      if(url === chrome.extension.getURL("options.html"))
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
  }

  chrome.storage.local.get(['time_limit'], function(data){

    var timer_limit = data.time_limit.split(":");

    var time_limit = parseInt(timer_limit[0]) * 3600;
    time_limit += parseInt(timer_limit[1]) * 60;
    time_limit += parseInt(timer_limit[2]);

    if(time_limit == 0)
        return;

    ratio = timer_time / time_limit;

    if(ratio > 2)
    {
      if(closeNudgeActive)
        return;

      closeNudge();

      closeNudgeActive = true;
    }
    else if(ratio > 1.6)
    {
      if(tryCloseNudgeActive)
        return;

      tryCloseNudge();
      
      tryCloseNudgeActive = true;
      closeNudgeActive = false;
    }
    else if(ratio > 1.3)
    {
      if(imagesNudgeActive)
        return;

      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        chrome.tabs.sendMessage(tabs[0].id, {msg: "change_images_nudge"});
        imagesNudgeActive = true;
      })
      closeNudgeActive = false;
      tryCloseNudgeActive = false;
    }
    else if(ratio > 1)
    {
      if(wordsNudgeActive)
        return;

      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        chrome.tabs.sendMessage(tabs[0].id, {msg: "change_words_nudge"});
        wordsNudgeActive = true;
      })
      closeNudgeActive = false;
      tryCloseNudgeActive = false;
      imagesNudgeActive = false;
    }
    else
    {
      closeNudgeActive = false;
      tryCloseNudgeActive = false;
      imagesNudgeActive = false;
      wordsNudgeActive = false;
    }
  })

  chrome.storage.local.get(['current_day'], function(data){

    var date = new Date().getDate();

    if(data.current_day != date)
    {
      chrome.storage.local.set({'timer': 0}, function(){});
      chrome.storage.local.set({'current_day': date}, function() {});
    }
  });
}, 1000);

function closeNudge()
{
  chrome.storage.local.get(['tracked_urls'], function (data) {

    tracked_urls = data.tracked_urls;
    var tracked_tabs = [];
  
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
  
      for (url of tracked_urls) {
        for (tab of tabs) {
          if (tab.url.startsWith(url))
          tracked_tabs.push(tab.id);
        }
      }
      chrome.tabs.remove(tracked_tabs, function(){});
    });
  });
}

function tryCloseNudge()
{
  if(ratio < 1.6)
    return;

  var result = confirm("Close unproductive tabs? :'(");

  if(result)
    closeNudge();
  else
    setTimeout(tryCloseNudge, 600000);
}