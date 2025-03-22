// import { useState } from "react"
// import { useConnect, useConnectors } from "wagmi"
// import { useAppContext } from "../context/appContext"
// import { useStake } from "../hooks/useStake"
// import { useClaim } from "../hooks/useClaim"


// export const ClaimReward = () => {
//     const { address } = useAppContext()
//     const { handleClaim } = useClaim()



//     return (
//         <>
        
//         <button type="button" onClick={() => handleClaim()}>claim</button>
       
        
//         </>
        
//     )
// }

import { useState } from "react";
import { useAppContext } from "../context/appContext";
import { useClaim } from "../hooks/useClaim";
import { useStake } from "../hooks/useStake";

export const ClaimReward = () => {
    const { address } = useAppContext();
    const { handleClaim } = useClaim();
    const { userStakePosition } = useStake();
    const [isLoading, setIsLoading] = useState(false);

    const pendingRewards = userStakePosition.length > 0 ? parseFloat(userStakePosition[0].user.pendingRewards) : 0;
    const totalClaimed = userStakePosition.length > 0 ? parseFloat(userStakePosition[0].user.totalRewardsClaimed) : 0;

    const handleClaimClick = async () => {
        setIsLoading(true);
        try {
            await handleClaim();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Claim Rewards</h2>
                <p className="text-gray-400 mb-4">Claim your staking rewards</p>

                <div className="space-y-4">
                    <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Pending Rewards:</span>
                            <span className="font-medium text-green-400">{pendingRewards.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Claimed:</span>
                            <span className="font-medium">{totalClaimed.toFixed(4)}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleClaimClick}
                            disabled={!address || pendingRewards <= 0 || isLoading}
                            className={`w-full mt-4 py-3 px-4 rounded-lg font-medium ${
                                !address || pendingRewards <= 0 || isLoading
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            } transition-colors`}
                        >
                            {isLoading ? "Processing..." : "Claim Rewards"}
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Rewards History</h3>
                        {totalClaimed > 0 ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Total Rewards Claimed</span>
                                    <span>{totalClaimed.toFixed(4)}</span>
                                </div>
                                {/* This would be populated with actual claim history from the API */}
                                <div className="text-xs text-gray-400 italic">View on explorer for detailed history</div>
                            </div>
                        ) : (
                            <div className="text-gray-400 text-sm">No rewards claimed yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};