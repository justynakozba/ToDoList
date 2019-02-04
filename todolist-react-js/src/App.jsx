import React, { Component } from "react";
import "./App.css";
import Countdown from "./Countdown";
import EditEvent from "./EditEvent";
import axios from "axios";
import { join } from "path";

const url = "http://useo-notes.herokuapp.com/notes/";
class App extends Component {
  //constructor() {
  //super();
  state = {
    now: {
      deadline: new Date().getDate() //zmienic na currenttime
    },
    totalPages: -1,

    notes: [],
    note: {
      id: -1,
      content: "",
      completed: false,
      deadline: "",
      created_at: "",
      updated_at: ""
    }
  };

  //this.handleEditEvent = this.handleEditEvent.bind(this);
  //this.handleSaveEvent = this.handleSaveEvent.bind(this);
  //this.handleRemoveEvent = this.handleRemoveEvent.bind(this);
  //this.handleEditInit = this.handleEditInit.bind(this);
  //this.handleEditCancel = this.handleEditCancel.bind(this);
  //}

  componentDidMount() {
    axios.get(url).then(res => {
      this.setState({ totalPages: res.data.total_pages });
      console.log(" in axios " + res.data.total_pages);
      const array = [];
      for (let i = 1; i <= res.data.total_pages; i++) {
        axios.get(url + "?page=" + i).then(res => {
          res.data.notes.forEach(note => {
            //this.state.notes.push(note);
            console.log("status : " + note.completed);
            // Why I have to force change state here?
            //this.setState({ state: this.state });
            array.push(note);
          });
          this.setState({ notes: array });
        });
      }
    });
  }

  handleEditEvent(val) {
    this.setState(prevState => {
      return {
        note: Object.assign(prevState.note, val)
      };
    });
  }

  addNoteToServer(taskName, deadline) {
    axios
      .post(url, {
        note: {
          id: 0, //Id is not respected anyway so was hardcoded to 0.
          content: taskName,
          deadline: deadline,
          completed: false,
          created_at: new Date().toLocaleDateString(),
          updated_at: new Date().toLocaleDateString()
        }
      })
      .then(res => {
        console.log(
          "Adding task - " + taskName + " with result" + res.statusText
        );
      });
  }

  updateCompletionOnServer(noteId, completion) {
    console.log("update on a server attempt" + url + noteId + "/" + completion);
    axios.put(url + noteId + "/" + completion).then(res => {
      console.log(
        "Changing completion for note: " +
          noteId +
          "  end up with result" +
          res.statusText
      );
    });
  }
  handleSaveEvent() {
    this.setState(prevState => {
      const editedNoteExist = prevState.notes.find(
        nt => nt.id === prevState.note.id
      );

      let updatedNotes;
      if (editedNoteExist) {
        updatedNotes = prevState.notes.map(nt => {
          if (nt.id === prevState.note.id) return prevState.note;
          else return nt;
        });
      } else {
        updatedNotes = [...prevState.notes, prevState.note];
        this.addNoteToServer(prevState.note.content, prevState.note.deadline);
      }

      return {
        notes: updatedNotes,
        note: {
          id: 0,
          content: "",
          deadline: "",
          completed: false,
          created_at: "",
          updated_at: ""
        }
      };
    });
  }

  handleRemoveEvent(id) {
    this.setState(
      prevState => ({
        notes: prevState.notes.filter(el => el.id !== id)
      }),
      () => localStorage.setItem("notes", JSON.stringify(this.state.notes))
    );
    axios.delete(url + id).then(res => {
      console.log(
        "remove event with id " + id + "with status " + res.statusText
      );
    });
  }

  handleEditInit(id) {
    this.setState(prevState => ({
      note: { ...prevState.notes.find(el => el.id === id) } // object spread - stworzenie nie referencji do obiektu a tworzenie nowego obiektu
    }));
  }

  handleEditCancel() {
    this.setState({
      note: {
        id: -1,
        content: "",
        deadline: "",
        completed: false,
        created_at: "",
        updated_at: ""
      }
    });
  }

  handleCheckedEvent(id) {
    this.setState(prevState => {
      prevState.notes.find(nt => {
        if (nt.id === id) {
          if (!nt.completed) {
            nt.completed = true;
            this.updateCompletionOnServer(nt.id, "completed");
            console.log("ukonczono task " + nt.completed);
          } else {
            nt.completed = false;
            this.updateCompletionOnServer(nt.id, "uncompleted");
            console.log("nieukonczone task " + nt.completed);
          }
        }
      });
    });
  }
  render() {
    console.log("this is my render function !");
    const n = this.state.notes.map(nt => {
      return (
        <Countdown
          key={nt.id}
          id={nt.id}
          content={nt.content}
          deadline={nt.deadline}
          onRemove={id => this.handleRemoveEvent(id)}
          onEditInit={id => this.handleEditInit(id)}
          onChecked={id => this.handleCheckedEvent(id)}
        />
      );
    });

    return (
      <div className="app">
        {n}
        <EditEvent
          content={this.state.note.content}
          deadline={this.state.note.deadline}
          onInputChange={val => this.handleEditEvent(val)}
          onSave={() => this.handleSaveEvent()}
          onCancel={() => this.handleEditCancel()}
        />
      </div>
    );
  }
}

export default App;
