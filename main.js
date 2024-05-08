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

if (!lists){
    lists = new Map();
} else {
    refresh_list()
}
input_field.addEventListener('keydown', function (e){
    if (e.key === 'Enter') {
        on_add_clicked();
    }
})

function refresh_list() {
    path_view.innerHTML = '';
    for (let item of path) {
        const element = document.createElement('li');
        const node = document.createTextNode(item);
        element.style.margin = '0px';
        element.style.padding = '5px'
        element.appendChild(node);
        path_view.appendChild(element);
    }
    list_view.innerHTML = '';
    for (let key of get_list().keys()) {
        const element = document.createElement('li');
        const node = document.createTextNode(key);
        element.style.margin = '0px';
        element.style.padding = '5px'
        element.addEventListener('click', function() {on_item_clicked(element)})
        element.appendChild(node);
        list_view.appendChild(element);
    }
}

function get_list() {
    let _list = lists
    for (let branch of path) {
        _list = _list.get(branch)
    }
    return _list
}

function on_item_clicked(item) {
    path.push(item.textContent)
    refresh_list()
}
function on_back_clicked() {
    path.pop()
    refresh_list()
}
function on_add_clicked() {
    let item = input_field.value;
    let list = get_list()
    if (!list.has(item)){
        list.set(item, new Map());
        input_field.value = '';
        refresh_list();
    }
    input_field.focus()
}
function on_save_clicked() {
    localStorage.setItem('save', JSON.stringify(lists, replacer));
}
function on_delete_list_clicked() {
    let parent = lists
    for (let branch of path.slice(0, -1)) {
        parent = parent.get(branch)
    }
    parent.delete(path.at(-1))
    path = path.slice(0, -1)
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