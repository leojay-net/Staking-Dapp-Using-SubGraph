import { useState } from "react";
import { useAppContext } from "../context/appContext";
import { useWithdraw } from "../hooks/useWithdraw";
import { useStake } from "../hooks/useStake";

export const EmergencyWithdraw = () => {
    const { address } = useAppContext();
    const { handleWithdraw } = useWithdraw();
    const { userStakePosition } = useStake();
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const totalStaked = userStakePosition.length > 0 ? parseFloat(userStakePosition[0].user.totalStaked) : 0;

    const handleEmergencyWithdraw = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await handleWithdraw(e, totalStaked, true);
            setIsConfirming(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Emergency Withdrawal</h2>
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="text-red-500 font-medium">Warning: Emergency Withdrawal</h3>
                            <p className="text-gray-300 mt-1">Emergency withdrawal will immediately withdraw all your staked tokens but may incur penalties:</p>
                            <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                                <li>You may lose pending rewards</li>
                                <li>An early withdrawal fee may be applied</li>
                                <li>This action cannot be undone</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="py-2 px-4 bg-gray-700 rounded-lg mb-4 flex justify-between">
                    <span className="text-gray-400">Currently staked:</span>
                    <span className="font-medium">{totalStaked.toFixed(4)}</span>
                </div>

                {!isConfirming ? (
                    <button
                        onClick={() => setIsConfirming(true)}
                        disabled={!address || totalStaked <= 0}
                        className={`w-full py-3 px-4 rounded-lg font-medium ${
                            !address || totalStaked <= 0
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                        } transition-colors`}
                    >
                        Emergency Withdraw
                    </button>
                ) : (
                    <div className="space-y-4">
                        <p className="text-red-400">Are you sure you want to proceed with emergency withdrawal?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsConfirming(false)}
                                className="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEmergencyWithdraw}
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                {isLoading ? "Processing..." : "Confirm Withdrawal"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};