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
      title: props.bug.title,
      description: props.bug.description,
      issue_type: props.bug.issue_type,
      priority: props.bug.priority,
      status: props.bug.status,
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
            <label>Title</label>
            <input type="text" className="form-control" autoComplete='title'
              name="title" id="title" placeholder="Title"
              value={this.state.title} onChange={this.handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea type="textarea" className="form-control" autoComplete=''
              name="description" id="description" placeholder="Description"
              value={this.state.description} onChange={this.handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="issue_type">Issue type</label>
              <select type="select" className="form-control" autoComplete=''
                name="issue_type" id="issue_type" placeholder="Issue type"
                value={this.state.issue_type ? this.state.issue_type : "issue"}
                onChange={this.handleInputChange}>
                <option value="issue">Issue</option>
                <option value="enhancement">Enhancement</option>
                <option value="feature">Feature</option>
              </select>
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
              <select type="select" className="form-control" autoComplete=''
                name="priority" id="priority" placeholder="Priority"
                value={this.state.priority ? this.state.priority : "Low"}
                onChange={this.handleInputChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
              <select type="select" className="form-control" autoComplete=''
                name="status" id="status" placeholder="Status"
                value={this.state.status ? this.state.status : "Open"}
                onChange={this.handleInputChange}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="monitor">Monitor</option>
              </select>
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
      title: this.state.title,
      description: this.state.description,
      issue_type: this.state.issue_type,
      priority: this.state.priority,
      status: this.state.status,
    });
    event.preventDefault();
  }

  handleCancel(event) {
    this.props.onCancel("new", {title:"", description:"", issue_type:"",
                                priority:"", status:""});
    event.preventDefault();
  }
}

const BugList = (props) => {
  const bugItems = props.bugs.map((bug) => {
    return (
      <BugListItem
        title={bug.title}
        description={bug.description}
        issue_type={bug.issue_type}
        priority={bug.priority}
        status={bug.status}
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
            <th class="col-md-2">Title</th>
            <th class="col-md-2">Description</th>
            <th class="col-md-2">Issue type</th>
            <th class="col-md-2">Priority</th>
            <th class="col-md-2">Status</th>
            <th class="col-md-2">Actions</th>
            <th colspan="2"></th>
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
      <td class="col-md-2">{props.title}</td>
      <td class="col-md-2">{props.description}</td>
      <td class="col-md-2">{props.issue_type}</td>
      <td class="col-md-2">{props.priority}</td>
      <td class="col-md-2">{props.status}</td>
      <td className="col-md-2 btn-toolbar">
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
      bug: {title:"", description:"", issue_type:"", priority:"", status:"",
            id: "9999999"}
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
    this.updateForm("new",{title:"", description:"", issue_type:"", priority:"",
                          status:"", id: "9999999"});
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
