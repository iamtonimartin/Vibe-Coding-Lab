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
import ServiceBusinessOS from './pages/ServiceBusinessOS';
import SbosJoin from './pages/SbosJoin';
import SbosSuccess from './pages/SbosSuccess';
import SbosUnsubscribed from './pages/SbosUnsubscribed';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import ChatWidget from './components/ChatWidget';

/**
 * Retired campaign pages, kept for reference only.
 *
 * These are lazy-loaded and mounted ONLY in dev, so they stay reachable on
 * localhost while never shipping a route on the live site. That matters: the
 * archived bumpsale still carries a working bumpsale.co checkout link for an
 * offer that closed on 4 June 2026, so it must not be publicly purchasable.
 * If one of these is ever brought back for real, neutralise its CTA first.
 */
const ArchivedBumpsale = import.meta.env.DEV
  ? lazy(() => import('./pages/archive/Bumpsale-2026-06-climbing-1-to-147'))
  : null;

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
        {/* Service Business OS — founding bumpsale */}
        <Route path="/sbos" element={<ServiceBusinessOS />} />
        <Route path="/sbos-join" element={<SbosJoin />} />
        <Route path="/sbos-success" element={<SbosSuccess />} />
        <Route path="/sbos-unsubscribed" element={<SbosUnsubscribed />} />
        {/* Linked from the ThriveCart checkouts, so this URL must stay stable */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
        {/* Dev only. 404s in production, see ArchivedBumpsale above. */}
        {import.meta.env.DEV && ArchivedBumpsale && (
          <Route
            path="/archive/bumpsale"
            element={
              <Suspense fallback={null}>
                <ArchivedBumpsale />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  );
}
