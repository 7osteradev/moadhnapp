package main

import (
	"embed"
	"net/http"

	"github.com/getlantern/systray"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/windows/icon.ico
var iconData []byte

func main() {
	app := NewApp()

	// Start Systray in a goroutine
	// This adds the application to the system tray (hidden icons area) on Windows
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

	err := wails.Run(&options.App{
		Title:  "مؤذن - Moadhn",
		Width:  1000,
		Height: 600,
		MinWidth:  400,
		MinHeight: 500,
		Frameless: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
			Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if len(r.URL.Path) > 12 && r.URL.Path[:12] == "/local-file/" {
					filePath := r.URL.Path[12:]
					if filePath[0] == '/' && filePath[2] == ':' {
						filePath = filePath[1:]
					}
					http.ServeFile(w, r, filePath)
					return
				}
				http.NotFound(w, r)
			}),
		},
		OnStartup:     app.startup,
		OnBeforeClose: app.beforeClose,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
