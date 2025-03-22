import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { User } from "../generated/schema"

export function getOrCreateUser(address: Bytes): User {
  let user = User.load(address)

  if (user == null) {
    user = new User(address)
    user.staked = BigInt.fromI32(0)
    user.rewards = BigInt.fromI32(0)
    user.pendingRewards = BigInt.fromI32(0)
    user.totalStaked = BigInt.fromI32(0)
    user.totalWithdrawn = BigInt.fromI32(0)
    user.totalRewardsClaimed = BigInt.fromI32(0)
    user.lastStakeTimestamp = BigInt.fromI32(0)
    user.lastWithdrawTimestamp = BigInt.fromI32(0)
    user.lastClaimTimestamp = BigInt.fromI32(0)
    user.lastEmergencyWithdrawTimestamp = BigInt.fromI32(0)
    user.lastPenaltyTimestamp = BigInt.fromI32(0)
    user.currentRewardRate = BigInt.fromI32(0)

    user.save()
  }
  return user as User
}