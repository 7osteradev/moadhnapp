package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx             context.Context
	client          *http.Client
	minimizeOnClose bool
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		client: &http.Client{
			Timeout: 15 * time.Second,
		},
		minimizeOnClose: true, // Always minimize to tray instead of closing
	}
}

// startup is called when the app starts
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	// Load saved settings
	data, err := os.ReadFile(a.getSettingsPath())
	if err == nil {
		var s map[string]interface{}
		if json.Unmarshal(data, &s) == nil {
			if v, ok := s["minimizeOnClose"]; ok {
				if b, ok := v.(bool); ok {
					a.minimizeOnClose = b
				}
			}
		}
	}

	// Ensure the main window is visible on app launch.
	wailsRuntime.WindowShow(ctx)
	wailsRuntime.WindowUnminimise(ctx)
	wailsRuntime.WindowSetAlwaysOnTop(ctx, false)
}

// beforeClose is called when the user tries to close the window
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	if a.minimizeOnClose {
		wailsRuntime.WindowHide(ctx)
		return true // prevent close, hide instead
	}
	return false // allow close
}

// HideMainWindow hides the window to tray
func (a *App) HideMainWindow() {
	wailsRuntime.WindowHide(a.ctx)
}

// ============ Settings Persistence ============

func (a *App) getSettingsPath() string {
	appData := os.Getenv("APPDATA")
	dir := filepath.Join(appData, "moadhnapp")
	os.MkdirAll(dir, 0755)
	return filepath.Join(dir, "settings.json")
}

func (a *App) SaveSettings(settingsJSON string) error {
	// Update local minimizeOnClose flag
	var s map[string]interface{}
	if json.Unmarshal([]byte(settingsJSON), &s) == nil {
		if v, ok := s["minimizeOnClose"]; ok {
			if b, ok := v.(bool); ok {
				a.minimizeOnClose = b
			}
		}
	}
	return os.WriteFile(a.getSettingsPath(), []byte(settingsJSON), 0644)
}

func (a *App) LoadSettings() string {
	data, err := os.ReadFile(a.getSettingsPath())
	if err != nil {
		return "{}"
	}
	return string(data)
}

// ============ Startup on Boot ============

func (a *App) SetStartupOnBoot(enable bool) error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}
	if enable {
		cmd := exec.Command("reg", "add",
			`HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`,
			"/v", "MoadhnApp",
			"/t", "REG_SZ",
			"/d", exePath,
			"/f")
		return cmd.Run()
	}
	cmd := exec.Command("reg", "delete",
		`HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`,
		"/v", "MoadhnApp",
		"/f")
	cmd.Run()
	return nil
}

func (a *App) IsStartupOnBoot() bool {
	cmd := exec.Command("reg", "query",
		`HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`,
		"/v", "MoadhnApp")
	err := cmd.Run()
	return err == nil
}

// ============ Window Management ============

func (a *App) ShowMainWindow() {
	if a.ctx == nil {
		return
	}
	wailsRuntime.WindowSetSize(a.ctx, 1024, 768)
	wailsRuntime.WindowShow(a.ctx)
	wailsRuntime.WindowUnminimise(a.ctx)
	wailsRuntime.WindowSetAlwaysOnTop(a.ctx, false)
}

func (a *App) ShowAdhanWindow() {
	if a.ctx == nil {
		return
	}
	// Small window for Adhan
	wailsRuntime.WindowSetSize(a.ctx, 420, 460)
	wailsRuntime.WindowCenter(a.ctx)
	wailsRuntime.WindowShow(a.ctx)
	wailsRuntime.WindowSetAlwaysOnTop(a.ctx, true)
}


func (a *App) MinimizeMainWindow() {
	if a.ctx == nil {
		return
	}
	wailsRuntime.WindowMinimise(a.ctx)
}

func (a *App) ToggleMaximize() {
	if a.ctx == nil {
		return
	}
	if wailsRuntime.WindowIsMaximised(a.ctx) {
		wailsRuntime.WindowUnmaximise(a.ctx)
	} else {
		wailsRuntime.WindowMaximise(a.ctx)
	}
}

func (a *App) CloseWindow() {
	if a.ctx == nil {
		return
	}
	// If minimize on close is enabled, hide the window instead of quitting
	if a.minimizeOnClose {
		wailsRuntime.WindowHide(a.ctx)
	} else {
		wailsRuntime.Quit(a.ctx)
	}
}

func (a *App) QuitApp() {
	if a.ctx == nil {
		os.Exit(0)
		return
	}
	a.minimizeOnClose = false
	wailsRuntime.Quit(a.ctx)
}

// ============ Prayer Times API ============

type PrayerTimesResult struct {
	Fajr       string `json:"fajr"`
	Dhuhr      string `json:"dhuhr"`
	Asr        string `json:"asr"`
	Maghrib    string `json:"maghrib"`
	Isha       string `json:"isha"`
	HijriDay   string `json:"hijriDay"`
	HijriMonth string `json:"hijriMonth"`
	HijriYear  string `json:"hijriYear"`
}

type LocationResult struct {
	City      string  `json:"city"`
	Country   string  `json:"country"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type aladhanResponse struct {
	Code int `json:"code"`
	Data struct {
		Timings struct {
			Fajr    string `json:"Fajr"`
			Dhuhr   string `json:"Dhuhr"`
			Asr     string `json:"Asr"`
			Maghrib string `json:"Maghrib"`
			Isha    string `json:"Isha"`
		} `json:"timings"`
		Date struct {
			Hijri struct {
				Day   string `json:"day"`
				Month struct {
					Ar string `json:"ar"`
				} `json:"month"`
				Year string `json:"year"`
			} `json:"hijri"`
		} `json:"date"`
	} `json:"data"`
}

type geoResponse struct {
	City        string `json:"city"`
	Locality    string `json:"locality"`
	CountryName string `json:"countryName"`
}

func (a *App) PickAdhanFile() (string, error) {
	file, err := wailsRuntime.OpenFileDialog(a.ctx, wailsRuntime.OpenDialogOptions{
		Title: "اختر ملف الأذان (MP3)",
		Filters: []wailsRuntime.FileFilter{
			{DisplayName: "Audio Files (*.mp3;*.wav)", Pattern: "*.mp3;*.wav"},
		},
	})
	if err != nil {
		return "", err
	}
	return file, nil
}

func (a *App) GetPrayerTimes(latitude float64, longitude float64, method int) (*PrayerTimesResult, error) {
	url := fmt.Sprintf(
		"https://api.aladhan.com/v1/timings?latitude=%f&longitude=%f&method=%d",
		latitude, longitude, method,
	)
	resp, err := a.client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("فشل في الاتصال بالخادم: %v", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("فشل في قراءة الاستجابة: %v", err)
	}
	var data aladhanResponse
	if err := json.Unmarshal(body, &data); err != nil {
		return nil, fmt.Errorf("فشل في تحليل البيانات: %v", err)
	}
	if data.Code != 200 {
		return nil, fmt.Errorf("الخادم أرجع استجابة غير صحيحة")
	}
	return &PrayerTimesResult{
		Fajr:       data.Data.Timings.Fajr,
		Dhuhr:      data.Data.Timings.Dhuhr,
		Asr:        data.Data.Timings.Asr,
		Maghrib:    data.Data.Timings.Maghrib,
		Isha:       data.Data.Timings.Isha,
		HijriDay:   data.Data.Date.Hijri.Day,
		HijriMonth: data.Data.Date.Hijri.Month.Ar,
		HijriYear:  data.Data.Date.Hijri.Year,
	}, nil
}

func (a *App) GetLocationInfo(latitude float64, longitude float64) (*LocationResult, error) {
	url := fmt.Sprintf(
		"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=%f&longitude=%f&localityLanguage=ar",
		latitude, longitude,
	)
	resp, err := a.client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var data geoResponse
	if err := json.Unmarshal(body, &data); err != nil {
		return nil, err
	}
	city := data.City
	if city == "" {
		city = data.Locality
	}
	if city == "" {
		city = "غير معروف"
	}
	country := data.CountryName
	if country == "" {
		country = "غير معروف"
	}
	return &LocationResult{
		City:      city,
		Country:   country,
		Latitude:  latitude,
		Longitude: longitude,
	}, nil
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
