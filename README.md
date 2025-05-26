# Web-to-Sheet Logger

A Chrome Extension that lets users select text on any webpage and log it directly to Google Sheets along with metadata like title, URL, and timestamp.

## 🚀 Features

- Highlight text → Save to Sheet
- Auto-captures webpage title, URL, and time
- Clean UI with confirmation popup
- Fully integrated with Google Apps Script backend

## 🛠️ Installation

1. Clone or download this repo.
2. Go to `chrome://extensions` in Chrome.
3. Enable **Developer Mode** (top right).
4. Click **Load unpacked** and select the extension folder.

## 📋 How to Use

1. Highlight any meaningful text on a webpage.
2. Click the **Save** button that appears near the selection.
3. In the popup near the top of the screen, confirm by clicking **Send to Sheet**.
4. ✅ Done! Check your linked Google Sheet.

## 📎 Google Sheet Link

🔗 [Click here to view the Sheet](https://docs.google.com/spreadsheets/d/16-MAYkD8tuPL8H6gh45ux9jjIEapKzq3FxjbUS-xu2s/edit?gid=0)

> Note: Ensure your Google Apps Script endpoint is active and deployed correctly.

## 🔐 Permissions Used

- `activeTab`: To read the current tab info.
- `scripting`: To inject scripts into pages.
- `storage`: For storing last selected text.
- `contextMenus`: (optional) for right-click saving.
- `host_permissions`: For interacting with all websites.

## 🧰 Setup Instructions

1. Deploy your Google Apps Script Web App to receive data from the extension.
2. Update the endpoint URL in `background.js` (`const scriptURL = "..."`).
3. Load the extension via `chrome://extensions`.
4. Start using it on any website!

## ⚠️ Known Limitations

- The extension only sends text ≥ 3 characters and skips pure punctuation.
- Popup display may vary slightly across websites with fixed headers.
- Apps Script quota limits may affect heavy usage.
- Sheet must be shared with correct permissions if accessed externally.


## 👨‍💻 Author

- **Srujay Dasari**

## 📦 Submission Contents

- `manifest.json`
- `content.js`
- `background.js`
- `popup.html`, `popup.js`
- `icon1.png`
- `README.md`


