var clearButton = document.getElementById("clearButton");

clearButton.onclick = function clearAll()
{
    chrome.storage.sync.set({'tracked_urls': []}, function() {
        
    });
}

var urls = [];

var items = chrome.storage.sync.get(['tracked_urls'], function(data){
    urls = data;
});

/*var items = [
    'Blue',
    'Red',
    'White',
    'Green',
    'Black',
    'Orange'
];*/


var ul = document.createElement('ul');

document.getElementById('myItemList').appendChild(ul);

urls.forEach(function (url) {
    var li = document.createElement('li');
    ul.appendChild(li);

    li.innerHTML += url;
});