import { useState } from "react";
import Header from "./Header";
import About from "./About";
import "../css/Main.css";
import Projects from "./Projects";

const Main = () => {
  const [activeTab, setActiveTab] = useState("About");

  const renderTab = () => {
    switch (activeTab) {
      case "About":
        return <About />;
      case "Projects":
        return <Projects />;
      default:
        return <About />;
    }
  };
  return (
    <div className="container">
      <Header />
      <div className="tabs">
        <button
          className={`tab ${activeTab === "About" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("About")}
        >
          ABOUT
        </button>
        <button
          className={`tab ${activeTab === "Projects" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("Projects")}
        >
          PROJECTS
        </button>
      </div>
      {renderTab()}
      <a href="포트폴리오최신.pdf" download="포트폴리오최신.pdf">
        <button className="pdf-download-btn">Download PDF</button>
      </a>
    </div>
  );
};

export default Main;
