chrome.tabs.onUpdated.addListener(function(info) {

    
    var tracked_urls;
    
    chrome.storage.sync.get(['tracked_urls'], function(result) {
        tracked_urls = result.key;
      });

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs[0].url);

        /*var tracked = false;

        for(url of tracked_urls)
        {
            if(tabs[0].url.startsWith(url))
            {
                tracked = true;
                chrome.storage.sync.get(['timer'], function(result) {
                    tracked_urls = result.key;
                  });
            }
        }*/
      });

    //var timer = document.getElementsById("timer");
    //console.log(timer);

})