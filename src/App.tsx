import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';

import Home from './components/home/Home';
import Header from './components/layout/header/Header';

import './App.css';
import Swap from './components/swap/Swap';
import Tac from './components/tac/Tac';

function App() {
  // set theme as system setting
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, []);

  return (
    <Router>
      <div className="App backdrop-blur-[96px] min-h-[100vh] text-special-black dark:text-white transition-all duration-500 overflow-hidden relative">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="swaps" element={<Swap />} />
          <Route path="tac" element={<Tac />} />
        </Routes>
        <ToastContainer />
      </div>
      <footer className="container-fluid text-center border-top mt-4 py-5">
        <p>
          The Catamaran Swaps UI is open source and{' '}
          <a href="https://github.com/friedger/stacks-swaps" target="_blank" rel="noopener noreferrer">
            available on GitHub.</a> <br />The Catamaran Swaps contracts are{' '}
          <a href="https://github.com/friedger/clarity-catamaranswaps" target="_blank" rel="noopener noreferrer">
            available on GitHub.</a><br />Use at your own risk!{' '}
          <a href="/tac" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>.
        </p>
      </footer>
    </Router>
  );
}

export default App;
