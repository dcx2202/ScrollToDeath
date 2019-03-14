chrome.tabs.onUpdated.addListener(function(info) {

    
    var tracked_urls;
    
    chrome.storage.sync.get(['key'], function(result) {
        tracked_urls = result.key;
      });

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs[0].url);
      });

    //var timer = document.getElementsById("timer");
    //console.log(timer);

})