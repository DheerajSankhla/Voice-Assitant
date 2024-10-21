// all aabout the fucntion 

const imgbtn = document.querySelector('.navbar-icon img')
const chatBox = document.querySelector('.chat-box')

chatBox.style.display ="none"
 function Toggle(){
    imgbtn.src = imgbtn.src.includes('assests/chatbot.svg') ? 'assests/cross.svg': 'assests/chatbot.svg'
    chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
 }


// chat bot 

let promt = document.querySelector('.prompt')
let btn = document.querySelector('.click')
let chatcontainer = document.querySelector('.chat-container')
let userMessage="";

function createChatBox(html , className){
    const div = document.createElement('div')
    div.classList.add(className)
    div.innerHTML = html
    return div;

}

// api url 

let api_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAnIUlQxOPM0JxlWdBbWhElUofOtGV79OA`

  async function genrateApiResponse(aichatbox){
    const textElement = aichatbox.querySelector('.text')
    try{
        const response = await fetch(api_url ,{ 
            method:"POST",
            headers:{'content-Type':"application/json"},
            body:JSON.stringify({
                contents:[{
                    "role":"user",
                    "parts":[{text:userMessage}]
                }]
            })
        })
        const data = await response.json()
        // const airesponse = data?.candidates[0].content.parts[0].text.trim();
        const airesponse = data?.candidates[0]?.content?.parts[0]?.text?.trim();
        if (airesponse) {
            textElement.innerText = airesponse;
        } else {
            throw new Error('No AI response received.');
        }
    } catch(error){
        console.log(error)
        textElement.innerText = "Sorry, I couldn't process the request.";
    }finally{
        aichatbox.querySelector(".loading").style.display="none"
    }
}





   function showloading(){
    const html = `<p class="text"></p>
    <img src="assests/load.gif" class="loading" width="50px"alt="img">
    `
    let aichatbox = createChatBox(html,'ai-chat-box')
   chatcontainer.appendChild(aichatbox)
   genrateApiResponse(aichatbox)
   }


btn.addEventListener('click',()=>{
    
    userMessage=promt.value;
    const html = `<p class="text"></p>`
    let userChatBox = createChatBox(html,'user-chat-box')

    userChatBox.querySelector('.text').innerText=userMessage;
    chatcontainer.appendChild(userChatBox)
    promt.value="";
    setTimeout(showloading , 500)
})

// virtual assistant

let aiimg = document.querySelector('#aibtn')
let speakPage = document.querySelector('.speak-page')
let content = document.querySelector('.content')



// this function use to speak the text when we enter the function and speak wincdow

// function speak(text){
// let text_speak = new  SpeechSynthesisUtterance()  //SpeechSynthesisUtterance() is part of the Web Speech API that enables text-to-speech functionality in web applications.
// text_speak.rate=1;
// text_speak.pitch=1;
// text_speak.volume=1;
// text_speak.lang='hi-GB';
// window.speechSynthesis.speak(text_speak)
// } 
function speak(text) {
    let text_speak = new SpeechSynthesisUtterance();  // Create a new SpeechSynthesisUtterance object
    text_speak.text = text;  // Assign the received text to the SpeechSynthesisUtterance instance
    text_speak.rate = 1;     // Set rate of speech
    text_speak.pitch = 1;    // Set pitch of speech
    text_speak.volume = 1;   // Set volume of speech
    text_speak.lang = 'hi-GB';  // Set the language (Hindi - Great Britain accent)

    window.speechSynthesis.speak(text_speak);  // Use speechSynthesis to speak the text
}
// it is use the when we speak the speak co0nvert into text 

let speechRecognition = window.speechRecognition || window.webkitSpeechRecognition
let recognition = new speechRecognition()
//The onresult() function is commonly used in the Speech Recognition API (Web Speech API) to handle events when speech recognition produces a result. This function is triggered when the API successfully detects speech and converts it into text. You can capture this text and perform further actions with it.
recognition.onresult = (event)=>{
    speakPage.style.display="none"
  let currentIndex = event.resultIndex
  let transcript = event.results[currentIndex][0].transcript
  content.innerText= transcript
  speak(transcript)
  takeCommand(transcript)
}

function takeCommand(message){
   if(message.includes("open")&& message.includes("chat")){
    speak("okay harsha bhabha")
    chatBox.style.display = 'block'
   }else if(message.includes("close")&& message.includes("chat")){
    speak("okay harsha bhabha")
    speak("okay")
     chatBox.style.display = 'none'
   }else {
    console.log("Command not recognized");
  }
}

aiimg.addEventListener('click',()=>{
      recognition.start()
      speakPage.style.display = "flex" // beacuse when we click this button then add flex another display none

})

// microphone function 
let microphone = document.querySelector(".mice");
microphone.addEventListener('click', ()=> {
    handleSpeechToInput();
});

function handleSpeechToInput(){
    let recognitionForInput = new speechRecognition();  // Separate instance for input box
    recognitionForInput.onresult = (event) => {
        let transcript = event.results[0][0].transcript;  // Get recognized text
        promt.value = transcript;  // Set the recognized text into the input box
    };
    recognitionForInput.start();  // Start speech recognition for input
}