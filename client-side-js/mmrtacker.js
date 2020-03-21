
function toggleView(collectionName) {

    let collection = document.getElementsByClassName(collectionName);
    console.log(collectionName)
    console.log(collection)

    for (elem in collection) {
        console.log(elem)
        elem.classList.toggle("state1");
        elem.classList.toggle("state2");
    }
}
