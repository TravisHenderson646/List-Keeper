var num = "";
function testerer() {
    num = document.getElementById("fname").value
    console.log(num)
    document.getElementById("demo").innerHTML = num;
}

function save() {
    localStorage.setItem("test", num);
}

function load() {
    num = localStorage.getItem("test");
    document.getElementById("demo").innerHTML = num;
}