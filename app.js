
//User interface controller for storing HTML elements into variables
const UI = (function(){
    // Private
    const taskInput = document.getElementById("add-task");
    const newTaskBtn = document.getElementById("new-task-btn");
    const tableBody = document.querySelector("#task-list-table tbody");

    function createRow(task) {
        //Adds at the end of the body of the table; '=' would have replaced it
        tableBody.innerHTML += `
        <tr ${task.status ? "class='alert-success'" : ""}>
          <th scope="row">
            <input type="checkbox" id="complete-${task.id}" ${task.status ? "checked" : ""}>
          </th>
          <td>${task.title}</td>
          <td>
            <div class="buttons">
             <button data-id="${task.id}" data-control="Edit" data-toggle="modal" data-target="#taskModal" type="button" class="btn btn-primary btn-sm">Edit</button>
             <button data-id="${task.id}" data-control="delete" type="button" class="btn btn-danger btn-sm">Delete</button>
            </div>
          </td>
        </tr>
        `;
    }

    function clearItems() {
        tableBody.innerHTML = "";
    }

    function createRows(items) {
    //Clear the table before rebuilding it; to do: update just the changed item
        clearItems();
        items.forEach(createRow);
    }

    // Public
    return {
        taskInput,
        tableBody,
        createRow,
        createRows
    }
})();

//Local storage
const Storage = (function(){
    // Private
    function setItems(items) {
        localStorage.setItem("todo-app", JSON.stringify(items));
    }

    function getItems() {
        if(localStorage.getItem("todo-app")) {
            return JSON.parse(localStorage.getItem("todo-app"));
        } else {
            return [];
        }
    }
    // Public
    return {
        setItems,
        getItems
    }
})();

//Item for storing tasks
const Item = (function(){
    // Private
    const items = Storage.getItems();

    function Task(title) {
        this.id =  items.length ? (items[items.length-1].id) +1 : 1;
        this.title = title;
        this.status = false;
    }

    function getItemById(id) {

        let found;
        items.forEach(function(item) {
            if(item.id === id) {
                found = item;
            }
        });
        return found;
    }

    function updateItem(id, title) {
        items.forEach(function(item) {
            if(item.id === id) {
                item.title = title;
            }
        });
    }

    function deleteItem(id) {

        let found;

        items.forEach(function(item, index) {
            if(item.id === id) {
                found = index;
            }
        });

        items.splice(found, 1);
    }

    function addTask(item) {
        const taskItem = new Task(item);
        UI.createRow(taskItem);
        items.push(taskItem);
    }

    function getItems() {
        return items;
    }

    function changeStatus(id, status) {
        items.forEach(function(item) {
            if(item.id === id) {
                item.status = status;
            }
        });
    }
    // Public
    return {
        addTask,
        getItems,
        getItemById,
        updateItem,
        deleteItem,
        changeStatus
    }
})();



//App controller for event listeners
const App = (function(){

    let id;
    // Public
    return {

        init: function() {

        $('#task-form').submit(function(event) {

            if(UI.taskInput.value) {
                //Check the id:
                if(id) {
                    //Update item if there is already an id
                        Item.updateItem(id, UI.taskInput.value);
                        UI.createRows(Item.getItems());
                        id = null;
                } else {
                    //Create item if there isn't an id - it means it's a new item
                        Item.addTask(UI.taskInput.value);
                }
                $('#taskModal').modal('hide');
                UI.taskInput.value= "";
                id = null;
                Storage.setItems(Item.getItems());
            }
        });

        $('#taskModal').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget) // Button that triggered the modal
          var recipient = button.data('control') // Extract info from data-control attribute
          var modal = $(this)
          modal.find('.modal-title').text(recipient + ' task')
        })

        //Clears value of field when the modal has finished being hidden from the user
        $('#taskModal').on('hidden.bs.modal', function(event) {
            UI.taskInput.value= "";
        });

        UI.tableBody.addEventListener("click", function(event){
            if(event.target.getAttribute("data-control") === "Edit" ) {
                //$('#taskModal').modal('show');

                id = parseInt(event.target.getAttribute("data-id"));

                UI.taskInput.value= Item.getItemById(id).title;
                Storage.setItems(Item.getItems());


            }

            if(event.target.getAttribute("data-control") === "delete" ) {

                id = parseInt(event.target.getAttribute("data-id"));

                Item.deleteItem(id);
                UI.createRows(Item.getItems());
                id = null;
                Storage.setItems(Item.getItems());

            }

            if(event.target.getAttribute("type") === "checkbox" ) {

                id = parseInt(event.target.id.split("-")[1]);

                Item.changeStatus(id, event.target.checked);
                UI.createRows(Item.getItems());
                id = null;
                Storage.setItems(Item.getItems());


            }

            window.addEventListener("load", function() {
                Storage.setItems(Item.getItems());

            })

        });

        UI.createRows(Item.getItems());
        }

    }
})();

//Starting App
App.init();
