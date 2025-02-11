import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Form from './components/common/Form';
import Confirm from './components/common/Confirm';
import Alert from './components/common/Alert';

import MainLayout from './layouts/MainLayout';
import Blueprint from './pages/Blueprint';
import ProjectList from './pages/ProjectList';
import BlueprintList from './pages/BlueprintList';
import TokenCheck from './pages/TokenCheck'; // 추가

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route
            path="/projects/:projectId/blueprints"
            element={<BlueprintList />}
          ></Route>
          <Route
            path="/blueprint/:blueprint_id/:blueprint_version_id"
            element={<Blueprint />}
          />
          <Route path="/auth-redirect" element={<TokenCheck />} /> {/* 추가 */}
        </Routes>
      </Router>
      <Form />
      <Confirm />
      <Alert />
    </RecoilRoot>
  );
}

export default App;
