'use client';

import { 
  ConnectorType, 
  useWalletConnectorSelector, 
  WalletConnectionProps,
  ephemeralConnectorType,
  useConnection,
  useConnect
} from '@concordium/react-components';
import { 
  BrowserWalletConnector,
  WalletConnectConnector,
  CONCORDIUM_WALLET_CONNECT_PROJECT_ID
} from '@concordium/wallet-connectors';
import { useEffect } from 'react';

// Define connector types
export const BROWSER_WALLET = ephemeralConnectorType(BrowserWalletConnector.create);

// WalletConnect requires configuration
export const WALLET_CONNECT = ephemeralConnectorType(
  (delegate, network) => WalletConnectConnector.create(
    { projectId: CONCORDIUM_WALLET_CONNECT_PROJECT_ID, metadata: { name: 'Carma', description: 'Blockchain Car Rentals', url: '#', icons: [] } },
    delegate,
    network
  )
);

interface WalletConnectorButtonProps extends WalletConnectionProps {
  connectorType: ConnectorType;
  connectorName: string;
  onConnected?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function WalletConnectorButton(props: WalletConnectorButtonProps) {
  const { connectorType, onConnected, className, children } = props;
  
  // Get connection state
  const { connection, setConnection } = useConnection(props.connectedAccounts, props.genesisHashes);
  
  // Get connect function
  const { connect, isConnecting, connectError } = useConnect(props.activeConnector, setConnection);
  
  // Use the selector hook
  const { isSelected, isConnected, isDisabled, select } = 
    useWalletConnectorSelector(connectorType, connection, props);

  // Auto-connect when connector is selected but not connected
  useEffect(() => {
    if (isSelected && !isConnected && !isConnecting && connect && !connection) {
      console.log('Auto-connecting to wallet...');
      connect();
    }
  }, [isSelected, isConnected, isConnecting, connect, connection]);

  // Call onConnected callback when connection is established
  useEffect(() => {
    if (isConnected && connection && onConnected) {
      onConnected();
    }
  }, [isConnected, connection, onConnected]);

  const handleClick = () => {
    if (!isConnected && !isDisabled && !isConnecting) {
      select();
    }
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
      {connectError && (
        <p className="text-red-500 text-sm mt-2">{connectError}</p>
      )}
    </div>
  );
}
