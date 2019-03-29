import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/';

class AuthorForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fname: props.author.fname,
      lname: props.author.lname,
      email: props.author.email,
      id: props.author.id
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
      <div className="author-form">
        <h1> Authors </h1>
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

const AuthorList = (props) => {
  const authorItems = props.authors.map((author) => {
    return (
      <AuthorListItem
        fname={author.fname}
        lname={author.lname}
        email={author.email}
        id={author.id}
        key={author.id}
        onDelete={props.onDelete}
        onEdit={props.onEdit}
      />
    )
  });

  return (
    <div className="author-list">
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
          {authorItems}
        </tbody>
      </table>
    </div>
  );
}

const AuthorListItem = (props) => {
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

export default class Authors extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      formMode: "new",
      author: {lname:"", fname:"", email:"", id: "9999999"}
    };
    this.updateForm = this.updateForm.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.loadAuthors = this.loadAuthors.bind(this);
    this.removeAuthor = this.removeAuthor.bind(this);
    this.addAuthor = this.addAuthor.bind(this);
    this.updateAuthor = this.updateAuthor.bind(this);
    this.formSubmitted = this.formSubmitted.bind(this);
  }

  render() {
    return (
      <div className="authors">
        <AuthorForm
          onSubmit={(author) => this.formSubmitted(author)}
          onCancel={(mode,author) => this.updateForm(mode,author)}
          formMode={this.state.formMode}
          author={this.state.author}
          key={this.state.author.id}
        />
        <AuthorList
          authors={this.state.authors}
          onDelete={(id) => this.removeAuthor(id)}
          onEdit={(mode,author) => this.updateForm(mode,author)}
        />
      </div>
    );
  }

  componentDidMount() {
    console.log('Authors mounted!')
    this.loadAuthors();
  }

  updateForm(mode, authorVals) {
    this.setState({
      author: Object.assign({}, authorVals),
      formMode: mode,
    });
  }

  clearForm() {
    console.log("clear form");
    this.updateForm("new",{fname:"",lname:"",email:"", id: "99999999"});
  }

  loadAuthors() {
    axios
      .get(`${API_BASE}/authors.json`)
      .then(res => {
              this.setState({ authors: res.data });
              console.log(`Data loaded! = ${this.state.authors}`)
            })
      .catch(err => console.log(err));
  }

  addAuthor(newAuthor) {
    axios
      .post(`${API_BASE}/authors.json`, newAuthor)
      .then(res => {
              res.data.key = res.data.id;
              this.setState({ authors: [...this.state.authors, res.data] });
            })
      .catch(err => console.log(err));
    }

  updateAuthor(author) {
    axios
      .put(`${API_BASE}/authors/${author.id}.json`, author)
      .then(res => {
              this.loadAuthors();
            })
      .catch(err => console.log(err));
  }

  removeAuthor(id) {
    let filteredArray = this.state.authors.filter(item => item.id !== id)
    this.setState({authors: filteredArray});
    axios
      .delete(`${API_BASE}/authors/${id}.json`)
      .then(res => {
              console.log(`Record Deleted`);
              //this.clearForm();
            })
      .catch(err => console.log(err));
  }

  formSubmitted(author) {
    if(this.state.formMode === "new") {
      this.addAuthor(author);
    } else {
      this.updateAuthor(author);
    }
      this.clearForm();
    }
}
