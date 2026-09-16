import { type ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Approach } from '@/components/sections/Approach';
import { Expertise } from '@/components/sections/Expertise';
import { WhyDcl } from '@/components/sections/WhyDcl';
import { Industries } from '@/components/sections/Industries';
import { Insights } from '@/components/sections/Insights';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { Footer } from '@/components/Footer';
import AboutPage from '@/pages/about';
import ExpertisePage from '@/pages/expertise';
import ApproachPage from '@/pages/approach';
import IndustriesPage from '@/pages/industries';
import ContactPage from '@/pages/contact';
import PrivacyPolicyPage from '@/pages/privacy-policy';
import TermsPage from '@/pages/terms';
import PartnersPage from '@/pages/partners';
import ServicesPage from '@/pages/services';
import RealEstateInvestmentAdvisoryPage from '@/pages/real-estate-investment-advisory';
import InvestmentConsultingPage from '@/pages/investment-consulting';
import AssetPortfolioAdvisoryPage from '@/pages/asset-portfolio-advisory';
import WealthStrategyAdvisoryPage from '@/pages/wealth-strategy-advisory';
import PrivateCapitalAdvisoryPage from '@/pages/private-capital-advisory';
import StrategicAdvisoryPage from '@/pages/strategic-advisory';
import MaAcquisitionAdvisoryPage from '@/pages/ma-acquisition-advisory';
import DueDiligenceSupportPage from '@/pages/due-diligence-support';
import RiskOpportunityAssessmentPage from '@/pages/risk-opportunity-assessment';
import MarketEntryExpansionAdvisoryPage from '@/pages/market-entry-expansion-advisory';
import ServiceDetailPage from '@/pages/service-detail';
import InsightsPage from '@/pages/insights';
import InsightDetailPage from '@/pages/insight-detail';
import NotFound from '@/pages/not-found';
import { useScrollTriggerRefresh } from '@/hooks/use-scroll-trigger-refresh';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Services />
        <Approach />
        <Expertise />
        <WhyDcl />
        <Industries />
        <Insights />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

function Router() {
  useScrollToTop();
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={AboutPage} />
        <Route path="/expertise" component={ExpertisePage} />
        <Route path="/approach" component={ApproachPage} />
        <Route path="/industries" component={IndustriesPage} />
        <Route path="/insights" component={InsightsPage} />
        <Route path="/insights/:slug" component={InsightDetailPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/partners" component={PartnersPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/services/real-estate-investment-advisory" component={RealEstateInvestmentAdvisoryPage} />
        <Route path="/services/investment-consulting" component={InvestmentConsultingPage} />
        <Route path="/services/asset-portfolio-advisory" component={AssetPortfolioAdvisoryPage} />
        <Route path="/services/wealth-strategy-advisory" component={WealthStrategyAdvisoryPage} />
        <Route path="/services/private-capital-advisory" component={PrivateCapitalAdvisoryPage} />
        <Route path="/services/strategic-advisory" component={StrategicAdvisoryPage} />
        <Route path="/services/ma-acquisition-advisory" component={MaAcquisitionAdvisoryPage} />
        <Route path="/services/due-diligence-support" component={DueDiligenceSupportPage} />
        <Route path="/services/risk-opportunity-assessment" component={RiskOpportunityAssessmentPage} />
        <Route path="/services/market-entry-expansion-advisory" component={MarketEntryExpansionAdvisoryPage} />
        <Route path="/services/:slug" component={ServiceDetailPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  useScrollTriggerRefresh();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
