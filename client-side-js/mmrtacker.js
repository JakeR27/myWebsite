
function toggleView(collectionName) {

    let collection = document.getElementsByClassName(`${collectionName}`);

    for (elem in collection) {
        elem.classList.toggle("state1");
        elem.classList.toggle("state2");
    }
}
