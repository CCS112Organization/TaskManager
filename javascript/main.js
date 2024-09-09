let inputTask = document.getElementById("add-taskField");
let addButton = document.getElementById("add-button");
let list = document.getElementById("list-holder");
let formList = document.getElementById("list-form");
let saveButton = document.getElementById("save-button");
let formDetails = document.getElementById("details-form");

// For pressing enter when adding a new task
inputTask.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addToDatabase();
    }
});

// For clicking the add button
addButton.addEventListener('click', function(event) {
    event.preventDefault();
    addToDatabase();
});

formList.addEventListener('submit', function(event) {
    event.preventDefault();
    addToDatabase();
});

// For clicking a specific task inside the list
list.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('delete-button')) {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteToDatabase(event);
        } else {
            console.log('Task deletion canceled.');
        }
        
    }
});

document.addEventListener('mousedown', function(event) {
    let isClickInsideTaskList = formList.contains(event.target) || formDetails.contains(event.target);

    if (!isClickInsideTaskList) {
        clearTaskDetails();
    }
});

function addToDatabase() {
    let taskValue = inputTask.value.trim();
    if (taskValue === '') return;

    let formData = new FormData(formList);

    fetch('contains/addTask.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(taskId => {
        console.log('Success:', taskId);
        searchToDatabase(taskId);
        addTask(taskValue, taskId);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    inputTask.value = '';
}

function addTask(taskValue, taskId) {
    if (taskValue === '') return;
    
    let labelTask = document.createElement('label');
    labelTask.classList.add('task-item');
    labelTask.setAttribute('task-id', taskId);

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');

    let textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    textSpan.textContent = taskValue;

    let delButton = document.createElement('button');
    delButton.textContent = 'Delete';
    delButton.classList.add('delete-button');

    labelTask.appendChild(checkbox);
    labelTask.appendChild(textSpan);
    labelTask.appendChild(delButton);
    
    labelTask.addEventListener('click', function(event) {
        let taskId = labelTask.getAttribute('task-id'); 

        if (event.target !== delButton && event.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
            searchToDatabase(taskId);
            modifyTask(taskId);
        }
    });

    list.appendChild(labelTask);
}

function deleteToDatabase(event) {
    let labelTask = event.target.parentNode;
    let taskId = labelTask.getAttribute('task-id'); 

    fetch('contains/deleteTask.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            id: taskId
        })
    })
    .then(response => response.text())
    .then(data => {
        deleteTask(labelTask);
        clearTaskDetails();
        console.log('Task deleted:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteTask(labelTask) {
    let list = labelTask.parentNode;
    list.removeChild(labelTask);
}


function searchToDatabase(taskId) {
    fetch('contains/searchTask.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            id: taskId
        })
    })
    .then(response => response.json())
    .then(row => {
        displayTask(row);
        console.log('Search:', row);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayTask(row) {
    if (!row) {
        console.error('No task data received');
        return;
    }

    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let dueDate = document.getElementById('due_date');

    title.value = row.title; 
    description.value = row.description || ''; 
    dueDate.value = row.date ? row.date : '';
}

function clearTaskDetails() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let dueDate = document.getElementById('due_date');

    title.value = ''; 
    description.value = ''; 
    dueDate.value = '';
}

function modifyTask(taskId) {
    saveButton.addEventListener('click', function(event) {
        event.preventDefault();
        updateToDatabase(taskId);
    });
    
    formDetails.addEventListener('submit', function(event) {
        event.preventDefault();
        updateToDatabase(taskId);
    });
}

function updateToDatabase(taskId) {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due_date').value;

    fetch('contains/updateTask.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            id: taskId,
            title: title,
            description: description,
            due_date: dueDate
        })
    })
    .then(response => response.json())
    .then(row => {
        console.log('Success:', row);
        updateTask(row);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateTask(row) {
    let labelTask = list.querySelector(`label[task-id="${row.id}"]`);
    if (labelTask) {
        let textSpan = labelTask.querySelector('.task-text');
        if (textSpan) {
            textSpan.textContent = row.title;
        }
    }

}

// For other purpose
function convertToDisplayFormat(dateString) {
    const parts = dateString.split('-');
    
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    
    return month + '/' + day + '/' + year;
}