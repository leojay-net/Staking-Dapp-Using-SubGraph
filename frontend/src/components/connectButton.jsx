// import { useState } from "react"
// import { useConnect, useConnectors } from "wagmi"
// import { useAppContext } from "../context/appContext"


// export const ConnectButton = () => {
//     const { address } = useAppContext()
//     const connectors = useConnectors()
//     const { connectAsync, connect } = useConnect()
//     const [isClicked, setIsClicked] = useState(false)
    
//     // console.log(connectors);

//     const handleClick = async (connector) => {
//         console.log(connector);
        
//         await connectAsync({connector: connector})
//         setIsClicked(false)
        
//     }

//     return (
//         <>
//         {isClicked ? 
//         <div>
//         {connectors.map(connector => (
//             <button key={connector.id} onClick={() => handleClick(connector)}>{connector.name}</button>
//         ))}
        
//          </div>
//         : 
//         <div>{ address ? <p>{address}</p>:<button onClick={() => setIsClicked(true)}>Connect</button> }</div>
//         }
        
//         </>
        
//     )
// }

import { useState, useEffect } from "react";
import { useConnect, useConnectors, useDisconnect } from "wagmi";
import { useAppContext } from "../context/appContext";

export const ConnectButton = () => {
    const { address } = useAppContext();
    const connectors = useConnectors();
    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [truncatedAddress, setTruncatedAddress] = useState("");

    useEffect(() => {
        if (address) {
            setTruncatedAddress(`${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
        }
    }, [address]);

    const handleClick = async (connector) => {
        try {
            await connectAsync({ connector: connector });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnectAsync();
        } catch (error) {
            console.error("Disconnect error:", error);
        }
    };

    return (
        <>
            {address ? (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg py-2 px-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{truncatedAddress}</span>
                    </div>
                    <button 
                        onClick={handleDisconnect}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20"
                >
                    Connect Wallet
                </button>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Connect Wallet</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2">
                            {connectors.map(connector => (
                                <button 
                                    key={connector.id}
                                    onClick={() => handleClick(connector)}
                                    className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors"
                                >
                                    <span className="font-medium">{connector.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};