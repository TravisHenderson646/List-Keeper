class List {
    constructor(name){
        this.name = name;
        this.list = [];
        this.properties = new Map();
        this.global_properties = [];
    }
}

const path = [];
var lists = JSON.parse(localStorage.getItem('save'), reviver);
const path_view = document.getElementById('path_view');
const list_view = document.getElementById('list_view');
const input_field = document.getElementById('input_field');
const import_field = document.getElementById('import_field');
let dragged_element = null;

if ((!Array.isArray(lists)) || (Array.isArray(lists) ? !typeof lists[0] === 'object' : false)){
    lists = [];
} else {
    refresh_list();
}

input_field.addEventListener('keydown', function (e){
    if (e.key === 'Enter') {
        on_add_pressed();
    }
})


function refresh_list() {
    // Construct path view
    path_view.innerHTML = '';
    for (let item of get_path_name()) {
        const element = document.createElement('li');
        const node = document.createTextNode(item);
        element.style.margin = '0px';
        element.style.padding = '5px'
        element.appendChild(node);
        path_view.appendChild(element);
    }
    // Construct list view
    list_view.innerHTML = '';
    for (let [index, name] of get_list_items().entries()) {
        const element = document.createElement('li');
        const node = document.createTextNode(name);
        element.style.margin = '0px';
        element.style.padding = '5px'
        element.addEventListener('click', function() {on_item_tapped(index)});
        element.addEventListener('dragstart', drag_start);
        element.addEventListener('dragover', drag_over);
        element.addEventListener('dragend', function() {drag_end(index)});
        element.draggable = true;
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

function drag_over(e) {
    console.log(is_after(dragged_element, e.target))
    if (is_after(dragged_element, e.target)) {
        e.target.parentNode.insertBefore(dragged_element, e.target);
    } else {
        e.target.parentNode.insertBefore(dragged_element, e.target.nextSibling);
    }
}

function drag_end(fromIndex) {
    // Adjust 'lists' to reflect change
    let toIndex = Array.from(dragged_element.parentNode.children).indexOf(dragged_element);
    let movedItem = get_list(path).splice(fromIndex, 1)[0];
    get_list(path).splice(toIndex, 0, movedItem);

    dragged_element = null;
    refresh_list();
}

function drag_start(e) {
    e.dataTransfer.effectAllowed = 'move';
    dragged_element = e.target;
    e.dataTransfer.setData('text/plain', dragged_element.textContent)
}

function is_after(el1, el2) {
    let cur;
    if (el2.parentNode === el1.parentNode) {
        for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
            if (cur === el2) return true;
        }
    }
    return false;
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
    let name = input_field.value.replace(/^\s+/, '')
    let item = new List(name);
    if (!get_list_items().includes(item.name) && name){
        get_list(path).push(item);
        input_field.value = '';
        refresh_list();
        on_save_pressed();
    }
    input_field.focus();
}
function on_save_pressed() {
    localStorage.setItem('save', JSON.stringify(lists, replacer));
}
function on_delete_list_pressed() {
    if (path.length == 0) {
        return;
    }
    let parent = get_list(path.slice(0, -1));
    parent.splice(path.pop(), 1);
    refresh_list();
}
function on_import_list_pressed() {
    let names = import_field.value.split("\n");
    import_field.value = '';
    for (let name of names) {
        let trimmed_name = name.replace(/^[\t\- ]+/, '')
        let item = new List(trimmed_name);
        if (!get_list_items().includes(item.name) && trimmed_name){
            get_list(path).push(item);
            refresh_list();
            on_save_pressed();
        }
    }

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
