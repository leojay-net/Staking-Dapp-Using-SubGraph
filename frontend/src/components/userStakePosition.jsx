import { useStake } from "../hooks/useStake";

export const UserStakePosition = () => {
  const { userStakePosition } = useStake();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Stake Position</h2>
      {userStakePosition.map((stake) => (
        <div key={stake.user.id} className="space-y-2">
          <p>Total Staked: {stake.user.totalStaked}</p>
          <p>Pending Rewards: {stake.user.pendingRewards}</p>
          <p>Last Stake: {new Date(stake.user.lastStakeTimestamp * 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};