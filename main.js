var superlist_view = document.getElementById("superlist_view");
var list_view = document.getElementById("list_view");
var input_field = document.getElementById("input_field");
var superlist = JSON.parse(localStorage.getItem('save'), reviver);
var current_list = null
if (!superlist){
    superlist = new Map();
} else {
    refresh_list()
}
input_field.addEventListener('keydown', function (e){
    if (e.key === 'Enter') {
        on_add_clicked();
    }
})

function refresh_list() {
    if (current_list) {
        list_view.innerHTML = '';
        for (let key of current_list.keys()) {
            const item = document.createElement('li');
            const node = document.createTextNode(key);
            item.style.margin = '0px';
            item.style.padding = '5px'
            item.appendChild(node);
            list_view.appendChild(item);
        }
    } else {
        superlist_view.innerHTML = '';
        for (let key of superlist.keys()) {
            const item = document.createElement('li');
            const node = document.createTextNode(key);
            item.style.margin = '0px';
            item.style.padding = '5px'
            item.addEventListener('click', function() {on_item_clicked(item)})
            item.appendChild(node);
            superlist_view.appendChild(item);
        }
    }
}

function on_item_clicked(item) {
    console.log(item.textContent)
    current_list = superlist.get(item.textContent)
    console.log(current_list)
    refresh_list()
}

function on_add_clicked() {
    let item = input_field.value;
    if (current_list){
        if (!current_list.has(item)){
            current_list.set(item, new Map());
            input_field.value = '';
            refresh_list();
        }
    } else {
        if (!superlist.has(item)){
            superlist.set(item, new Map());
            input_field.value = '';
            refresh_list();
        }
    }
}
function on_save_clicked() {
    localStorage.setItem("save", JSON.stringify(superlist, replacer));
}
function on_clear_clicked() {
    superlist.clear()
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