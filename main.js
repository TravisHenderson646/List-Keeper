
const map1 = new Map();
const map2 = new Map();
const map3 = new Map();
const map4 = new Map();
map1.set('a', map2)
map1.set('b', map3)
map1.set('c', map4)
map2.set('set of words', 'word')
map2.set('begal', 'nonstence')
map2.set('asdf', 'asdf')
map3.set('a', 'tester')
map4.set('a', 'aaaa')

// for (let key of map2.keys()) {
//     const paragraph = document.createElement('p')
//     const node = document.createTextNode(key)
//     paragraph.appendChild(node)
//     document.getElementById("demo").appendChild(paragraph)
// }



var list = new Map();
var list_view = document.getElementById("list_view");
var input_field = document.getElementById("input_field");
input_field.addEventListener('keydown', function (e){
    if (e.key === 'Enter') {
        clicked_add()
    }
})

function clicked_add() {
    let item = input_field.value
    if (!list.has(item)){
        list.set(item, new Map())
        input_field.value = ''
        list_view.innerHTML = '';
        for (let key of list.keys()) {
            const paragraph = document.createElement('p')
            const node = document.createTextNode(key)
            paragraph.appendChild(node)
            list_view.appendChild(paragraph)
        }
    }
}





// function save() {
//     num = document.getElementById("user_input").value
//     localStorage.setItem("test", num);
// }
// function load() {
//     num = localStorage.getItem("test");
//     document.getElementById("demo").innerHTML = num;
// }
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