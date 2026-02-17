package main

import (
	"github.com/getlantern/systray"
)

func setupSystray(app *App) {
	// Start Systray in a goroutine
	go func() {
		systray.Run(func() {
			systray.SetIcon(iconData)
			systray.SetTitle("Moadhn")
			systray.SetTooltip("Moadhn - مؤذن")

			mShow := systray.AddMenuItem("فتح التطبيق - Open", "Show the main window")
			systray.AddSeparator()
			mQuit := systray.AddMenuItem("إغلاق نهائياً - Quit", "Quit the application")

			// Handle menu actions
			go func() {
				for {
					select {
					case <-mShow.ClickedCh:
						app.ShowMainWindow()
					case <-mQuit.ClickedCh:
						app.QuitApp()
					}
				}
			}()
		}, func() {
			// On exit logic if needed
		})
	}()
}
