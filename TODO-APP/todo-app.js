(function () {
    let taskId = 0;
    let tasks = [];

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Enter new task';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Add task';
        button.setAttribute('disabled', 'disabled');

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function findBiggestNumber(arr) {
        let maxId = arr.reduce((max, item) => (item.id > max ? item.id : max), 0);
        taskId = maxId + 1;
        return taskId;
    }

    function createTodoItem(arr, name, done = false) {
        let task = {
            id: findBiggestNumber(arr),
            taskName: name,
            done: done,
        }

        let item = document.createElement('li');
        // put button in element that will show them in nice way
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');


        //create styles for list elements, and put buttons to the right side using flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        // add task name as text, that is equal to input value (later we will define this in function argument)
        item.textContent = task.taskName;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Done';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Delete';

        //put buttons in one element, so they are grouped in one block
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
            task
        };
    }

    function createTodoApp(container, title = 'List of tasks', listName) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // toggle enable or disabled state for from button
        function toggleFormButton() {
            todoItemForm.button.disabled = todoItemForm.input.value === '';
        };

        toggleFormButton();
        todoItemForm.input.addEventListener('input', toggleFormButton);

        function toLocalStorage() {
            let tasksSerialized = JSON.stringify(tasks);
            localStorage.setItem(listName, tasksSerialized);
        }

        function retrieveFromLocalStorage() {
            let tasksString = localStorage.getItem(listName);
            tasks = tasksString ? JSON.parse(tasksString) : [];
        }

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();

            //check if something was entered in form
            if (!todoItemForm.input.value) {
                return;
            }

            // create new task with name of input value
            let todoItem = createTodoItem(tasks, todoItemForm.input.value);
            viewAllTasks();

            //add event listner for buttons
            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                todoItem.task.done = !todoItem.task.done; // Toggle the 'done' state in the tasks array
                toLocalStorage(); // Save the updated tasks array to local storage;
                viewAllTasks();
            });

            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Are you sure?')) {
                    todoItem.item.remove();
                    let indexOfDeleted = tasks.findIndex(t => t.id === todoItem.task.id);
                    tasks.splice(indexOfDeleted, 1);
                    viewAllTasks();
                    toLocalStorage();
                }
            });

            tasks.push(todoItem.task); // Store the task object


            todoList.append(todoItem.item); // add new task with the name of input value 


            todoItemForm.input.value = ''; // clear the input value

            toggleFormButton();//disable the button
            toLocalStorage();
        });

        // recreate each task that is stored in local storage
        function addTaskToList(task) {
            let todoItem = createTodoItem(tasks, task.taskName, task.done);
            if (task.done === true) {
                todoItem.item.classList.add('list-group-item-success');
            } else {
                todoItem.item.classList.remove('list-group-item-success');
            }

            function updateTaskDoneStatus() {
                todoItem.item.classList.toggle('list-group-item-success');
                todoItem.task.done = !todoItem.task.done; // Toggle the 'done' state in the tasks array
                toLocalStorage(); // Save the updated tasks array to local storage
                viewAllTasks();
            }

            todoItem.doneButton.addEventListener('click', function () {
                updateTaskDoneStatus(todoItem);
            });

            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Are you sure?')) {
                    todoItem.item.remove();
                    let indexOfDeleted = tasks.findIndex(t => t.id === todoItem.task.id);
                    tasks.splice(indexOfDeleted, 1);
                    toLocalStorage();
                }
            });
            todoList.append(todoItem.item);
        }

        retrieveFromLocalStorage();

        function populateList() {
            tasks.forEach(t => {
                addTaskToList(t);
            });
        }

        populateList();
    }

    // small fucntion to display all tasks in array
    function viewAllTasks() {
        console.log(tasks);
    };


    window.createTodoApp = createTodoApp;
})();

