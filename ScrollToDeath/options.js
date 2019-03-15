window.onload() = function()
{

var clearButton = document.getElementById("clearButton");

clearButton.onclick = function clearAll()
{
    chrome.storage.sync.set({'tracked_urls': []}, function() {
        
    });
}

console.log(document);

}