import { lazy, Suspense } from 'react';
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
import SampleAuditReport, { AuditChapter } from './pages/SampleAuditReport';
import AuditPrompts from './pages/AuditPrompts';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import ChatWidget from './components/ChatWidget';

/**
 * Retired campaign pages, kept for reference only.
 *
 * Lazy-loaded, so they never weigh on the main bundle. The June bumpsale is
 * now reachable in production too, on its own /archive URL, because people ask
 * to see the campaign. Two things keep that safe and they must stay true: its
 * checkout is neutralised (the offer closed on 4 June 2026, so the page must
 * not be purchasable) and it is noindexed, so it cannot compete with the live
 * /bundle offer in search. Bringing one of these back for real means restoring
 * its CTA deliberately, not by accident.
 */
const ArchivedBumpsale = lazy(
  () => import('./pages/archive/Bumpsale-2026-06-climbing-1-to-147')
);

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
        <Route path="/sampleauditreport" element={<SampleAuditReport />} />
        <Route path="/sampleauditreport/:slug" element={<AuditChapter />} />
        <Route path="/auditprompts" element={<AuditPrompts />} />
        {/* Ascendz-wide terms. A copy also lives on servicebusinessos.com, so
            if you change one, change the other. */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
        {/* Retired campaign, viewable but not purchasable. See ArchivedBumpsale above. */}
        <Route
          path="/archive/bumpsale"
          element={
            <Suspense fallback={null}>
              <ArchivedBumpsale />
            </Suspense>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  );
}
