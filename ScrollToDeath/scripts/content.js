var ratio = 0;

chrome.runtime.onMessage.addListener(function(message, sender, response){

    var timer = message.msg;

    chrome.storage.sync.get(['time_limit'], function(data){

        ratio = timer / data.timer_limit;

        if(ratio > 2)
            tryCloseNudge();
        else if(ratio > 1.5)
            changeImagesNudge();
        else if(ratio > 1)
        {
            changeWordsNudge();
        }
    })
})

function tryCloseNudge()
{

}

function changeImagesNudge()
{
    var images = document.getElementsByTagName('img');

    for(image of images)
    {
        image.
    }
}

function changeWordsNudge()
{

}