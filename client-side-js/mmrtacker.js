
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
    let c = canvas.getContext('2d')

    let textToSearchForTextbox = `team${teamNumber}player${playerNumber}_text`
    let textbox = document.getElementById(textToSearchForTextbox)
    let t = textbox.value

    c.font = "48px serif"
    c.fillText(t, 0, canvas.height / 6)

}