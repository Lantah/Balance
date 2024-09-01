import { app } from "electron"

// Quick-fix for "io.lantahbalance.app" being shown in Mac app menu
app.name = "Balance"

// Needs to match the value in electron-build.yml
app.setAppUserModelId("io.lantahbalance.app")

// Disabled until we actually ship SEP-7 support
// app.setAsDefaultProtocolClient("web+stellar")
