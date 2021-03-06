
let filenames = [

    "image_1.png",
    "image_2.png",
    "image_3.png",
    "image_4.png",
    "image_5.png",
    "image_6.png",
    "image_7.png",
    "image_8.png",
    "image_9.png",
    "image_10.png",
    "image_11.png",
    "image_12.png",
    "image_13.png",
    "image_14.png",
    "image_15.png",
    "image_16.png",
    "image_17.png",
    "image_18.png",
    "image_19.png",
    "image_20.png",
    "image_21.png",
    "image_22.png",
    "image_23.png",
    "image_24.png",
    "image_25.png",
    "image_26.png"
];

function changeImagesNudge()
{
    var images = document.getElementsByTagName('img');

    for(image of images)
    {
        if(Math.random() > 0.2)
            continue;

        var img = filenames[Math.floor(Math.random() * filenames.length)];
        image.src = chrome.extension.getURL("/resources/images/" + img);
    }
}

function changeWordsNudge()
{
    var change = "<strong style=\"background-color: rgba(255, 255, 0, 60); color: #000\">";
    var patterns = ["time", "tempo",
                    "waste", "desperdício",
                    "procrastinate", "procrastinação",
                    "work", "trabalho",
                    "productivity", "produtividade",
                    "productive", "produtivo",
                    "stop", "para",
                    "lazy", "preguiça",
                    "outdoors", "rua",
                    "effort", "esforço",
                    "hours", "horas",
                    "minutes", "minutos",
                    "seconds", "segundos",
                    "labor", "trabalhar",
                    "try", "tenta"];

    var elements = document.getElementsByTagName('p');

    for(element of elements)
    {
        for(pattern of patterns)
        {
            var str = element.innerHTML;
            str = str.replace(" " + pattern + " ", " " + change + pattern + "</strong>" + " ");

            var upper_pattern = pattern.replace(pattern.charAt(0), pattern.charAt(0).toUpperCase())

            str = str.replace(" " + upper_pattern + " ", " " + change + upper_pattern + "</strong>" + " ");

            element.innerHTML = str;
        }
    }

    elements = document.getElementsByTagName('h1');

    for(element of elements)
    {
        for(pattern of patterns)
        {
            var str = element.innerHTML;
            str = str.replace(" " + pattern + " ", " " + change + pattern + "</strong>" + " ");

            var upper_pattern = pattern.replace(pattern.charAt(0), pattern.charAt(0).toUpperCase())

            str = str.replace(" " + upper_pattern + " ", " " + change + upper_pattern + "</strong>" + " ");

            element.innerHTML = str;
        }
    }

    elements = document.getElementsByTagName('h2');

    for(element of elements)
    {
        for(pattern of patterns)
        {
            var str = element.innerHTML;
            str = str.replace(" " + pattern + " ", " " + change + pattern + "</strong>" + " ");

            var upper_pattern = pattern.replace(pattern.charAt(0), pattern.charAt(0).toUpperCase())

            str = str.replace(" " + upper_pattern + " ", " " + change + upper_pattern + "</strong>" + " ");

            element.innerHTML = str;
        }
    }

    elements = document.getElementsByTagName('h3');

    for(element of elements)
    {
        for(pattern of patterns)
        {
            var str = element.innerHTML;
            str = str.replace(" " + pattern + " ", " " + change + pattern + "</strong>" + " ");

            var upper_pattern = pattern.replace(pattern.charAt(0), pattern.charAt(0).toUpperCase())

            str = str.replace(" " + upper_pattern + " ", " " + change + upper_pattern + "</strong>" + " ");

            element.innerHTML = str;
        }
    }
}

chrome.runtime.onMessage.addListener(function(message, sender, response){

    if(message.msg === "change_images_nudge")
        changeImagesNudge();
    else if(message.msg === "change_words_nudge")
        changeWordsNudge();
})