# Moadhn App - تطبيق مؤذن

![Moadhn App Banner](https://cdn.discordapp.com/attachments/1354008723705565185/1520402108590067722/image.png?ex=6a41104e&is=6a3fbece&hm=d2be4f965db87fcecb030d583612e68e6a58c9c3c4253a4691f576cb13d36cce&)

A modern, elegant, and cross-platform desktop application for Islamic prayer times and Adhan notifications. Built with **Go (Wails)** and **React**.

## ✨ Features

- **📍 Automatic Location Detection**: Automatically detects your city and country to provide accurate prayer times.
- **🕌 Accurate Prayer Times**: Uses the [Aladhan API](https://aladhan.com/prayer-times-api) with support for multiple calculation methods (MWL, ISNA, Umm Al-Qura, etc.).
- **🔊 Adhan Notifications**: Plays full Adhan audio at prayer times with a beautiful, dedicated popup window.
- **🎨 Modern UI/UX**: Sleek, responsive design with Dark/Light mode support, glassmorphism effects, and smooth animations.
- **⚙️ Customizable Settings**:
  - Choose your preferred Adhan audio (MP3 support).
  - Adjust volume.
  - Toggle startup on boot.
  - Switch between Arabic and English languages.
  - Select calculation methods.
- **📉 System Tray Integration**: Minimizes quietly to the system tray, running in the background to never miss a prayer.
- **⏱️ Next Prayer Countdown**: Visual countdown timer and progress bar for the upcoming prayer.

## 🛠️ Tech Stack

- **Backend**: [Go](https://go.dev/) (Golang)
- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Desktop Framework**: [Wails v2](https://wails.io/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- **Go**: Version 1.21 or later.
- **Node.js**: Version 18 or later.
- **Wails CLI**: Install it via `go install github.com/wailsapp/wails/v2/cmd/wails@latest`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/7ostera/moadhnapp.git
   cd moadhnapp
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Run in Development Mode**
   ```bash
   wails dev
   ```
   This will start the application with hot-reload enabled.

### Building for Production

To create a standalone executable (Windows `.exe`):

```bash
wails build
```

The output file `moadhnapp.exe` will be located in the `build/bin` directory.

## 📦 Installer (Windows)

An [Inno Setup](https://jrsoftware.org/isinfo.php) script (`moadhnapp.iss`) is included to generate a professional Windows installer.
1. Build the project using `wails build`.
2. Open `moadhnapp.iss` with Inno Setup Compiler.
3. Click **Compile**.

## 📸 Screenshots

*(Add screenshots of the application here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Made with ❤️ by [7ostera](https://github.com/7ostera)**
