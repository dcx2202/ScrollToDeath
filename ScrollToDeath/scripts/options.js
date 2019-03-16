alertify.set('notifier','position', 'bottom-center');
alertify.set('notifier','delay', 2);

var clearButton = document.getElementById("clearButton");

clearButton.onclick = function clearAll()
{
    chrome.storage.sync.get(['tracked_urls'], function(data){
        
        urls = data.tracked_urls;

        if(urls.length == 0)
            return;

        chrome.storage.sync.set({'tracked_urls': []}, function() {
        
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

chrome.storage.sync.get(['tracked_urls'], function(data){
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