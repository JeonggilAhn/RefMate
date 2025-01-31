import './App.css';
import "./styles/index.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectLayout from './layouts/ProjectLayout';
import MainLayout from './layouts/MainLayout';
import BluePrintLayout from './layouts/BluePrintLayout';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/projects" element={<ProjectLayout />} />
        <Route path="/blueprint" element={<BluePrintLayout />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
