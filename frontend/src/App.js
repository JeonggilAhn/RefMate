import './App.css';
import './styles/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectLayout from './layouts/ProjectLayout';
import MainLayout from './layouts/MainLayout';
import Blueprint from './pages/Blueprint';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/projects" element={<ProjectLayout />} />
          <Route
            path="/projects/:projectId/blueprints"
            element={<ProjectLayout />}
          ></Route>
          <Route path="/blueprint" element={<Blueprint />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
