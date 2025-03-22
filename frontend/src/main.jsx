import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WagmiProvider } from 'wagmi'
import { config } from './config/wagmi.config.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from "./context/appContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
        <App />
        </AppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
)
