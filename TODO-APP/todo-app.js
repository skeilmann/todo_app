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

    function findBiggestNumber(idArr) {
        // The reduce method iterates through the tasks array.
        // 'max' represents the accumulator, and 'item' is the current element in the array.
        let maxId = idArr.reduce((max, item) => (item.id > max ? item.id : max), 0);
        // It returns the largest id found plus 1 to ensure uniqueness for a new task.
        taskId = maxId + 1;
        return taskId;
    }

    function toLocalStorage(listName) {
        let tasksSerialized = JSON.stringify(tasks);
        localStorage.setItem(listName, tasksSerialized);
    }

    function createTodoItem(idArr, name, done = false) {
        let task = {
            id: findBiggestNumber(idArr),
            taskName: name,
            done: done,
        }

        let item = document.createElement('li');
        // create elemts todo list item
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

        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success');
            task.done = !task.done; // Toggle the 'done' state in the tasks array
            toLocalStorage(task); // Save the updated tasks array to local storage;
            viewAllTasks();
        });

        deleteButton.addEventListener('click', function () {
            if (confirm('Are you sure?')) {
                item.remove();
                let indexOfDeleted = tasks.findIndex(t => t.id === task.id);
                tasks.splice(indexOfDeleted, 1);
                viewAllTasks();
                toLocalStorage();
            }
        });

        return {
            item,
            doneButton,
            deleteButton,
            task
        };
    }


    function retrieveFromLocalStorage(listName) {
        let tasksString = localStorage.getItem(listName);
        tasks = tasksString ? JSON.parse(tasksString) : []; //if tasksString is not an empty or falsy string, it will attempt to parse it into an array.
        return tasks
    }

    tasks = retrieveFromLocalStorage(listName);

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



        function renderAllTasks() {
            todoList.innerHTML = ''; // Clear the current todoList to prevent duplicates

            tasks.forEach((t) => {
                let todoItem = createTodoItem(tasks, t.taskName, t.done);
                todoList.append(todoItem.item);
                if (t.done) {
                    todoItem.item.classList.add('list-group-item-success');
                }
            });
        }
        renderAllTasks();


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

            tasks.push(todoItem.task); // Store the task object


            todoList.append(todoItem.item); // add new task with the name of input value 


            todoItemForm.input.value = ''; // clear the input value

            toggleFormButton();//disable the button
            toLocalStorage();
        });
    }

    // small fucntion to display all tasks in array
    function viewAllTasks() {
        console.log(tasks);
    };


    window.createTodoApp = createTodoApp;
})();

