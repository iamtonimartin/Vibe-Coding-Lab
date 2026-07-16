import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Landing from './pages/Landing';
import OptIn from './pages/OptIn';
import Videos from './pages/Videos';
import AppIdeaGenerator from './pages/AppIdeaGenerator';
import Ideas from './pages/Ideas';
import IdeasAccess from './pages/IdeasAccess';
import VibePlaybook from './pages/VibePlaybook';
import Playbook from './pages/Playbook';
import Resources from './pages/Resources';
import Unsubscribe from './pages/Unsubscribe';
import LogoExport from './pages/LogoExport';
import Bumpsale from './pages/Bumpsale';
import Checkout from './pages/Checkout';
import Complete from './pages/Complete';
import ArtOfTheAudit from './pages/ArtOfTheAudit';
import NotFound from './pages/NotFound';
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <HelmetProvider>
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
        <Route path="/resources" element={<Resources />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/logo" element={<LogoExport />} />
        <Route path="/bundle" element={<Bumpsale />} />
        <Route path="/bumpsale" element={<Navigate to="/bundle" replace />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/artoftheaudit" element={<ArtOfTheAudit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  );
}
