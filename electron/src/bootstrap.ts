import { app } from "electron"

// Quick-fix for "io.solarwallet.app" being shown in Mac app menu
app.name = "Lantah Balance"

// Needs to match the value in electron-build.yml
app.setAppUserModelId("io.lantahbalance.app")

// Disabled until we actually ship SEP-7 support
// app.setAsDefaultProtocolClient("web+stellar")
