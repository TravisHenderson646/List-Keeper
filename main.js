var num = "";
function testerer() {
    num = document.getElementById("fname").value
    console.log(num)
    document.getElementById("demo").innerHTML = num;
}

function save() {
    num = document.getElementById("fname").value
    localStorage.setItem("test", num);
}

function load() {
    num = localStorage.getItem("test");
    document.getElementById("demo").innerHTML = num;
}


// THIS IS JUST FOR A TEST PLZ DELETE
//test 1
//test 2

function replacer(key, value) {
    if(value instanceof Map) {
    return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
    };
    } else {
    return value;
    }
}
function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
        return new Map(value.value);
        }
    }
    return value;
}
// example stringification of maps using reviver and replacer
// const originalValue = [
//     new Map([['a', {
//       b: {
//         c: new Map([['d', 'text']])
//       }
//     }]])
//   ];
// const str = JSON.stringify(originalValue, replacer);
// const newValue = JSON.parse(str, reviver);
// console.log(originalValue, newValue);