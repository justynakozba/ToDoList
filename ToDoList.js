// Global variable PAGE URL
const url = 'http://useo-notes.herokuapp.com/notes/';

/*
* Function check if task is overdue.
*/
function isOverdue(deadline)
{
    var given = new Date(deadline);
    var now = new Date();
    return (given > now);
}

function createEntry(content, noteId, completion, deadline)
{
    //create list entry.
    var li = document.createElement("li");

    // create task title.
    var cont = document.createElement("div");
    cont.className = "content";
    var contText = document.createTextNode(content);
    cont.appendChild(contText);
    li.appendChild(cont);

    //create deadline.
    var timeToEnd = document.createElement("div");
    var timeToEndTxt = document.createTextNode(deadline);

    //validate if task is overdue.
    if(isOverdue(deadline))
    {
        timeToEnd.className = "deadline"
    }
    else
    {
        timeToEnd.className = "overdue"
    }
    timeToEnd.appendChild(timeToEndTxt);
    li.appendChild(timeToEnd);

    //Set Id as list entry attribute.
    li.setAttribute("id", noteId);

    //Set completion as list entry attribute.
    li.setAttribute("completed", completion);
    if(completion)
    {
        li.classList.add("checked");
    }

    //Create checkbox.
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.className = "checkBox";
    li.appendChild(checkBox);

    //Create delete button.
    var deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "deleteBtn";
    li.appendChild(deleteBtn);
    deleteBtn.onclick = function ()
    {
        var record = this.parentElement;
        console.log("removing element with id " + record.id);
        restApi.deleteNote(record.id);
        record.remove();
    }

    //Add entry to list.
    document.getElementById("myToDoList").appendChild(li);
}

/*
    * Function responsible for obtaining all task form server.
    * The task are group by pages, each page contains 5 task.
    * To obtain all task we have to iterate through pages.
*/
function getAllTasks()
{
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function ()
    {
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400)
        {
            console.log("Success: Total pages: "+ data.total_pages);
            for(var i = 1; i <= data.total_pages; i++)
            {
                restApi.getNotesFromPage(i);
            }
        }
        else
        {
            window.alert("Failed with error: " + request.status + ". Failed to get total pages.");
        }
    }
    request.send();

}

/*
 * This function is responsible for removing all elements from list
 * and recreate ToDoList including obtaining data from server.
 * The function was needed cause after we add new element we do not know it's id,
 * so the easiest way was to refresh whole list and obtain all notes once again.
*/
function refreshTodoList()
{
    // Clean task list.
    var list = document.getElementById("myToDoList");
    var entries = list.getElementsByTagName("LI");
    while(entries.length > 0)
    {
        list.removeChild(entries[0]);
    }
    //Create task list.
    getAllTasks();
}

/*
 * Function responsible for adding new element.
*/
function newElement()
{
    var title = document.getElementById("Title").value;
    var deadline = document.getElementById("Deadline").value;
    if(title == "")
    {
        window.alert("Please set task Tittle");
    }
    else if(!isValidDate(deadline))
    {
        window.alert("The deadline format is invalid, Please set date in YYYY-MM-DD format");
    }
    else
    {
        restApi.addNote(title, deadline)
        refreshTodoList();
    }
    document.getElementById("Deadline").value = "";
    document.getElementById("Title").value = "";
}

/*
 * Function responsible for deleting selected task.
 * This could be done better but it is already far after midnight:)
*/
function deleteSelected()
{
    var myNodelist = document.getElementsByTagName("LI");
    var length = myNodelist.length;
    for (var i = 0; i < length;)
    {
        if(myNodelist[i].childNodes[2].checked)
        {
            console.log("Deleting entry with ID" + myNodelist[i].id + " end row: " + i);
            restApi.deleteNote(myNodelist[i].id);
            myNodelist[i].remove();
            length--;
        }
        else
        {
            i++;
        }
    }
}

/*
 * Function responsible for selecting all task.
*/
function selectAll()
{
    var myNodelist = document.getElementsByTagName("LI");
    for(var i = 0; i < myNodelist.length; i++)
    {
        myNodelist[i].childNodes[2].checked=true;
    }
}

/*
 * Function responsible for unselecting all task.
*/
function unselectAll()
{
    var myNodelist = document.getElementsByTagName("LI");
    for(var i = 0; i < myNodelist.length; i++)
    {
        myNodelist[i].childNodes[2].checked=false;
    }
}

/*
 * Function responsible for deadline validation.
*/
function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    if(Number.isNaN(d.getTime())) return false; // Invalid date
    return d.toISOString().slice(0,10) === dateString;
  }


//Create RestAPIRequest class.
let restApi = new RestAPIRequest(url);

//Get all task
getAllTasks();

//Create listener for click action on list entry.
var list = document.querySelector('ul');
list.addEventListener('click', function (ev)
{
    if(ev.target.tagName === 'LI')
    {
        ev.target.classList.toggle('checked');
        completionStatus = false;
        if(ev.target.getAttribute("completed") == "true")
        {
            completionStatus=true;
        }
        restApi.completed(ev.target.id, !completionStatus);
        ev.target.setAttribute("completed", !completionStatus);
    }
}, false);
