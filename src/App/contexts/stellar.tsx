import React from "react"
import { useNetworkCacheReset } from "~Generic/hooks/stellar-subscriptions"
import { workers } from "~Workers/worker-controller"
import { trackError } from "./notifications"

interface Props {
  children: React.ReactNode
}

interface ContextType {
  isSelectionPending: boolean
  pendingSelection: Promise<any>
  pubnetHorizonURLs: string[]
  testnetHorizonURLs: string[]
}

const initialHorizonSelection: Promise<[string[], string[]]> = (async () => {
  const { netWorker } = await workers

  const pubnetHorizonURLs: string[] = Array.from(
    new Set(
      await Promise.all([
        "https://orbitr.lantah.network",
        netWorker.checkHorizonOrFailover("https://orbitr.lantah.network", "https://orbitr.lantah.network"),
        netWorker.checkHorizonOrFailover("https://orbitr.lantah.network", "https://orbitr.lantah.network")
      ])
    )
  )

  const testnetHorizonURLs: string[] = ["https://orbitr-testnet.lantah.network"]

  return Promise.all([pubnetHorizonURLs, testnetHorizonURLs])
})()

initialHorizonSelection.catch(trackError)

const initialValues: ContextType = {
  isSelectionPending: true,
  pendingSelection: initialHorizonSelection,
  pubnetHorizonURLs: ["https://orbitr.lantah.network"],
  testnetHorizonURLs: ["https://orbitr-testnet.lantah.network/"]
}

const StellarContext = React.createContext<ContextType>(initialValues)

export function StellarProvider(props: Props) {
  const [contextValue, setContextValue] = React.useState<ContextType>(initialValues)
  const resetNetworkCaches = useNetworkCacheReset()

  React.useEffect(() => {
    let cancelled = false

    const init = async () => {
      const { netWorker } = await workers

      setContextValue(prevState => ({ ...prevState, pendingSelection: initialHorizonSelection }))
      const [pubnetHorizonURLs, testnetHorizonURLs] = await initialHorizonSelection

      if (!cancelled) {
        setContextValue(prevState => ({
          isSelectionPending: false,
          pendingSelection: prevState.pendingSelection,
          pubnetHorizonURLs:
            pubnetHorizonURLs !== prevState.pubnetHorizonURLs ? pubnetHorizonURLs : prevState.pubnetHorizonURLs,
          testnetHorizonURLs:
            testnetHorizonURLs !== prevState.testnetHorizonURLs ? testnetHorizonURLs : prevState.testnetHorizonURLs
        }))

        if (
          pubnetHorizonURLs !== initialValues.pubnetHorizonURLs ||
          testnetHorizonURLs !== initialValues.testnetHorizonURLs
        ) {
          await netWorker.resetAllSubscriptions()
          resetNetworkCaches()
        }

        // tslint:disable-next-line no-console
        console.debug(`Selected horizon servers:`, { pubnetHorizonURLs, testnetHorizonURLs })
      }
    }

    if (navigator.onLine !== false) {
      init().catch(trackError)
    }

    const unsubscribe = () => {
      cancelled = true
    }
    return unsubscribe
  }, [resetNetworkCaches])

  return <StellarContext.Provider value={contextValue}>{props.children}</StellarContext.Provider>
}

export { ContextType as StellarContextType, StellarContext }
