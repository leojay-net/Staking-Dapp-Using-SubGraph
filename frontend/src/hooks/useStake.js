import { Contract, parseUnits } from "ethers";
import { getEthersSigner } from "../config/adapter";
import { useAccount, useChainId, useConfig } from "wagmi";
import Staking_ABI from "../config/ABI/staking.json";
import Token_ABI from "../config/ABI/token.json";
import { STAKING_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../config/require.config";

import { useState, useEffect, useCallback } from "react";
import { gql } from "graphql-request";
import graphql from "../utils/graphql";
import { useAppContext } from "../context/appContext";

export const useStake = () => {
    const { address } = useAccount();
    const chainId = useChainId();
    const [stakePositions, setStakePositions] = useState([]);
    const [userStakePosition, setUserStakePosition] = useState([]);
    const wagmiConfig = useConfig();
    const [apr, setApr] = useState(0)
    

    const fetchStakeData = useCallback(async () => {
        const query_apr = gql`
                {
                    users(first: 1) {
                      currentRewardRate
                    }
                  }
                ` 
        
        const query_all = gql`{
            stakeds {
                user {
                    id
                    currentRewardRate
                    lastClaimTimestamp
                    totalRewardsClaimed
                    totalStaked
                    pendingRewards
                    totalWithdrawn
                    lastStakeTimestamp
                    currentRewardRate
                }
            }
        }`;

        const query_user = gql`{
            stakeds {
                user {
                    id
                    currentRewardRate
                    lastClaimTimestamp
                    totalRewardsClaimed
                    totalStaked
                    pendingRewards
                    totalWithdrawn
                    lastStakeTimestamp
                    currentRewardRate
                }
            }
        }`;


        try {
            const _allPositions = await graphql(query_all); 
            const _userPosition = await graphql(query_user);
            const _apr = await graphql(query_apr)


            console.log("APR: ", JSON.parse(_apr).users[0].currentRewardRate)

            setApr(JSON.parse(_apr).users[0].currentRewardRate )


            console.log("Stake data: ", JSON.parse(_allPositions).stakeds);
            setStakePositions(JSON.parse(_allPositions).stakeds);

            console.log("Stake USER data: ", JSON.parse(_userPosition).stakeds);
            setUserStakePosition(JSON.parse(_userPosition).stakeds);

        } catch (error) {
            console.error("Failed to fetch stake data: ", error);
        }
    }, [address]);

    useEffect(() => {
        fetchStakeData();
    }, [fetchStakeData]);

    const handleStaking = useCallback(async (e, amount) => {
        e.preventDefault();
        if (!address) return alert("Please connect your wallet");
        if (amount <= 0) return alert("Invalid amount");

        const signer = await getEthersSigner(wagmiConfig, { chainId });
        const stakingContract = new Contract(STAKING_CONTRACT_ADDRESS, Staking_ABI, signer);
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, Token_ABI, signer);

        try {
            await tokenContract.approve(STAKING_CONTRACT_ADDRESS, parseUnits(amount, 18));
            const tx = await stakingContract.stake(parseUnits(amount, 18));
            const receipt = await tx.wait();
            if (receipt.status === 0) throw new Error("Transaction failed");
            alert("Staked successfully");
        } catch (error) {
            console.error("error: ", error);
        }
    }, [address, chainId, wagmiConfig]);

    return { stakePositions, userStakePosition, apr, handleStaking };
};