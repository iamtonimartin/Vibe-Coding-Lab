import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/aisb/Home';
import Join from './pages/aisb/Join';
import ResourcesHub from './pages/aisb/ResourcesHub';
import OptInPlaybook from './pages/aisb/OptInPlaybook';
import OptInAppIdea from './pages/aisb/OptInAppIdea';
import OptInVideo from './pages/aisb/OptInVideo';
import BuildStandards from './pages/aisb/BuildStandards';
import OptInIdeas from './pages/aisb/OptInIdeas';
import StandardsThankYou from './pages/aisb/StandardsThankYou';
import Videos from './pages/aisb/Videos';
import AppIdeaGenerator from './pages/AppIdeaGenerator';
import IdeasAccess from './pages/IdeasAccess';
import VibePlaybook from './pages/VibePlaybook';
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
import ScrollToTop from './components/ScrollToTop';

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
      <ScrollToTop />
      <ChatWidget />
      <Routes>
        {/* --- AI for Service Businesses pages (src/pages/aisb) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/resources" element={<ResourcesHub />} />
        <Route path="/resources/ai-build-playbook" element={<OptInPlaybook />} />
        <Route path="/resources/find-your-app-idea" element={<OptInAppIdea />} />
        <Route path="/resources/build-in-a-week" element={<OptInVideo />} />
        <Route path="/build-standards" element={<BuildStandards />} />
        <Route path="/build-standards/thank-you" element={<StandardsThankYou />} />
        {/* The resources mockup linked this product as /website-standards. Keep
            that URL alive, but /build-standards is the canonical one because it
            matches the product's own name. */}
        <Route path="/website-standards" element={<Navigate to="/build-standards" replace />} />

        {/* Old lead-magnet URLs are live in emails and ads. They point at the
            same magnet in its new home rather than 404ing. /ideas is NOT here:
            that is the 70-ideas list, a different magnet from the idea generator. */}
        <Route path="/freetraining" element={<Navigate to="/resources/build-in-a-week" replace />} />
        <Route path="/playbook" element={<Navigate to="/resources/ai-build-playbook" replace />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/app-idea" element={<AppIdeaGenerator />} />
        <Route path="/ideas" element={<OptInIdeas />} />
        <Route path="/ideas-access" element={<IdeasAccess />} />
        <Route path="/vibeplaybook" element={<VibePlaybook />} />
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
