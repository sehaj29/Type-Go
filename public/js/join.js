var socket = io.connect('http://localhost:4000');

const link = "http://api.quotable.io/random";

var pera = document.getElementById('pera');
var myText = document.getElementById('myText');
var timeLeftSpan = document.getElementById('timeLeftSpan');
var textInSmallTag = document.getElementById('textInSmallTag');
var timeLeft = 6;
var startInputTime = null;
var endinputTime = null;
var totalWords;
var hack = document.getElementById('hack');

socket.emit('joinRoom',{
    roomCode : 'dshg34363746c4t'
})

socket.on('startGame',(startCredentials)=>{
    countDown();
    totalWords = startCredentials.totalWords;
    hack.innerHTML = startCredentials.peraAfterFillingQuote;
    // console.log(peraAfterFillingQuote.totalWords)
    setTimeout(()=>{hack.style.display = 'block';},4000);
    textInSmallTag.innerText = "";
    textInSmallTag.classList.add('green');
    timeLeftSpan.classList.add('green');
})


function countDown() {
    setTimeout(() => {
        timeLeft--;
        
        if (timeLeft >= 0) {
            textInSmallTag.innerText = "starting in: ";
            timeLeftSpan.innerText = timeLeft;
            // textInSmallTag.classList.add('green');
            // timeLeftSpan.classList.add('green');
            switch (timeLeft) {
                case 0:
                    timeLeftSpan.innerText = "";
                    // console.log('im here');
                    textInSmallTag.innerText = 'Start Typing...';
                    break;
                case 1:
                    myText.disabled = false;
                    myText.focus();
                    if(startInputTime == null){
                        startInputTime = new Date().getTime();
                        console.log('start time',startInputTime);
                    }
                    break;
                case 3:
                    textInSmallTag.classList.add('red');
                    textInSmallTag.classList.remove('green');
                    timeLeftSpan.classList.add('red');
                    timeLeftSpan.classList.remove('green');
                    break;
                default:
                    break;
            }
            // timeLeftSpan.innerText = timeLeft;
            countDown();
        }
    }, 1000)
}



function getRandomQuote() {
    return (fetch(link)
        .then(response => response.json())
        .then(myData => myData.content));
}

//inserting elements from api to pera
async function getNextQuote() {
    const quote = await getRandomQuote();
    totalWords = quote.split(' ').length;
    // console.log('total words=',totalWords);
    // console.log(quote);
    // pera.innerText = '';
    quote.split('').forEach(i => {
        var characterSpan = document.createElement('span'); //this element will created every time newly
        characterSpan.innerText = i;
        characterSpan.classList.add('mySpan');
        pera.appendChild(characterSpan);
        // console.log(characterSpan);

    });
    myText.value = "";  //not neccesary
}


//calculating WPM
function wpmFunc(){
    var diff = endinputTime - startInputTime;
    var timeTakenToInputInMinutes = diff/60000;
    var wpm = Math.round(totalWords/timeTakenToInputInMinutes);
    console.log('wpm:', wpm);
    //emit events
    socket.emit('result',{
        wpm : wpm,
        accuracy : 100,
        roomCode : 'dshg34363746c4t'
    });

    startInputTime = null;
    endinputTime = null;
}

// adding event listener on textarea when stating input

myText.addEventListener('input', () => {
    // if(startInputTime == null){
    //     startInputTime = new Date().getTime();
    //     console.log('start time',startInputTime);
    // }

    var quoteArray = document.getElementsByClassName('mySpan');
    // console.log(quoteArray);
    var myTextArray = myText.value.split('');
    var isCorrect = true;
    // console.log(myTextArray);
    // myTextArray.forEach((element )=> {

    //     console.log(element);
    // });
    for (let i in quoteArray) {
        if (myTextArray[i] == null) {
            if(quoteArray[i].classList != undefined){
            // console.log(quoteArray[i].classList);
            quoteArray[i].classList.remove('correct');
            quoteArray[i].classList.remove('incorrect');
            isCorrect = false;
        }
    }
        else if (myTextArray[i] === quoteArray[i].innerText) {
            quoteArray[i].classList.add('correct');
            quoteArray[i].classList.remove('incorrect');
        }
        else{
            // console.log(quoteArray[i].classList);
            if(quoteArray[i].classList != undefined){
                quoteArray[i].classList.remove('correct');
                // if(quoteArray[i].classList.contains("incorrect"))
                quoteArray[i].classList.add('incorrect');
                isCorrect = false;
            }
        }
    }
    if(isCorrect){
        endinputTime = new Date().getTime();
        console.log('end time',endinputTime);
        wpmFunc()
        timeLeft = 6;
        myText.disabled = true;
        textInSmallTag.innerText = "";
        timeLeftSpan.innerText = "";
        myText.value = ""; 
        pera.innerHTML = "";
        hack.style.display = "none";
        // console.log('you typed correct');
    }
})


//listen events
socket.on('result',(myData)=>{
    console.log(myData);
})

// console.log(socket);