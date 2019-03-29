import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Authors from './authors'

ReactDOM.render(<BrowserRouter>
                  <div>
                    <h1>Welcome to YABT!</h1>
                    <ul>
                      <li><Link to="/">Home</Link></li>
                      <li><Link to="/authors">Authors</Link></li>
                      <li><Link to="/bugs">Bugs</Link></li>
                    </ul>

                    <Route exact path="/authors" component={Authors} />
                    <Route exact path="/bugs" component={Authors} />
                  </div>
                </BrowserRouter>,
                document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
