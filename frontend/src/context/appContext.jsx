import { Contract } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { getReadOnlyProvider } from "../config/adapter";
import Staking_ABI from "../config/ABI/staking.json";
import Token_ABI from "../config/ABI/token.json";
import { useAccount } from "wagmi";
import { STAKING_CONTRACT_ADDRESS } from "../config/require.config";
import request, { gql } from "graphql-request";
import graphql from "../utils/graphql";
import { useStake } from "../hooks/useStake";
import { calculateTimeUntilUnlock } from "../utils/calculateTimeUntilUnlock";

const appContext = createContext();

export const useAppContext = () => {
    const context = useContext(appContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }

    return context;

};



export const AppProvider = ({ children }) => {
    const {address} = useAccount() 
       const [apr, setApr] = useState(0);
       const { userStakePosition } = useStake()

       const url = import.meta.env.VITE_SUBGRAPH_API_URL
        const api_key = import.meta.env.VITE_SUBGRAPH_API_KEY
        const headers = { Authorization: `Bearer ${api_key}` }
    

    useEffect(() => {
        // const query = gql`
        // {
        //     users(first: 1) {
        //       currentRewardRate
        //     }
        //   }
        // ` 
        // async() => {
        //     const result = await graphql(query)
        //     const _apr = JSON.parse(result).users[0].currentRewardRate 
        //     console.log("APR: ", _apr)
        //     setApr(_apr)
        // }

        if (userStakePosition.length > 0) {
            const lastStakeTimestamp = userStakePosition[0].user.lastStakeTimestamp;


            calculateTimeUntilUnlock(lastStakeTimestamp)

            return () => clearInterval(interval);
        
    }}, [address])

    

    // useEffect(() => {
    //     if (userStakePosition.length > 0) {
    //         const lastStakeTimestamp = userStakePosition[0].user.lastStakeTimestamp;
    
    //         const stakingContract = new Contract(
    //             STAKING_CONTRACT_ADDRESS,
    //             Staking_ABI,
    //             getReadOnlyProvider()
    //         );
         
    //         const updateUnlockTime = () => {
    //             setTimeUntilUnlock(calculateTimeUntilUnlock(lastStakeTimestamp));
    //         };
         
    //         updateUnlockTime();
    
    //         const handleStakedEvent = () => {
    //             console.log("New stake detected. Recalculating unlock time...");
    //             updateUnlockTime();
    //         };
      
    //         stakingContract.on("Staked", handleStakedEvent);
     
    //         return () => {
    //             stakingContract.off("Staked", handleStakedEvent);
    //         };
    //     }
    // }, [userStakePosition, calculateTimeUntilUnlock]);

    // useEffect(() => {
    //     if (userStakePosition.length > 0) {
    //         const lastStakeTimestamp = userStakePosition[0].user.lastStakeTimestamp;
            
    //         const updateUnlockTime = () => {
    //             setTimeUntilUnlock(calculateTimeUntilUnlock(lastStakeTimestamp));
    //         };
            
    //         updateUnlockTime();
    
            
    //         const interval = setInterval(updateUnlockTime, 1000);
    
            
    //         return () => clearInterval(interval);
    //     }
    // }, [userStakePosition, calculateTimeUntilUnlock]);
 



  
    return (
        <appContext.Provider
            value={{
                address,
                setApr
            }}
        >
            {children}
        </appContext.Provider>
    );
};
