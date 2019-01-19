class RestAPIRequest
{
    constructor(page)
    {
        this.page = page; //Save tha page URL in class.
    }

    /*
     * Method responsible for deleting the note with given note id.
    */
    deleteNote(noteId)
    {
        var request = new XMLHttpRequest();
        request.open('DELETE',  this.page + noteId, true);
        request.onload = function()
        {
            if (request.status >= 200 && request.status < 400)
            {
                console.log("SUCCESS: Note with id: "+ noteId + "deleted!");
            }
            else
            {
                window.alert("Failed with error: " + request.status + ". Failed to delete note with id: "+ noteId);
            }
        }
        request.send();
    }

    /*
     * Method responsible for updating the completion status.
    */
    completed(noteId, isCompleted)
    {
        var completion;
        if(isCompleted)
        {
            completion = "completed";
        }
        else
        {
            completion = "uncompleted";
        }

        var requestTXT = this.page + noteId + '/' + completion;
        var request = new XMLHttpRequest();
        request.open('PUT', requestTXT, true);
        request.onload = function()
        {
            if (request.status >= 200 && request.status < 400)
            {
                console.log("Note with id "+ noteId + " marked as completed: " + isCompleted);
            }
            else
            {
                window.alert("Failed with error: " + request.status + ". Failed to mark note with id: "+ noteId + " as completed: " + isCompleted);
            }
        }
        request.send();
    }

    /*
     * Method responsible for adding new note.
     * Method takes to parameters - task name and deadline.
     *
     * I found here a following problem:
     * The id which is set in the data struct is not respected.
     * The server create note with unique id and do the id counting on its own.
     * It also do not return the assignee id when the new notes is posted.
     * After creating the note we cannot perform any operation on it,
     * cause the id of message is unknown and is needed to create a query.
     * Because of that I was force to update the all list each time when I add new note.
    */
    addNote(taskName, timeLimit)
    {
        var now = new Date();
        var data = { note:
                    {   id: 0, //Id is not respected anyway so was hardcoded to 0.
                        content: taskName,
                        deadline: timeLimit,
                        completed: false,
                        created_at: now.toLocaleDateString(),
                        updated_at: now.toLocaleDateString()
                    }
                };

        var json =  JSON.stringify(data)

        var request = new XMLHttpRequest();
        request.open('POST', this.page)
        request.onload = function()
        {
            // Begin accessing JSON data here
            if (request.status >= 200 && request.status < 400)
            {
                console.log("Success, note added!");
            }
            else
            {
                window.alert("Failed with error: " + request.status + ". Failed to add note with Title: " + taskName + " and deadline: " + timeLimit);
            }
        }
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        request.send(json);
    }

    /*
     * Method responsible for getting all notes from given page
    */
    getNotesFromPage(page)
    {
        var getPage = new XMLHttpRequest();
        getPage.open('GET', this.page + "?page=" + page, true);
        getPage.onload = function()
        {
            var data = JSON.parse(this.response);
            if (getPage.status >= 200 && getPage.status < 400)
            {
                data.notes.forEach(note =>
                {
                    console.log("Create new note with id: " + note.id + "and Tittle: " + note.content);
                    createEntry(note.content, note.id, note.completed, note.deadline);
                });
            }
            else
            {
                console.log("Failed to gate page " + page)
                window.alert("Failed with error: " + request.status + ". Failed to get page with pageID " + page);
            }
        }
        getPage.send();
    }
}