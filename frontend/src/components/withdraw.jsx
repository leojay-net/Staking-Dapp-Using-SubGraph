// import { useState } from "react"
// import { useConnect, useConnectors } from "wagmi"
// import { useAppContext } from "../context/appContext"
// import { useStake } from "../hooks/useStake"
// import { useWithdraw } from "../hooks/useWithdraw"


// export const WidrawForm = () => {
//     const { address } = useAppContext()
//     const [input, setInput] = useState(0)
//     const { handleWithdraw } = useWithdraw()

    
//     // console.log(connectors);


//     return (
//         <>
//         <form onSubmit={(e) => handleWithdraw(e, input)}>
//             <input type="number" placeholder="Amount from stake" onChange={(e) => setInput(e.target.value)} />
//             <button type="submit">Withdraw</button>
//         </form>
        
//         </>
        
//     )
// }

import { useState } from "react";
import { useAppContext } from "../context/appContext";
import { useWithdraw } from "../hooks/useWithdraw";
import { useStake } from "../hooks/useStake";

export const WithdrawForm = () => {
    const { address } = useAppContext();
    const [input, setInput] = useState("");
    const { handleWithdraw } = useWithdraw();
    const { userStakePosition } = useStake();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        setIsLoading(true);
        try {
            await handleWithdraw(e, input);
            setInput("");
        } finally {
            setIsLoading(false);
        }
    };

    const totalStaked = userStakePosition.length > 0 ? parseFloat(userStakePosition[0].user.totalStaked) : 0;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Withdraw Tokens</h2>
                <p className="text-gray-400 mb-4">Withdraw your staked tokens</p>

                {totalStaked > 0 ? (
                    <div className="py-2 px-4 bg-gray-700 rounded-lg mb-4 flex justify-between">
                        <span className="text-gray-400">Available to withdraw:</span>
                        <span className="font-medium">{totalStaked.toFixed(4)}</span>
                    </div>
                ) : (
                    <div className="py-3 px-4 bg-gray-700 rounded-lg mb-4 text-center">
                        <span className="text-gray-400">No tokens available to withdraw</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Amount to withdraw"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!address || isLoading || totalStaked <= 0}
                        />
                        <button 
                            type="button" 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                            onClick={() => setInput(totalStaked.toString())}
                            disabled={!address || totalStaked <= 0}
                        >
                            MAX
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!address || !input || isLoading || totalStaked <= 0}
                        className={`w-full py-3 px-4 rounded-lg font-medium ${
                            !address || !input || isLoading || totalStaked <= 0
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        } transition-colors`}
                    >
                        {isLoading ? "Processing..." : "Withdraw Tokens"}
                    </button>
                </form>
            </div>

            <div className="mt-4 text-sm text-gray-400">
                <p>• Withdrawals may be subject to a lock period depending on the protocol.</p>
                <p>• Ensure your wallet has sufficient gas for the transaction.</p>
            </div>
        </div>
    );
};