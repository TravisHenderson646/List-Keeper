var list_view = document.getElementById("list_view");
var input_field = document.getElementById("input_field");
var list = JSON.parse(localStorage.getItem('save'), reviver);
if (!list){
    list = new Map();
} else {
    refresh_list()
}
input_field.addEventListener('keydown', function (e){
    if (e.key === 'Enter') {
        on_add_clicked();
    }
})


function refresh_list() {
    list_view.innerHTML = '';
    for (let key of list.keys()) {
        const paragraph = document.createElement('p');
        const node = document.createTextNode(key);
        paragraph.style.marginTop = '0px';
        paragraph.style.marginBottom = '0px';
        paragraph.appendChild(node);
        list_view.appendChild(paragraph);
    }
}

function on_add_clicked() {
    let item = input_field.value;
    if (!list.has(item)){
        list.set(item, new Map());
        input_field.value = '';
        refresh_list();
    }
}
function on_save_clicked() {
    localStorage.setItem("save", JSON.stringify(list, replacer));
}
function on_clear_clicked() {
    list.clear()
    refresh_list()
}


function replacer(key, value) {
    // Use with reviver to stringify maps
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
    // Use with replacer to stringify maps
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