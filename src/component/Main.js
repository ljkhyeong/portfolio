import { useState } from "react"
import Header from "./Header"
import About from "./About"
import '../css/Main.css';
import Projects from "./Projects";

const Main = () => {

    const [activeTab, setActiveTab] = useState('About');

    const renderTab = () => {
        switch(activeTab) {
            case 'About' :
                return <About/>;
            case 'Projects' :
                return <Projects/>;
            default:
                return <About/>;
        }
    }
    return (
        <div className="container">
            <Header/>
            <div className="tabs">
                <button className="tab" onClick={() => setActiveTab('About')}>ABOUT</button>
                <button className="tab" onClick={() => setActiveTab('Projects')}>PROJECTS</button>
            </div>
            {renderTab()}
        </div>
    )
}

export default Main