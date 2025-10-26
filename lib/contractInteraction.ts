'use client';

import { 
  ConcordiumGRPCClient, 
  ReceiveName,
  ContractAddress,
  AccountTransactionType,
  CcdAmount,
  Energy,
  Parameter,
  AccountAddress,
  TransactionHash,
} from '@concordium/web-sdk';
import { WalletConnection } from '@concordium/wallet-connectors';
import { showToast } from './toast';

const CONTRACT_INDEX = 12287;

interface Props {
  connector: WalletConnection | null;
  account: string | undefined;
  grpcClient: ConcordiumGRPCClient;
  carPrice: number; // Price in dollars
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
  setIsProcessing: (value: boolean) => void;
}

interface GetCodeProps {
  account: string | undefined;
  grpcClient: ConcordiumGRPCClient;
}

export async function verifyAddressOnChain({ 
  connector, 
  account,
  carPrice, 
  onSuccess, 
  onError,
  setIsProcessing 
}: Props) {
  if (!account || !connector) {
    onError('Please connect your wallet first');
    return;
  }

  try {
    setIsProcessing(true);
    
    const contractAddress: ContractAddress.Type = ContractAddress.create(
      BigInt(CONTRACT_INDEX), 
      BigInt(0)
    );
    
    // Convert car price to microCCD (price * 10^6)
    const amountInMicroCcd = BigInt(carPrice * 1_000_000);
    
    // Call verify_address - now payable with car price
    const txHash = await connector.signAndSendTransaction(
      account,
      AccountTransactionType.Update,
      {
        amount: CcdAmount.fromMicroCcd(amountInMicroCcd),
        address: contractAddress,
        receiveName: ReceiveName.fromString('concordiun.verify_address'),
        maxContractExecutionEnergy: Energy.create(30000),
      }
    );
    
    console.log('Transaction hash:', txHash);
    console.log('Amount paid:', carPrice, 'CCD');
    
    // Show success toast with transaction hash
    showToast({
      type: 'success',
      title: 'Transaction Submitted!',
      message: txHash,
      duration: 6000,
    });
    
    onSuccess(txHash);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
    
    // Show error toast
    showToast({
      type: 'error',
      title: 'Transaction Failed',
      message: errorMessage,
      duration: 6000,
    });
    
    onError(errorMessage);
    console.error('Transaction failed:', err);
  } finally {
    setIsProcessing(false);
  }
}

export async function waitForTransactionFinalization(
  grpcClient: ConcordiumGRPCClient,
  txHash: string
): Promise<boolean> {
  try {
    console.log('Waiting for transaction finalization...');
    
    const transactionHash = TransactionHash.fromHexString(txHash);
    
    // Poll for transaction status
    const maxAttempts = 60; // 60 attempts
    const pollInterval = 2000; // 2 seconds
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await grpcClient.getBlockItemStatus(transactionHash);
      console.log(`Attempt ${attempt + 1}: Transaction status:`, status.status);
      
      if (status.status === 'finalized') {
        console.log('Transaction finalized successfully!');
        return true;
      }
      
      if (status.status === 'committed') {
        console.log('Transaction committed, waiting for finalization...');
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    console.log('Transaction not finalized within timeout period');
    return false;
  } catch (err) {
    console.error('Error waiting for transaction finalization:', err);
    return false;
  }
}

export async function getCodeFromContract({ 
  account, 
  grpcClient 
}: GetCodeProps): Promise<number | null> {
  if (!account) {
    console.error('No account provided');
    return null;
  }

  try {
    const contractAddress: ContractAddress.Type = ContractAddress.create(
      BigInt(CONTRACT_INDEX), 
      BigInt(0)
    );
    
    // Parse the connected account address
    const accountAddr = AccountAddress.fromBase58(account);
    
    // Serialize the AccountAddress parameter (32 bytes)
    const paramBuffer = new ArrayBuffer(32);
    const paramView = new Uint8Array(paramBuffer);
    paramView.set(accountAddr.decodedAddress);
    const parameter = Parameter.fromBuffer(paramBuffer);
    
    // Invoke the get_code function (dry run - no transaction)
    const result = await grpcClient.invokeContract({
      contract: contractAddress,
      method: ReceiveName.fromString('concordiun.get_code'),
      parameter: parameter,
    });
    
    console.log('Get code result:', result);
    
    if (result.tag === 'success' && result.returnValue) {
      // Parse the return value (u32)
      const buffer = result.returnValue.buffer;
      const uint8View = new Uint8Array(buffer);
      const dataView = new DataView(uint8View.buffer);
      const code = dataView.getUint32(0, true); // true for little-endian
      console.log('Retrieved code:', code);
      return code;
    } else {
      console.log('Failed to get code - result tag:', result.tag);
      return null;
    }
  } catch (err) {
    console.error('Get code failed:', err);
    return null;
  }
}
