'use client';

import { WithWalletConnector, TESTNET } from '@concordium/react-components';
import { createContext, useContext, ReactNode } from 'react';
import type { WalletConnectionProps } from '@concordium/react-components';

// Create a context for wallet props
const WalletContext = createContext<WalletConnectionProps | undefined>(undefined);

// Custom hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within ConcordiumProvider');
  }
  return context;
}

// Wrapper component that provides wallet props to children
function WalletWrapper(props: WalletConnectionProps & { children: ReactNode }) {
  const { children, ...walletProps } = props;
  
  return (
    <WalletContext.Provider value={walletProps}>
      {children}
    </WalletContext.Provider>
  );
}

// Main provider component
export function ConcordiumProvider({ children }: { children: ReactNode }) {
  return (
    <WithWalletConnector network={TESTNET}>
      {(props) => <WalletWrapper {...props}>{children}</WalletWrapper>}
    </WithWalletConnector>
  );
}
