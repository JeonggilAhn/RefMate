import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Form from './components/common/Form';
import Confirm from './components/common/Confirm';
import Alert from './components/common/Alert';

import ProjectLayout from './layouts/ProjectLayout';
import MainLayout from './layouts/MainLayout';
import Blueprint from './pages/Blueprint';

function App() {
  return (
    <RecoilRoot>
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
      <Form />
      <Confirm />
      <Alert />
    </RecoilRoot>
  );
}

export default App;
