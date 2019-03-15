
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

var quote = document.getElementById("randomQuote");
quote.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];

var settingsButton = document.getElementById("settingsButton");
var trackButton = document.getElementById("trackButton");
var removeButton = document.getElementById("removeButton");

settingsButton.onclick = function()
{
    console.log("settings menu");

    var url = chrome.runtime.getURL("options.html");
    //chrome.tabs.create({"url": url});
    chrome.storage.sync.clear();
}

trackButton.onclick = function()
{
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        var current_url = tabs[0].url;

        if(current_url.startsWith("http"))
        {
            var splits = current_url.split("://");

            current_url = splits[0] + "://" + splits[1].split("/")[0];
        }
        else
            current_url = current_url.split("/")[0];

        var urls = [];

        chrome.storage.sync.get(['tracked_urls'], function(data) {
            
            if(data.tracked_urls != undefined)
            {
                urls = data.tracked_urls;

                if(urls.includes(current_url))
                    return;

                urls[urls.length] = current_url;

                chrome.storage.sync.set({'tracked_urls': urls}, function() {
                    
                  });
            }
            else
            {
                chrome.storage.sync.set({'tracked_urls': urls}, function() {
                    
                });
            }
          });
    });
}

removeButton.onclick = function()
{
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log("Removed website " + tabs[0].url);

    });
}


chrome.storage.sync.get(['tracked_urls'], function(data) {


    console.log(data);
});