import { useState } from "react";
import Header from "./Header";
import About from "./About";
import "../css/Main.css";
import Projects from "./Projects";
import Books from "./Books";

const Main = () => {
  const [activeTab, setActiveTab] = useState("About");

  const renderTab = () => {
    switch (activeTab) {
      case "About":
        return (
          <About
            onShowProjects={() => setActiveTab("Projects")}
            onShowBooks={() => setActiveTab("Books")}
          />
        );
      case "Projects":
        return <Projects />;
      case "Books":
        return <Books />;
      default:
        return (
          <About
            onShowProjects={() => setActiveTab("Projects")}
            onShowBooks={() => setActiveTab("Books")}
          />
        );
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
        <button
          className={`tab ${activeTab === "Books" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("Books")}
        >
          BOOKS & STUDY
        </button>
      </div>
      {renderTab()}
    </div>
  );
};

export default Main;
