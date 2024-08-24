import React from "react"
import { useTranslation } from "react-i18next"
import GramDepositOptions from "~GramPurchase/components/GramPurchaseOptions"
import { VerticalLayout } from "~Layout/components/Box"
import { DepositContext } from "./DepositProvider"
import { Paragraph, Summary } from "./Sidebar"

interface PurchaseGramsProps {
  onCloseDialog: () => void
}

function PurchaseGrams(props: PurchaseGramsProps) {
  const { account } = React.useContext(DepositContext)

  return (
    <VerticalLayout alignItems="center" textAlign="center">
      <GramDepositOptions account={account} onCloseDialog={props.onCloseDialog} />
    </VerticalLayout>
  )
}

const Sidebar = () => {
  const { t } = useTranslation()
  return (
    <Summary headline={t("transfer-service.purchase-grams.sidebar.headline")}>
      <Paragraph>{t("transfer-service.purchase-grams.sidebar.info.1")}</Paragraph>
      <Paragraph>{t("transfer-service.purchase-grams.sidebar.info.2")}</Paragraph>
    </Summary>
  )
}
const PurchaseGramsView = Object.assign(React.memo(PurchaseGrams), { Sidebar })

export default PurchaseGramsView
