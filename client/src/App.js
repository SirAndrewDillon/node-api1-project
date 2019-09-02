import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  state = {
    users: [],
    newName: "",
    newBio: "",
    id: null,
    updating: false
  }

  componentDidMount() {
    this.fetchUsers()

  }

  fetchUsers = () => {
    axios.get('http://localhost:1234/api/users/')
      .then(res => {
        this.setState({
          users: res.data
        })
      })
      .catch(err => {
        console.log(`Error during fetch: ${err}`)
      })
  }

  deleteUser = (e) => {
    const id = e.target.value;

    axios.delete(`http://localhost:1234/api/users/${id}`)
      .then(res => {
        console.log(`Successfully deleted: ${res}`)
      })
      .catch(err => {
        console.log(`Error in deletion process ${err}`)
      })
      .finally(() =>
        this.fetchUsers()
      )
  }

  changeHandler1 = (e) => {
    this.setState({
      newName: e.target.value
    })
  }

  changeHandler2 = (e) => {
    this.setState({
      newBio: e.target.value
    })
  }

  addNewUser = () => {
    const user = {
      name: this.state.newName,
      bio: this.state.newBio
    }
    axios.post('http://localhost:1234/api/users', user)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        this.fetchUsers()
        this.setState({
          newName: "",
          newBio: "",
        })
      })
  }

  update = (e) => {
    const id = e.target.value;
    axios.get(`http://localhost:1234/api/users/${id}`)
      .then(res => {
        console.log(res)
        this.setState({
          updating: true,
          id: res.data.id,
          newName: res.data.name,
          newBio: res.data.bio
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  updateUser = () => {
    const updatedInfo = {
      name: this.state.newName,
      bio: this.state.newBio
    }
    const id = this.state.id;

    axios.put(`http://localhost:1234/api/users/${id}`, updatedInfo)
      .then(res => {
        this.setState({
          newBio: '',
          newName: '',
          id: null,
          updating: false
        })
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
          this.fetchUsers()
      })
  }

  render() {
    let button;
    if (!this.state.updating) {
      button = <button className='btn draw-border' onClick={this.addNewUser}>Add</button>
    }
    else {
      button = <button className='btn draw-border' onClick={this.updateUser}>Update</button>
    }

    return (
      <div className="body">
      <div className="App">
        <div className="list">
        {
          this.state.users.map(user => {
            return (
              <div className="person" key={user.id}>
                <h2>{user.name}</h2>
                <h3>{user.bio}</h3>
                <button onClick={this.deleteUser} value={user.id}>Delete</button>
                <button onClick={this.update} value={user.id}>Update</button>
              </div>
            )
          })
        }
        </div>
        <div className="form">
          <div>
          <input type="text" value={this.state.newName} onChange={this.changeHandler1} placeholder="Name" />
          <input type="text" value={this.state.newBio} onChange={this.changeHandler2} placeholder="Bio"/><br />
          {button}
          </div>
        </div>
      </div>
      </div>
    );
  }
}


export default App;
