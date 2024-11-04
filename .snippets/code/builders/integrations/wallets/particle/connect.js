
import { ConnectButton, useAccount } from '@particle-network/connectkit';

export const App = () => {
    const { address, isConnected, chainId } = useAccount();

    // Standard ConnectButton utilization
    return (
        <div>
            <ConnectButton />
            {isConnected && (
                <>
                    <h2>Address: {address}</h2>
                    <h2>Chain ID: {chainId}</h2>
                </>
            )}
        </div>
    );
};