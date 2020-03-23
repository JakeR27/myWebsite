
// function toggleView(collectionName) {

//     let collection = document.getElementsByClassName(collectionName);
//     console.log(collectionName)
//     console.log(collection)

//     for (let elem in collection) {
//         console.log(elem)
//         collection[elem].classList.toggle("state1");
//         collection[elem].classList.toggle("state2");

//         if (collection[elem].type == "submit") {
//             collection[elem].onclick = () => {
//                 let theText = collection[elem -1].text
//                 let ctx = collection[2].getContext("2d")
//                 ctx.font = "48px serif"
//                 ctx.fillText("Hello World", 100,10)
//             }
//         }
//         if (collection[elem].type == "reset") {
//             collection[elem].onclick = () => {
//                 let ctx = collection[2].getContext("2d")
//                 ctx.clearRect(0,0,collection[elem].width, collection[elem].height)
//             }
//         }
        
//     }
//     return false
// }

function setPlayer(teamNumber, playerNumber) {
    let textToSearchForCanvas = `team${teamNumber}player${playerNumber}_canvas`
    let canvas = document.getElementById(textToSearchForCanvas)
    console.log(canvas, textToSearchForCanvas)
    let c = canvas.getContext('2d')

    let textToSearchForTextbox = `team${teamNumber}player${playerNumber}_text`
    let textbox = document.getElementById(textToSearchForTextbox)
    let t = textbox.value

    c.font = "48px serif"

    c.fillStyle = "white"
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.fillStyle = "black"
    c.fillText(t, 0, canvas.height / 4)

}

function setAllCanvasBgToWhite() {
    for (i = 1; i == 2; i++) {
        for (j = 1; i == 5; j++) {
            console.log(i, j)
            let textToSearchForCanvas = `team${i}player${j}_canvas`
            let canvas = document.getElementById(textToSearchForCanvas)
            console.log(canvas, textToSearchForCanvas)
            let c = canvas.getContext('2d')
            c.fillStyle = "white"
            c.fillRect(0, 0, canvas.width, canvas.height)
        }
    }
    
}

setAllCanvasBgToWhite()
