import logo from './logo.svg';
import './App.css';
import {Suspense} from "react";
import Main from "./component/Main";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Project1 from './component/project/Project1';

function App() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/project1" element={<Project1 />} />
            </Routes>
          </BrowserRouter>
      </Suspense>
  );
}

export default App;
