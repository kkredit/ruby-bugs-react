import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

const AuthorForm = (props) => {
  return (
    <div className="author-form">
      Our Author Form Goes Here.
    </div>
  );
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

class Authors extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authors: [],
    };
    this.loadAuthors = this.loadAuthors.bind(this);
  }

  render() {
    return (
      <div className="authors">
        <AuthorForm />
        <AuthorList authors={this.state.authors} />
      </div>
    );
  }

  componentDidMount() {
    console.log('Authors mounted!')
    this.loadAuthors();
  }

  loadAuthors() {
    this.setState({
      authors: [
        {id: 0, fname: "sam", lname: "iam", email: "sam@aol.com"},
        {id: 1, fname: "jane", lname: "doe", email: "jane@aol.com"},
        {id: 2, fname: "fred", lname: "bear", email: "fred@aol.com"},
        {id: 3, fname: "ted", lname: "tooy", email: "ted@aol.com"},
      ]}
    );
  }
}

ReactDOM.render(<Authors />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
