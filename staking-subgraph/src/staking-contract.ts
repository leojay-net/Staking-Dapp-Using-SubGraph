import { BigInt } from "@graphprotocol/graph-ts"
import {
  EmergencyWithdrawn as EmergencyWithdrawnEvent,
  RewardRateUpdated as RewardRateUpdatedEvent,
  RewardsClaimed as RewardsClaimedEvent,
  Staked as StakedEvent,
  TokenRecovered as TokenRecoveredEvent,
  Withdrawn as WithdrawnEvent
} from "../generated/StakingContract/StakingContract"
import {
  EmergencyWithdrawn,
  RewardRateUpdated,
  RewardsClaimed,
  Staked,
  TokenRecovered,
  Withdrawn,
  User
} from "../generated/schema"
import { getOrCreateUser } from "./utils"



export function handleEmergencyWithdrawn(event: EmergencyWithdrawnEvent): void {
  const user = getOrCreateUser(event.params.user)
  user.staked = BigInt.fromI32(0)
  user.lastEmergencyWithdrawTimestamp = event.params.timestamp
  user.lastPenaltyTimestamp = event.params.timestamp
  user.totalWithdrawn = user.totalWithdrawn.plus(event.params.amount)


  let entity = new EmergencyWithdrawn(
    event.transaction.hash
  )
  entity.user = user.id
  entity.amount = event.params.amount
  entity.penalty = event.params.penalty
  entity.timestamp = event.params.timestamp
  entity.newTotalStaked = event.params.newTotalStaked

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp

  user.save()
  entity.save()
}

export function handleRewardRateUpdated(event: RewardRateUpdatedEvent): void {
  const user = getOrCreateUser(event.transaction.from)
  user.currentRewardRate = event.params.newRate


  let entity = new RewardRateUpdated(
    event.transaction.hash
  )
  entity.oldRate = event.params.oldRate
  entity.newRate = event.params.newRate
  entity.timestamp = event.params.timestamp
  entity.totalStaked = event.params.totalStaked

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp

  user.save()
  entity.save()
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  const user = getOrCreateUser(event.params.user)
  user.rewards = user.rewards.plus(event.params.amount)
  user.pendingRewards = event.params.newPendingRewards
  user.lastClaimTimestamp = event.params.timestamp
  user.totalRewardsClaimed = user.totalRewardsClaimed.plus(event.params.amount)



  let entity = new RewardsClaimed(
    event.transaction.hash
  )
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp
  entity.newPendingRewards = event.params.newPendingRewards

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  user.save()
  entity.save()
}

export function handleStaked(event: StakedEvent): void {
  const user = getOrCreateUser(event.params.user)
  user.staked = user.staked.plus(event.params.amount)
  user.totalStaked = user.totalStaked.plus(event.params.newTotalStaked)
  user.lastStakeTimestamp = event.params.timestamp
  user.currentRewardRate = event.params.currentRewardRate


  let entity = new Staked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp
  entity.newTotalStaked = event.params.newTotalStaked
  entity.currentRewardRate = event.params.currentRewardRate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp

  user.save()
  entity.save()
}


export function handleTokenRecovered(event: TokenRecoveredEvent): void {
  let entity = new TokenRecovered(
    event.transaction.hash
  )
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp

  entity.save()
}


export function handleWithdrawn(event: WithdrawnEvent): void {

  const user = getOrCreateUser(event.params.user)
  user.staked = user.staked.minus(event.params.amount)
  user.totalWithdrawn = user.totalWithdrawn.plus(event.params.amount)
  user.lastWithdrawTimestamp = event.params.timestamp
  user.currentRewardRate = event.params.currentRewardRate
  user.pendingRewards = event.params.rewardsAccrued
  

  let entity = new Withdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp
  entity.newTotalStaked = event.params.newTotalStaked
  entity.currentRewardRate = event.params.currentRewardRate
  entity.rewardsAccrued = event.params.rewardsAccrued

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  user.save()
  entity.save()
}
