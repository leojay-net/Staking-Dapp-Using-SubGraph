import { useState, useCallback, useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { useStake } from "../hooks/useStake";
import { calculateTimeUntilUnlock } from "../utils/calculateTimeUntilUnlock";

export const StakeForm = () => {
    const { address, apr } = useAppContext();
    const [input, setInput] = useState("");
    const { stakePositions, userStakePosition, handleStaking } = useStake();
    const [isLoading, setIsLoading] = useState(false);
    const [timeUntilUnlock, setTimeUntilUnlock] = useState("");
    const [activeTab, setActiveTab] = useState("all"); // State to manage active tab

    const handleInputChange = useCallback((e) => {
        setInput(e.target.value);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        setIsLoading(true);
        try {
            await handleStaking(e, input);
            setInput("");
        } finally {
            setIsLoading(false);
        }
    }, [handleStaking, input]);

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    useEffect(() => {
        if (userStakePosition.length > 0) {
            const lastStakeTimestamp = userStakePosition[0].user.lastStakeTimestamp;
            const interval = setInterval(() => {
                setTimeUntilUnlock(calculateTimeUntilUnlock(lastStakeTimestamp));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [userStakePosition]);

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Stake Tokens</h2>
                <p className="text-gray-400 mb-4">Stake your tokens to earn rewards at {apr}% APR</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Amount to stake"
                            value={input}
                            onChange={handleInputChange}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!address || isLoading}
                        />
                        <button 
                            type="button" 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                            onClick={() => setInput("MAX")} 
                        >
                            MAX
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!address || !input || isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-medium ${
                            !address || !input || isLoading
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        } transition-colors`}
                    >
                        {isLoading ? "Processing..." : "Stake Tokens"}
                    </button>
                </form>
            </div>

            {/* Tabs for All Staking Positions and User Staking Position */}
            <div className="mt-8">
                <div className="flex space-x-4 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`py-2 px-4 text-sm font-medium ${
                            activeTab === "all"
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-400 hover:text-gray-200"
                        }`}
                    >
                        All Staking Positions
                    </button>
                    <button
                        onClick={() => setActiveTab("user")}
                        className={`py-2 px-4 text-sm font-medium ${
                            activeTab === "user"
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-400 hover:text-gray-200"
                        }`}
                    >
                        Your Staking Position
                    </button>
                </div>

                {/* Content for All Staking Positions */}
                {activeTab === "all" && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-4">All Staking Positions</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Staked</th>
                                        <th className="px-4 py-3">Rewards</th>
                                        <th className="px-4 py-3">Last Activity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stakePositions.map((stake) => (
                                        <tr key={stake.user.id} className="border-b border-gray-700 hover:bg-gray-700">
                                            <td className="px-4 py-3">
                                                <span className="font-mono">{`${stake.user.id.substring(0, 6)}...${stake.user.id.substring(stake.user.id.length - 4)}`}</span>
                                            </td>
                                            <td className="px-4 py-3">{parseFloat(stake.user.totalStaked).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-green-400">{parseFloat(stake.user.pendingRewards).toFixed(2)}</td>
                                            <td className="px-4 py-3">{formatTimestamp(stake.user.lastStakeTimestamp)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Content for User Staking Position */}
                {activeTab === "user" && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-4">Your Stake Position</h3>
                        {userStakePosition.length > 0 ? (
                            <div className="bg-gray-700 rounded-lg p-4">
                                    <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                                            <tr>
                                                <th className="px-4 py-3">User</th>
                                                <th className="px-4 py-3">Staked</th>
                                                <th className="px-4 py-3">Rewards</th>
                                                <th className="px-4 py-3">Last Activity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {userStakePosition.map((stake) => (
                                                <tr key={stake.user.id} className="border-b border-gray-700 hover:bg-gray-700">
                                                    <td className="px-4 py-3">
                                                        <span className="font-mono">{`${stake.user.id.substring(0, 6)}...${stake.user.id.substring(stake.user.id.length - 4)}`}</span>
                                                    </td>
                                                    <td className="px-4 py-3">{parseFloat(stake.user.totalStaked).toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-green-400">{parseFloat(stake.user.pendingRewards).toFixed(2)}</td>
                                                    <td className="px-4 py-3">{formatTimestamp(stake.user.lastStakeTimestamp)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <span className="text-gray-400">No active stake position found.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};