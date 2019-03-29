import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/';

class BugForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fname: props.bug.fname,
      lname: props.bug.lname,
      email: props.bug.email,
      id: props.bug.id
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  renderButtons() {
    if (this.props.formMode === "new") {
      return(
        <button type="submit" className="btn btn-primary">Create</button>
      );
    } else {
      return(
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="submit" className="btn btn-danger" onClick={this.handleCancel} >Cancel</button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="bug-form">
        <h1> Bugs </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" className="form-control" autoComplete='given-name'
              name="fname" id="fname" placeholder="First Name"
              value={this.state.fname} onChange={this.handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="lname">Last Name</label>
            <input type="text" className="form-control" autoComplete='family-name'
              name="lname" id="lname" placeholder="Last Name"
              value={this.state.lname} onChange={this.handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" autoComplete='email'
                name="email" id="email" placeholder="name@example.com"
                value={this.state.email} onChange={this.handleInputChange}/>
          </div>
          {this.renderButtons()}
        </form>
      </div>
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    this.props.onSubmit({
      fname: this.state.fname,
      lname: this.state.lname,
      email: this.state.email,
      id: this.state.id,
    });
    event.preventDefault();
  }

  handleCancel(event) {
    this.props.onCancel("new", {fname:"", lname:"", email:""});
    event.preventDefault();
  }
}

const BugList = (props) => {
  const bugItems = props.bugs.map((bug) => {
    return (
      <BugListItem
        fname={bug.fname}
        lname={bug.lname}
        email={bug.email}
        id={bug.id}
        key={bug.id}
        onDelete={props.onDelete}
        onEdit={props.onEdit}
      />
    )
  });

  return (
    <div className="bug-list">
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="col-md-3">First Name</th>
            <th className="col-md-3">Last Name</th>
            <th className="col-md-3">Email</th>
            <th className="col-md-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bugItems}
        </tbody>
      </table>
    </div>
  );
}

const BugListItem = (props) => {
  return (
    <tr>
      <td className="col-md-3">{props.fname}</td>
      <td className="col-md-3">{props.lname}</td>
      <td className="col-md-3">{props.email}</td>
      <td className="col-md-3 btn-toolbar">
        <button className="btn btn-success btn-sm" onClick={event => props.onEdit("edit",props)}>
          <i className="glyphicon glyphicon-pencil"></i> Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={event => props.onDelete(props.id)}>
          <i className="glyphicon glyphicon-remove"></i> Delete
        </button>
      </td>
    </tr>
  );
}

export default class Bugs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bugs: [],
      formMode: "new",
      bug: {lname:"", fname:"", email:"", id: "9999999"}
    };
    this.updateForm = this.updateForm.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.loadBugs = this.loadBugs.bind(this);
    this.removeBug = this.removeBug.bind(this);
    this.addBug = this.addBug.bind(this);
    this.updateBug = this.updateBug.bind(this);
    this.formSubmitted = this.formSubmitted.bind(this);
  }

  render() {
    return (
      <div className="bugs">
        <BugForm
          onSubmit={(bug) => this.formSubmitted(bug)}
          onCancel={(mode,bug) => this.updateForm(mode,bug)}
          formMode={this.state.formMode}
          bug={this.state.bug}
          key={this.state.bug.id}
        />
        <BugList
          bugs={this.state.bugs}
          onDelete={(id) => this.removeBug(id)}
          onEdit={(mode,bug) => this.updateForm(mode,bug)}
        />
      </div>
    );
  }

  componentDidMount() {
    console.log('Bugs mounted!')
    this.loadBugs();
  }

  updateForm(mode, bugVals) {
    this.setState({
      bug: Object.assign({}, bugVals),
      formMode: mode,
    });
  }

  clearForm() {
    console.log("clear form");
    this.updateForm("new",{fname:"",lname:"",email:"", id: "99999999"});
  }

  loadBugs() {
    axios
      .get(`${API_BASE}/bugs.json`)
      .then(res => {
              this.setState({ bugs: res.data });
              console.log(`Data loaded! = ${this.state.bugs}`)
            })
      .catch(err => console.log(err));
  }

  addBug(newBug) {
    axios
      .post(`${API_BASE}/bugs.json`, newBug)
      .then(res => {
              res.data.key = res.data.id;
              this.setState({ bugs: [...this.state.bugs, res.data] });
            })
      .catch(err => console.log(err));
    }

  updateBug(bug) {
    axios
      .put(`${API_BASE}/bugs/${bug.id}.json`, bug)
      .then(res => {
              this.loadBugs();
            })
      .catch(err => console.log(err));
  }

  removeBug(id) {
    let filteredArray = this.state.bugs.filter(item => item.id !== id)
    this.setState({bugs: filteredArray});
    axios
      .delete(`${API_BASE}/bugs/${id}.json`)
      .then(res => {
              console.log(`Record Deleted`);
              //this.clearForm();
            })
      .catch(err => console.log(err));
  }

  formSubmitted(bug) {
    if(this.state.formMode === "new") {
      this.addBug(bug);
    } else {
      this.updateBug(bug);
    }
      this.clearForm();
    }
}
