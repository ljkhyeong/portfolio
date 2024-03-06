import logo from './logo.svg';
import './App.css';
import {Suspense} from "react";
import Main from "./component/Main";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />} />
            </Routes>
          </BrowserRouter>
      </Suspense>
  );
}

export default App;
