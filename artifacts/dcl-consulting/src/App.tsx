import { type ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Expertise } from '@/components/sections/Expertise';
import { Approach } from '@/components/sections/Approach';
import { Industries } from '@/components/sections/Industries';
import { WhoWeAdvise } from '@/components/sections/WhoWeAdvise';
import { WhyDcl } from '@/components/sections/WhyDcl';
import { DclAtAGlance } from '@/components/sections/DclAtAGlance';
import { OurPhilosophy } from '@/components/sections/OurPhilosophy';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { Footer } from '@/components/Footer';
import AboutPage from '@/pages/about';
import ExpertisePage from '@/pages/expertise';
import ApproachPage from '@/pages/approach';
import IndustriesPage from '@/pages/industries';
import NotFound from '@/pages/not-found';
import { useScrollTriggerRefresh } from '@/hooks/use-scroll-trigger-refresh';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Expertise />
        <Approach />
        <Industries />
        <WhoWeAdvise />
        <WhyDcl />
        <DclAtAGlance />
        <OurPhilosophy />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={AboutPage} />
        <Route path="/expertise" component={ExpertisePage} />
        <Route path="/approach" component={ApproachPage} />
        <Route path="/industries" component={IndustriesPage} />
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
