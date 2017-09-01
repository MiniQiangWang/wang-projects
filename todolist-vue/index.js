var setLocal = {
    save(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    },
    get(key){
        return JSON.parse(localStorage.getItem(key));
    }
}

var list = setLocal.get('todos') || [];

var vm = new Vue({
    el: "#demo",
    data: {
        list: list,
        todo: '',
        editingTodo:'',
        beforeTodo: '',
        visibility: 'all'
    },
    computed: {
        getChecked: function () {
            return this.list.filter(function (todo) {
                return !todo.checked;
            }).length;
        },
        filterList: function () {
            var filter = {
                all: function (list) {
                    return list;
                },
                unfinish: function (list) {
                    return list.filter(function (item) {
                        return !item.checked;
                    })
                },
                finish: function (list) {
                    return list.filter(function (item) {
                        return item.checked;
                    })
                }
            }
            return filter[this.visibility] ? filter[this.visibility](this.list) : this.list;
        }
    },
    watch: {
        list: {
            handler:function(){
                setLocal.save('todos', this.list);
            },
            deep:true
        }
        
    },
    methods: {
        addTodo: function(){
            //var value = e.target.value;   这是操作dom的思想
            this.list.push({
                title: this.todo,
                checked: false
            }); 
            this.todo = '';
        },

        deleteTodo: function (todo, event) {
            var index = this.list.indexOf(todo);
            this.list.splice(index, 1);
        },

        editTodo: function (todo) {
            this.editingTodo = todo;
            this.beforeTodo = todo.title;
        },

        editedTodo: function () {
            this.editingTodo = '';
        },

        cancelTodo: function (todo) {
            todo.title = this.beforeTodo;
            this.beforeTodo = '';
            this.editingTodo = '';
        }
    },
    directives: {
        focus: {
            update(el, binding) {
                if(binding.value){
                    el.focus();
                }
            }
        }
    }
})

function changeHash () {
    var hash = window.location.hash.slice(1);
    vm.visibility = hash;
}
changeHash();
window.addEventListener('hashchange', changeHash);