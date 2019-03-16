alertify.set('notifier','position', 'bottom-center');
alertify.set('notifier','delay', 2);

var clearButton = document.getElementById("clearButton");
document.getElementById("limit").defaultValue = "01:00:00";
var limit = document.getElementById("limit");
var saveLimit = document.getElementById("saveLimit");

clearButton.onclick = function clearAll()
{
    chrome.storage.local.get(['tracked_urls'], function(data){
        
        urls = data.tracked_urls;

        if(urls.length == 0)
        {
            alertify.dismissAll();
            alertify.warning("No websites are being tracked.");
            return;
        }

        chrome.storage.local.set({'tracked_urls': []}, function() {
        
            alertify.dismissAll();
            alertify.success("No longer tracking " + urls.length + " websites.");
            setTimeout(function(){ 

                window.location.reload();
            }, 2000);
        });
    });
}

var urls = [];

var back = false;

chrome.storage.local.get(['tracked_urls'], function(data){
    urls = data.tracked_urls;

    if(urls.length == 0)
        return;

    var ul = document.createElement('ul');
    ul.setAttribute("style", "background-color:rgb(120, 120, 120); border: 1px solid black;");

    document.getElementById('myItemList').appendChild(ul);

    urls.forEach(function (url) {
        var li = document.createElement('li');
        ul.appendChild(li);
    
        li.innerHTML += url;

        if(back)
            li.style.backgroundColor = "#BDBDBD";
        
        back = !back;
    });
});

saveLimit.onclick = function saveLimit()
{
    var current = limit.value;

    if(current.split(":").length < 3)
        current = current + ":00";

    chrome.storage.local.get(['time_limit'], function(data) {
    
        if(data.time_limit != undefined)
        {
            chrome.storage.local.set({'time_limit': current}, function() {

                alertify.dismissAll();
                alertify.success("New time limit defined");
                console.log(current);
            });
        }
        else
        {
            chrome.storage.local.set({'time_limit': current}, function() {

                alertify.dismissAll();
                alertify.success("New time limit defined");
                console.log(current);
            });
        }
    });
} 