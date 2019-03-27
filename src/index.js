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
  return (
    <div className="author-list">
      Our Author List Goes Here.
    </div>
  );
}

class Authors extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authors: [],
    };
  }

  render() {
    return (
      <div className="authors">
        <AuthorForm />
        <AuthorList />
      </div>
    );
  }
}

ReactDOM.render(<Authors />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
