/*jshint esversion: 8 */
/*jshint asi: true */
let make = function(payload) {

    console.log("payload: ")
    console.log(payload)
    console.log("j.str payload: ")
    console.log(JSON.stringify(payload))

    return { method: 'get',
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
    getDilbert().then(res=>res.json()).then( (data) => {

        console.log("here")
        console.log(data)

        let imageLink = data.link
        let dilbertImg = document.createElement("img")
        dilbertImg.src = imageLink

        document.getElementById("dilbert").appendChild(dilbertImg)
    })
    
}