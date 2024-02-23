import { PageContainer } from './components/page-container';
import { ThemeProvider } from './ui/theme-provider';
import { Web3Provider } from './providers/web3-provider';
import { TooltipProvider } from './ui/tooltip';
import { Suspense } from 'react';
import { LoadingPage } from './pages/loading-page';
import { Toaster } from './ui/toaster';
import { Router } from './router';

export default function App() {
  return (
    <>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="teleporter-ui-theme"
      >
        <TooltipProvider>
          <Web3Provider>
            <Suspense fallback={<LoadingPage />}>
              <PageContainer>
                <h1 className="mt-4 sm:mt-8 mb-4 text-3xl font-semibold">Teleporter</h1>
                <Router />
              </PageContainer>
            </Suspense>
          </Web3Provider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
