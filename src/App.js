import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  state = {
    data: [],
    id: 0,
    title: null,
    author: null,
    categories: null,
    isbn: null,
    pdf: null,
    epub: null,
    mobi: null,
    thumbnail: null,
    intervalIsSet: false,
    idToDelte: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // Fetch all data from db on mount and poll any changes
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 15000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // Kill the process after we're done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // Get data from the database
  getDataFromDb = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // Put data to the database
  putDataToDb = dataObj => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    dataObj.id = idToBeAdded;

    console.log("putDataToDb", dataObj);

    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/api/putdata", dataObj)
      .then(function(res) {
        console.log(res);
        this.getDataFromDb();
      });
  };

  // Delete data from the database
  deleteDataFromDb = idToDelete => {
    parseInt(idToDelete);
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToDelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete(process.env.REACT_APP_BACKEND_URL + "/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  // Update data in the database
  updateDataInDb = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post(process.env.REACT_APP_BACKEND_URL + "/api/updateData", {
      id: objIdToUpdate,
      update: updateToApply
    });
  };

  // UI
  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={dat.id}>
                  <span style={{ color: "gray" }}>id: </span> {dat.id} <br />
                  <span style={{ color: "gray" }}>id: </span> {dat.title} <br />
                  <span style={{ color: "gray" }}>id: </span> {dat.author}{" "}
                  <br />
                </li>
              ))}
        </ul>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            id="input-title"
            onChange={e => this.setState({ title: e.target.value })}
            placeholder="Title"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            id="input-author"
            onChange={e => this.setState({ author: e.target.value })}
            placeholder="Author"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            id="input-categories"
            onChange={e =>
              this.setState({ categories: e.target.value.split(",") })
            }
            placeholder="Categories separated by a comma"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            id="input-isbn"
            onChange={e => this.setState({ isbn: e.target.value })}
            placeholder="ISBN"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            id="input-pdf"
            onChange={e => this.setState({ pdf: e.target.value })}
            placeholder="Path to .pdf file"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            id="input-epub"
            onChange={e => this.setState({ epub: e.target.value })}
            placeholder="Path to .epub file"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            id="input-mobi"
            onChange={e => this.setState({ mobi: e.target.value })}
            placeholder="Path to .mobi file"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            id="input-thumbnail"
            onChange={e => this.setState({ thumbnail: e.target.value })}
            placeholder="Thumbnail path"
            style={{ width: "200px" }}
          />
          <button
            onClick={() =>
              this.putDataToDb({
                title: this.state.title,
                author: this.state.author,
                categories: this.state.categories,
                isbn: this.state.isbn,
                pdf: this.state.pdf,
                epub: this.state.epub,
                mobi: this.state.mobi,
                thumbnail: this.state.thumbnail
              })
            }
          >
            ADD
          </button>
        </div>
      </div>
    );
  }
}

export default App;
