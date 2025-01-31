import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectLayout from './layouts/ProjectLayout';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div className="App">
                <MainLayout />
              </div>
              <Link to="/projects">프로젝트 페이지</Link>
            </div>
          }
        />
        <Route path="/projects" element={<ProjectLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
