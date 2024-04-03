import { web3 } from '@project-serum/anchor'
import { unstakeBanxNft } from 'fbonds-core/lib/fbond-protocol/functions/banxStaking/banxTokenStaking'
import { CreateTransactionDataFn } from 'solana-transactions-executor'

import { BONDS } from '@banx/constants'
import { PriorityLevel, createPriorityFeesInstruction } from '@banx/store'
import { sendTxnPlaceHolder } from '@banx/utils'

export type UnstakeBanxNftsActionParams = {
  userPubkey: web3.PublicKey
  nftMint: string
  nftStakePublicKey: string
  priorityFeeLevel: PriorityLevel
}

export type UnstakeBanxNftsActionAction = CreateTransactionDataFn<UnstakeBanxNftsActionParams, null>

export const unstakeBanxNftsAction: UnstakeBanxNftsActionAction = async (
  ixnParams,
  { wallet, connection },
) => {
  const { instructions, signers } = await unstakeBanxNft({
    connection,
    programId: new web3.PublicKey(BONDS.PROGRAM_PUBKEY),
    addComputeUnits: true,
    accounts: {
      userPubkey: wallet.publicKey,
      tokenMint: new web3.PublicKey(ixnParams.nftMint),
      banxStake: new web3.PublicKey(ixnParams.nftStakePublicKey),
    },
    sendTxn: sendTxnPlaceHolder,
  })

  const priorityFeeInstruction = await createPriorityFeesInstruction(
    instructions,
    connection,
    ixnParams.priorityFeeLevel,
  )

  return {
    instructions: [...instructions, priorityFeeInstruction],
    signers: signers,
    lookupTables: [],
  }
}
