import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Landing from './pages/Landing';
import OptIn from './pages/OptIn';
import Videos from './pages/Videos';
import AppIdeaGenerator from './pages/AppIdeaGenerator';
import Ideas from './pages/Ideas';
import IdeasAccess from './pages/IdeasAccess';
import VibePlaybook from './pages/VibePlaybook';
import Playbook from './pages/Playbook';
import Unsubscribe from './pages/Unsubscribe';
import LogoExport from './pages/LogoExport';
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <HelmetProvider>
    <Router>
      <ChatWidget />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/freetraining" element={<OptIn />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/app-idea" element={<AppIdeaGenerator />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/ideas-access" element={<IdeasAccess />} />
        <Route path="/vibeplaybook" element={<VibePlaybook />} />
        <Route path="/playbook" element={<Playbook />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/logo" element={<LogoExport />} />
      </Routes>
    </Router>
    </HelmetProvider>
  );
}
