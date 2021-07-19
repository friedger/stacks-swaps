import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';
import './styles/floating-label.css';
import './styles/fonts.css';

ReactDOM.render(<App />, document.getElementById('App'));
