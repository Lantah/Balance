import React from "react"
import { useTranslation } from "react-i18next"
import { Account } from "~App/contexts/accounts"
import MainTitle from "~Generic/components/MainTitle"
import DialogBody from "~Layout/components/DialogBody"
import GramPurchaseOptions from "./GramPurchaseOptions"

interface Props {
  account: Account
  onClose: () => void
}

function GramPurchaseDialog(props: Props) {
  const { t } = useTranslation()
  return (
    <DialogBody top={<MainTitle onBack={props.onClose} title={t("account.purchase-grams.title")} />}>
      <GramPurchaseOptions account={props.account} onCloseDialog={props.onClose} />
    </DialogBody>
  )
}

export default React.memo(GramPurchaseDialog)
