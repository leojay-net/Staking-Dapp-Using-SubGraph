// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { ConnectButton } from './components/connectButton'
// import { StakeForm } from './components/stakeForm'
// import { ClaimReward } from './components/claimReward'
// import { WidrawForm } from './components/withdraw'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//      <ConnectButton />
//      <StakeForm />
//      <ClaimReward />
//      <WidrawForm />
//     </>
//   )
// }

// export default App

import { useState } from 'react';
import './App.css';
import { ConnectButton } from './components/connectButton';
import { StakeForm } from './components/stakeForm';
import { ClaimReward } from './components/claimReward';
import { WithdrawForm } from './components/withdraw';
import { StatsPanel } from './components/statsPanel'; // Added component for protocol stats
import { EmergencyWithdraw } from './components/emergencyWithdraw'; // Added component for emergency withdrawal

function App() {
  const [activeTab, setActiveTab] = useState('stake');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">StakeX Protocol</h1>
          </div>
          <ConnectButton />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex border-b border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('stake')}
                className={`px-4 py-3 font-medium ${
                  activeTab === 'stake' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'
                }`}
              >
                Stake
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`px-4 py-3 font-medium ${
                  activeTab === 'withdraw' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'
                }`}
              >
                Withdraw
              </button>
              <button
                onClick={() => setActiveTab('claim')}
                className={`px-4 py-3 font-medium ${
                  activeTab === 'claim' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'
                }`}
              >
                Claim Rewards
              </button>
              <button
                onClick={() => setActiveTab('emergency')}
                className={`px-4 py-3 font-medium ${
                  activeTab === 'emergency' ? 'border-b-2 border-red-500 text-red-400' : 'text-gray-400'
                }`}
              >
                Emergency
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'stake' && <StakeForm />}
              {activeTab === 'withdraw' && <WithdrawForm />}
              {activeTab === 'claim' && <ClaimReward />}
              {activeTab === 'emergency' && <EmergencyWithdraw />}
            </div>
          </div>

          <div>
            <StatsPanel />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;