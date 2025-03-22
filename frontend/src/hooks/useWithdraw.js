import { Contract, formatUnits } from "ethers"
import { getEthersSigner, getReadOnlyProvider } from "../config/adapter"
import { useAccount, useChainId, useConfig } from "wagmi"
import { STAKING_CONTRACT_ADDRESS } from "../config/require.config"
import Staking_ABI from "../config/ABI/staking.json";
import { gql } from "graphql-request";



export const useWithdraw = () => {

    const { address } = useAccount()
        const chainId = useChainId()
    
        const wagmiConfig = useConfig()

        const query = gql`{
            users(first: 5) {
              id
              staked
              rewards
              pendingRewards
            }
            emergencyWithdrawns(first: 5) {
              id
              user {
                id
              }
              amount
              penalty
            }
          }`
    

    const handleWithdraw = async (e, amount, emergency=false) => {
        e.preventDefault();
        if (!address) return alert("Please connect your wallet");
        if (amount <= 0) return alert("Invalid amount");

        const signer = await getEthersSigner(wagmiConfig, { chainId })
        console.log("signer: ", signer)

        const stakingContract = new Contract(
            STAKING_CONTRACT_ADDRESS,
            Staking_ABI,
            signer
        )

        if (emergency) {
            try {
                const tx = await stakingContract.emergencyWithdraw();
                const receipt = await tx.wait();
                if (receipt.status === 0) {
                    throw new Error("Transaction failed");
                }
    
                alert("Withdraw successfull");
                return;
            } catch (error) {
                console.error("error: ", error);
            }

        }

        try {
            const tx = await stakingContract.withdraw(amount);
            const receipt = await tx.wait();
            if (receipt.status === 0) {
                throw new Error("Transaction failed");
            }

            alert("Withdraw successfull");
        } catch (error) {
            console.error("error: ", error);
        }
    }

    

    return { handleWithdraw }
}