import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectLayout from './layouts/ProjectLayout';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route
          path="/"
          element={<MainLayout />}
        />
        <Route path="/projects" element={<ProjectLayout />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
