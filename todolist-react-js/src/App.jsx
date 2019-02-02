import React, { Component } from "react";
import "./App.css";
import Countdown from "./Countdown";
import EditEvent from "./EditEvent";
import axios from "axios";

const url = "http://useo-notes.herokuapp.com/notes/";
class App extends Component {
  constructor() {
    super();
    this.state = {
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

    this.handleEditEvent = this.handleEditEvent.bind(this);
    this.handleSaveEvent = this.handleSaveEvent.bind(this);
    this.handleRemoveEvent = this.handleRemoveEvent.bind(this);
    this.handleEditInit = this.handleEditInit.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
  }

  componentDidMount() {
    axios.get(url).then(res => {
      this.setState({ totalPages: res.data.total_pages });
      console.log(" in axios " + res.data.total_pages);
      for (let i = 1; i <= res.data.total_pages; i++) {
        axios.get(url + "?page=" + i).then(res => {
          res.data.notes.forEach(note => {
            this.state.notes.push(note);
          });
          this.state.notes.forEach(note => {
            console.log(
              "moj note name: " +
                note.content +
                " moj id " +
                note.id +
                " data: " +
                note.deadline
            );
          });
        });
      }
    });
    const intervalId = setInterval(this.timer, 1000);
    this.setState({ intervalId: intervalId });
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  handleEditEvent(val) {
    this.setState(prevState => {
      return {
        note: Object.assign(prevState.note, val)
      };
    });
  }

  handleSaveEvent() {
    this.setState(
      prevState => {
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
      },
      () => localStorage.setItem("notes", JSON.stringify(this.state.notes))
    );

    console.log("Put task on server");

    axios
      .post(url, {
        note: {
          id: 0, //Id is not respected anyway so was hardcoded to 0.
          content: "taskName",
          deadline: "2018-01-01",
          completed: false,
          created_at: new Date().toLocaleDateString(),
          updated_at: new Date().toLocaleDateString()
        }
      })
      .then(res => {
        console.log("this is response status " + res.statusText);
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

  handleCheckedEvent() {
    console.log("zaznaczono task ");
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
