
class List {
    constructor(name){
        this.name = name;
        this.list = [];
        this.properties = new Map();
        this.global_properties = [];
    }
}

var path = [];
var lists = JSON.parse(localStorage.getItem('save'), reviver);
var path_view = document.getElementById('path_view');
var list_view = document.getElementById('list_view');
var input_field = document.getElementById('input_field');
if ((!Array.isArray(lists)) || (Array.isArray(lists) ? !typeof lists[0] === 'object' : false)){
    lists = [];
} else {
    refresh_list()
}


input_field.addEventListener('keydown', function (e){
    if (e.key === 'Enter') {
        on_add_pressed();
    }
})

function refresh_list() {
    path_view.innerHTML = '';
    for (let item of get_path_name()) {
        const element = document.createElement('li');
        const node = document.createTextNode(item);
        element.style.margin = '0px';
        element.style.padding = '5px'
        element.appendChild(node);
        path_view.appendChild(element);
    }
    list_view.innerHTML = '';
    for (let [index, name] of get_list_items().entries()) {
        const element = document.createElement('li');
        const node = document.createTextNode(name);
        element.style.margin = '0px';
        element.style.padding = '5px'
        element.addEventListener('click', function() {on_item_tapped(index)});
        element.appendChild(node);
        list_view.appendChild(element);
    }
}

function get_path_name() {
    let path_name = [];
    for (let [i, index] of path.entries()) {
        let slice = path.slice(0, i);
        let list = lists;
        for (let j of slice) {
            list = list[j].list;
        }
        path_name.push(list[index].name)
    }
    return path_name
}
function get_list_items() {
    let items = []
    for (let item of get_list(path)) {
        items.push(item.name);
    }
    return items;
}
function get_list(path) {
    let list = lists;
    for (let index of path) {
        list = list[index].list;
    }
    return list;
}

function on_item_tapped(index) {
    path.push(index);
    refresh_list();
}
function on_back_pressed() {
    path.pop();
    refresh_list();
}
function on_add_pressed() {
    let item = new List(input_field.value);
    if (!get_list_items().includes(item.name)){
        get_list(path).push(item);
        input_field.value = '';
        refresh_list();
    }
    input_field.focus();
}
function on_save_pressed() {
    localStorage.setItem('save', JSON.stringify(lists, replacer));
}
function on_delete_list_pressed() {
    let parent = get_list(path.slice(0, -1));
    parent.splice(path.pop(), 1);
    refresh_list();
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