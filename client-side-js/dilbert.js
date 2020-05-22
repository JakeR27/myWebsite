/*jshint esversion: 8 */
/*jshint asi: true */
let make = function(payload) {

    console.log("payload: ")
    console.log(payload)
    console.log("j.str payload: ")
    console.log(JSON.stringify(payload))

    return { method: 'get',
             credentials: 'include',
             headers: { 'Accept': 'application/json',
                  'Content-Type': 'application/json' },
             body: JSON.stringify(payload) 
            };
}

getDilbert = async function(payload) {
    const response = await fetch("https://dilbert-api.glitch.me/json", make(payload))
    console.log(response)
    return response
}

window.onload = function() {
    getDilbert().then( (data) => {
        let imageLink = data.link
        let dilbertImg = document.createElement("img")
        dilbertImg.src = imageLink

        document.getElementById("dilbert").appendChild(dilbertImg)
    })
    
}