
function toggleView(collectionName) {

    let collection = document.getElementsByClassName(collectionName);
    console.log(collectionName)
    console.log(collection)

    for (let elem in collection) {
        console.log(elem)
        collection[elem].classList.toggle("state1");
        collection[elem].classList.toggle("state2");
    }
}
