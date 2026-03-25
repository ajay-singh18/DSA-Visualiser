import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Visualizer from './pages/Visualizer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AssessmentSetup from './pages/AssessmentSetup';
import AssessmentQuiz from './pages/AssessmentQuiz';
import AssessmentResults from './pages/AssessmentResults';
import RaceMode from './pages/RaceMode';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import DocsHub from './pages/DocsHub';
import DocDetail from './pages/DocDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/docs" element={<DocsHub />} />
        <Route path="/docs/:algoKey" element={<DocDetail />} />
        <Route path="/race" element={<RaceMode />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Assessment Routes */}
        <Route path="/assessment" element={<AssessmentSetup />} />
        <Route path="/assessment/quiz" element={<AssessmentQuiz />} />
        <Route path="/assessment/results/:sessionId" element={<AssessmentResults />} />
      </Routes>
    </BrowserRouter>
  );
}
