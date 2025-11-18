import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Projects from './components/Projects/ProjectList';
import NewProject from './components/Projects/NewProject'; 
import Tasks from './components/Tasks/TaskList';
import NewTasksForm from './components/Tasks/NewTaskform';
import Issues from './components/Issues/IssueList';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<NewProject />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/new" element={<NewTasksForm />} /> 
            <Route path="issues" element={<Issues />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;