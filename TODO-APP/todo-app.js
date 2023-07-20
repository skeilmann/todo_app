(function () {
    let taskId = 0;
    let tasks = [];
    let storage = window.localStorage;

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

    function createTodoItem(id, name) {
        let task = {
            id: id,
            taskName: name,
            done: false,
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

        function storageAvailable(type) {
            try {
                var storage = window[type],
                    x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch (e) {
                return false;
            }
        }

        function getLocalStorageKey() {
            return 'tasks_' + listName;
        }

        function addToLocalStorage(task) {
            if (storageAvailable('localStorage')) {
                console.log('Yippee! We can use localStorage awesomeness');
                let tasksString = localStorage.getItem(getLocalStorageKey());
                let tasksArray = tasksString ? JSON.parse(tasksString) : [];
                tasksArray.push(task);
                localStorage.setItem(getLocalStorageKey(), JSON.stringify(tasksArray));
            }
            else {
                console.log('Too bad, no localStorage for us');
            }
        }

        function retrieveFromLocalSorage() {
            if (storageAvailable('localStorage')) {
                let tasksString = localStorage.getItem(getLocalStorageKey());
                tasks = tasksString ? JSON.parse(tasksString) : [];
                taskId = tasks.length;
            } else {
                console.log('Too bad, no localStorage for us');
            }
        }

        // toggle enable or disabled state for from button
        function toggleFormButton() {
            todoItemForm.button.disabled = todoItemForm.input.value === '';
        };
        toggleFormButton();
        todoItemForm.input.addEventListener('input', toggleFormButton);
        retrieveFromLocalSorage(); // do i really need this?


        // function that add to page list of tasks from local storage
        function populateTodoList() {
            todoList.innerHTML = ''; // Clear the list to avoid duplicates

            tasks.forEach(task => {
                let todoItem = createTodoItem(task.id, task.taskName);

                todoItem.doneButton.addEventListener('click', function () {
                    todoItem.item.classList.toggle('list-group-item-success'); // toggle the class that color the itme in green
                    task.done = !task.done; // Toggle the 'done' state of tasks in array
                    addToLocalStorage(); // Update local storage when 'Done' button is clicked
                });

                todoItem.deleteButton.addEventListener('click', function () {
                    if (confirm('Are you sure?')) {
                        todoItem.item.remove();
                        const index = tasks.findIndex(t => t.id === task.id);
                        tasks.splice(index, 1);
                        localStorage.setItem('tasks', JSON.stringify(tasks)); // Update local storage
                        viewAllTasks();
                    }
                });

                todoList.append(todoItem.item);
            });
        }

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();

            //check if something was entered in form
            if (!todoItemForm.input.value) {
                return;
            }

            taskId++;
            viewAllTasks();
            // create new task with name of input value
            let todoItem = createTodoItem(taskId, todoItemForm.input.value);
            addToLocalStorage(todoItem.task); // Store task in local storage

            //add event listner for buttons
            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                todoItem.task.done = !todoItem.task.done; // Toggle the 'done' state
                viewAllTasks();
                addToLocalStorage(todoItem.task); // Store task in local storage
            });

            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Are yu sure?')) {
                    todoItem.item.remove();
                    const index = tasks.findIndex(task => task.id === todoItem.task.id);
                    tasks.splice(index, 1);
                    localStorage.setItem(getLocalStorageKey(), JSON.stringify(tasks)); // Update local storage
                    viewAllTasks();
                }
            });

            tasks.push(todoItem.task); // Store the task object


            todoList.append(todoItem.item); // add new task with the name of input value 


            todoItemForm.input.value = ''; // clear the input value

            toggleFormButton();//disable the button
        });
        populateTodoList();

    }



    // small fucntion to display all task as aray when later call the function
    function viewAllTasks() {
        console.log(tasks);
    }

    window.createTodoApp = createTodoApp;
    window.viewAllTasks = viewAllTasks;
})();

