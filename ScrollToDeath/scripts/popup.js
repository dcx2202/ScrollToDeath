
var quotes = [

    "\"Time is money. Wasted time means wasted money means trouble.\"",
    "\"If time be of all things the most precious, wasting time must be the greatest prodigality.\"",     
    "\"There's no good way to waste your time. Wasting time is just wasting time.\"",
    "\"When you spend time worrying, you're simply using your imagination to create things you don't want.\"",
    "\"To think too long about doing a thing often becomes its undoing.\"",
    "\"A year from now you will wish you had started today.\"",
    "\"I do not want to waste any time. And if you are not working on important things, you are wasting time.\"",
    "\"When you kill time, remember that it has no resurrection.\"",
    "\"The biggest mistake you can make in life is to waste your time.\"",
    "\"One of the very worst uses of time is to do something very well that need not to be done at all.\"",
    "\"A man who dares to waste one hour of time has not discovered the value of life.\"",
    "\"Wasting time is robbing oneself.\"",
    "\"If you spend too much time thinking about a thing, you'll never get it done.\"",
    "\"We cannot waste time. We can only waste ourselves.\"",
    "\"Short as life is, we make it still shorter by the careless waste of time.\"",
    "\"The biggest waste is the waste of time.\"",
    "\"Do something instead of killing time because time is killing you.\"",
    "\"There is no waste of time in life like that of making explanations.\"",
    "\"How tragic it is to find that an entire lifetime is wasted in pursuit of distractions while purpose is neglected.\"",
    "\"It is named the \"Web\" for good reason."
]

alertify.set('notifier','position', 'bottom-center');
alertify.set('notifier','delay', 2);

var quote = document.getElementById("randomQuote");
quote.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];

var settingsButton = document.getElementById("settingsButton");
var trackButton = document.getElementById("trackButton");
var removeButton = document.getElementById("removeButton");
var timer = document.getElementById("timer");

chrome.storage.local.get(['timer'], function(data) {
    
    chrome.storage.local.get(['time_limit'], function(data2)
    {
        if(data2.time_limit == undefined)
        {
            chrome.storage.local.set({'time_limit': "01:00:00"}, function() {});
            var data2 = "01:00:00";
        }
        else
            data2 = data2.time_limit;


        chrome.storage.local.get(['timer'], function(data){

            var splits = data2.split(":");
            var seconds = parseInt(splits[0]) * 3600 + parseInt(splits[1]) * 60 + parseInt(splits[2]);

            var color;

            if(seconds <= 0)
            {
                color = "color: #000000";
                timer.innerHTML = "<strong style=\"" + color + "\">" + formatSeconds(data.timer) + "</strong><strong>/" +  data2 + "</strong>";
                return;
            }

            var ratio = data.timer / seconds;

            if(ratio >= 1)
                color = "color: #ff0000";
            else if(ratio > 0.7)
                color = "color: #ff9900";
            else
                color = "color: #000000";

            
            timer.innerHTML = "<strong style=\"" + color + "\">" + formatSeconds(data.timer) + "</strong><strong>/" +  data2 + "</strong>";
        });
    })

})

settingsButton.onclick = function()
{
    var url = chrome.runtime.getURL("options.html");
    chrome.tabs.create({"url": url});
}

trackButton.onclick = function()
{
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        if(tabs[0].url.startsWith("chrome") || tabs[0].url.startsWith("about"))
            return;

        var current_url = getURLNoPath(tabs[0].url);

        var urls = [];

        chrome.storage.local.get(['tracked_urls'], function(data) {
            
            if(data.tracked_urls != undefined)
            {
                urls = data.tracked_urls;

                if(urls.includes(current_url))
                {
                    alertify.dismissAll();
                    alertify.warning(current_url + " is already being tracked");
                    return;
                }

                urls[urls.length] = current_url;

                chrome.storage.local.set({'tracked_urls': urls}, function() {

                    alertify.dismissAll();
                    alertify.success(current_url + " is now being tracked");
                    chrome.runtime.sendMessage({msg: "tracked_urls_changed"});
                });
            }
            else
            {
                urls[0] = current_url;
                chrome.storage.local.set({'tracked_urls': urls}, function() {

                    alertify.dismissAll();
                    alertify.success(current_url + " is now being tracked");
                    chrome.runtime.sendMessage({msg: "tracked_urls_changed"});
                });
            }
          });
    });
}

removeButton.onclick = function()
{
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        
        if(tabs[0].url.startsWith("chrome") || tabs[0].url.startsWith("about"))
            return;

        var current_url = getURLNoPath(tabs[0].url);

        var urls = [];

        chrome.storage.local.get(['tracked_urls'], function(data) {
            
            if(data.tracked_urls != undefined)
            {
                urls = data.tracked_urls;

                if(!urls.includes(current_url))
                {
                    alertify.dismissAll();
                    alertify.warning(current_url + " is not being tracked");
                    return;
                }

                urls.splice(urls.indexOf(current_url), 1);

                chrome.storage.local.set({'tracked_urls': urls}, function() {

                    alertify.dismissAll();
                    alertify.error(current_url + " is no longer being tracked");
                    chrome.runtime.sendMessage({msg: "tracked_urls_changed"});
                });
            }
          });

    });
}

function getURLNoPath(current_url)
{
    if(current_url.startsWith("http"))
    {
        var splits = current_url.split("://");

        return splits[0] + "://" + splits[1].split("/")[0];
    }
    else
        return current_url.split("/")[0];
}

chrome.storage.local.get(['tracked_urls'], function(data) {});

function formatSeconds(seconds)
{
    var date = new Date(1970,0,1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

setInterval(function(){

    chrome.storage.local.get(['timer'], function(data) {
        
        chrome.storage.local.get(['time_limit'], function(data2)
        {
            if(data2.time_limit == undefined)
            {
                chrome.storage.local.set({'time_limit': "01:00:00"}, function() {});
                var data2 = "01:00:00";
            }
            else
                data2 = data2.time_limit;

            chrome.storage.local.get(['timer'], function(data){

                var splits = data2.split(":");
                var seconds = parseInt(splits[0]) * 3600 + parseInt(splits[1]) * 60 + parseInt(splits[2]);
    
                var color;
    
                if(seconds <= 0)
                {
                    color = "color: #000000";
                    timer.innerHTML = "<strong style=\"" + color + "\">" + formatSeconds(data.timer) + "</strong><strong>/" +  data2 + "</strong>";
                    return;
                }
    
                var ratio = data.timer / seconds;
    
                if(ratio >= 1)
                    color = "color: #ff0000";
                else if(ratio > 0.7)
                    color = "color: #ff9900";
                else
                    color = "color: #000000";
    
                
                timer.innerHTML = "<strong style=\"" + color + "\">" + formatSeconds(data.timer) + "</strong><strong>/" +  data2 + "</strong>";
            });
        })
    })
}, 1000);