import { useState, useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { useStake } from "../hooks/useStake";

export const StatsPanel = () => {
    const { stakePositions, userStakePosition, apr } = useStake();
    const [countdownTime, setCountdownTime] = useState("Loading...");
    const [timePercent, setTimePercent] = useState(0);

    
    useEffect(() => {
        console.log("User Stake Position:", userStakePosition);
    }, [userStakePosition]);

    
    const totalStaked = stakePositions.reduce((total, stake) => 
        total + parseFloat(stake.user.totalStaked || 0), 0);
    const totalUsers = stakePositions.length;
    const totalPendingRewards = stakePositions.reduce((total, stake) => 
        total + parseFloat(stake.user.pendingRewards || 0), 0);
    const avgStake = totalUsers > 0 ? totalStaked / totalUsers : 0;

    
    useEffect(() => {
        if (userStakePosition.length > 0) {
            
            const lastStakeTimestamp = userStakePosition[0].user.lastStakeTimestamp;
            

            if (!lastStakeTimestamp) {
                console.error("lastStakeTimestamp is undefined or invalid");
                setCountdownTime("Unavailable");
                return;
            }

            const lockPeriod = 7 * 24 * 60 * 60; 
            const unlockTime = lastStakeTimestamp + lockPeriod;
            

            const updateCountdown = () => {
                const now = Math.floor(Date.now() / 1000); 
                const distance = unlockTime - now;

                if (distance <= 0) {
                    setCountdownTime("Unlocked");
                    setTimePercent(100);
                    return;
                }

                
                const days = Math.floor(distance / (24 * 60 * 60));
                const hours = Math.floor((distance % (24 * 60 * 60)) / (60 * 60));
                const minutes = Math.floor((distance % (60 * 60)) / 60);
                const seconds = distance % 60;

                
                setCountdownTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);

                
                const elapsed = lockPeriod - distance;
                const percentComplete = (elapsed / lockPeriod) * 100;
                setTimePercent(percentComplete);
            };

            
            updateCountdown();

            
            const interval = setInterval(updateCountdown, 1000);

            
            return () => clearInterval(interval);
        } else {
            setCountdownTime("No active stake");
            setTimePercent(0);
        }
    }, [userStakePosition]);

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Protocol Stats</h3>
                
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Total Staked</span>
                        <span className="font-medium">{totalStaked.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-gray-400">Current APR</span>
                        <span className="font-medium text-green-400">{apr || "0"}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-gray-400">Total Users</span>
                        <span className="font-medium">{totalUsers}</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Stake</span>
                        <span className="font-medium">{avgStake.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-gray-400">Pending Rewards</span>
                        <span className="font-medium text-green-400">{totalPendingRewards.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="border-t border-gray-700 my-2"></div>
                    
                    {/* <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Time until unlock</span>
                            <span className="font-medium">{countdownTime}</span>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${timePercent}%` }}></div>
                        </div>
                    </div> */}
                </div>
            </div>
            
            {/* Other sections remain unchanged */}
        </div>
    );
};