import "./App.css";
import { Suspense } from "react";
import Main from "./component/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Project2 from "./component/project/Project2";
import Project3 from "./component/project/Project3";
import Project4 from "./component/project/Project4";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/project2" element={<Project2 />} />
          <Route path="/project4" element={<Project4 />} />
          <Route path="/project3" element={<Project3 />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
