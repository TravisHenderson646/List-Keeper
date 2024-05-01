var num = 0;
function testerer() {
    num += 1
    document.getElementById("demo").innerHTML = num;
}

function save() {
    localStorage.setItem("test", num.toString());
}

function load() {
    num = parseInt(localStorage.getItem("test"));
    document.getElementById("demo").innerHTML = num;
}