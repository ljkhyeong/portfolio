import logo from "./logo.svg";
import "./App.css";
import { Suspense } from "react";
import Main from "./component/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Project1 from "./component/project/Project1";
import Project2 from "./component/project/Project2";
import Project3 from "./component/project/Project3";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/project2" element={<Project2 />} />
          <Route path="/project3" element={<Project3 />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
