
export const calculateTimeUntilUnlock = (lastStakeTimestamp) => {
        const lockPeriod = 1 * 24 * 60 * 60; // 7 days in seconds
        const unlockTime = lastStakeTimestamp + lockPeriod;
        const now = Math.floor(Date.now() / 1000); // Current time in seconds

        if (now >= unlockTime) {
            return "Unlocked";
        }

        const remainingTime = unlockTime - now;
        const days = Math.floor(remainingTime / (24 * 60 * 60));
        const hours = Math.floor((remainingTime % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
        const seconds = remainingTime % 60;

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };