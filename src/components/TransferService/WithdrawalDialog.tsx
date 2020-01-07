import React from "react"
import { Asset, Server, Transaction } from "stellar-sdk"
import { Account } from "../../context/accounts"
import { trackError } from "../../context/notifications"
import { useLiveAccountData } from "../../hooks/stellar-subscriptions"
import { useDialogActions } from "../../hooks/userinterface"
import { AccountData } from "../../lib/account"
import { getAssetsFromBalances } from "../../lib/stellar"
import DialogBody from "../Dialog/DialogBody"
import TestnetBadge from "../Dialog/TestnetBadge"
import { Box } from "../Layout/Box"
import ScrollableBalances from "../Lazy/ScrollableBalances"
import withFallback from "../Lazy/withFallback"
import MainTitle from "../MainTitle"
import TransactionSender from "../TransactionSender"
import ViewLoading from "../ViewLoading"

const WithdrawalDialogForm = withFallback(React.lazy(() => import("./WithdrawalDialogForm")), <ViewLoading />)

interface Props {
  account: Account
  accountData: AccountData
  horizon: Server
  onClose: () => void
  sendTransaction: (transaction: Transaction) => Promise<any>
}

const WithdrawalDialog = React.memo(function WithdrawalDialog(props: Props) {
  const dialogActionsRef = useDialogActions()

  const handleSubmit = React.useCallback(
    async (createTx: (horizon: Server, account: Account) => Promise<Transaction>) => {
      try {
        const tx = await createTx(props.horizon, props.account)
        await props.sendTransaction(tx)
      } catch (error) {
        trackError(error)
      }
    },
    [props.account, props.horizon]
  )

  const trustedAssets = React.useMemo(() => getAssetsFromBalances(props.accountData.balances) || [Asset.native()], [
    props.accountData.balances
  ])

  return (
    <DialogBody
      top={
        <>
          <MainTitle
            title={
              <span>Withdraw funds {props.account.testnet ? <TestnetBadge style={{ marginLeft: 8 }} /> : null}</span>
            }
            onBack={props.onClose}
          />
          <ScrollableBalances account={props.account} compact />
        </>
      }
      actions={dialogActionsRef}
    >
      <Box margin="24px 0 0">{null}</Box>
      <WithdrawalDialogForm
        account={props.account}
        actionsRef={dialogActionsRef}
        assets={trustedAssets.filter(asset => !asset.isNative())}
        horizon={props.horizon}
        onSubmit={handleSubmit}
        testnet={props.account.testnet}
      />
    </DialogBody>
  )
})

function ConnectedWithdrawalDialog(props: Pick<Props, "account" | "onClose">) {
  const accountData = useLiveAccountData(props.account.publicKey, props.account.testnet)
  const closeAfterTimeout = React.useCallback(() => {
    // Close automatically a second after successful submission
    setTimeout(() => props.onClose(), 1000)
  }, [props.onClose])

  return (
    <TransactionSender account={props.account} onSubmissionCompleted={closeAfterTimeout}>
      {({ horizon, sendTransaction }) => (
        <WithdrawalDialog {...props} accountData={accountData} horizon={horizon} sendTransaction={sendTransaction} />
      )}
    </TransactionSender>
  )
}

export default ConnectedWithdrawalDialog
