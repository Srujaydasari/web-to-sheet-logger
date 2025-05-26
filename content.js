let lastSelectedText = "";

// Listen for mouseup to detect text selection
document.addEventListener("mouseup", (event) => {
  setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();

    const isPopupClick =
      event.target.closest("#web2sheet-confirmation") ||
      event.target.closest("#web2sheet-save-btn");

    if (isPopupClick) return;

    if (
      selectedText.length >= 3 &&
      !/^\W+$/.test(selectedText) &&
      selectedText !== lastSelectedText
    ) {
      lastSelectedText = selectedText;
      showSaveButton(event.pageX, event.pageY, selectedText);
    }
  }, 100);
});

// Show floating Save button near selection
function showSaveButton(x, y, selectedText) {
  const oldBtn = document.getElementById("web2sheet-save-btn");
  if (oldBtn) oldBtn.remove();

  const button = document.createElement("button");
  button.innerText = "Save";
  button.id = "web2sheet-save-btn";
  button.style.position = "absolute";
  button.style.top = `${y + 10}px`;
  button.style.left = `${x + 10}px`;
  button.style.padding = "5px 10px";
  button.style.fontSize = "14px";
  button.style.zIndex = "9999";
  button.style.backgroundColor = "#007bff";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "4px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";

  document.body.appendChild(button);

  button.addEventListener("click", () => {
    showConfirmationPopup(selectedText);
    button.remove();
  });
}

// Show confirmation popup full width under address bar
function showConfirmationPopup(selectedText) {
  const oldPopup = document.getElementById("web2sheet-confirmation");
  if (oldPopup) oldPopup.remove();

  const metadata = {
    text: selectedText,
    title: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };

  const popup = document.createElement("div");
  popup.id = "web2sheet-confirmation";
  popup.style.position = "fixed";
  popup.style.top = "80px"; // below address bar
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.padding = "15px 20px";
  popup.style.backgroundColor = "#f9f9f9";
  popup.style.borderBottom = "1px solid #ccc";
  popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  popup.style.fontSize = "14px";
  popup.style.zIndex = "9999";
  popup.style.boxSizing = "border-box";
  popup.style.overflowX = "auto";

  popup.innerHTML = `
    <div style="max-height: 300px; overflow-y: auto;">
      <strong>Confirm Save:</strong><br><br>
      <b>Text:</b> ${metadata.text}<br><br>
      <b>Title:</b> ${metadata.title}<br>
      <b>URL:</b> ${metadata.url}<br>
      <b>Time:</b> ${metadata.timestamp}<br><br>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
      <button id="web2sheet-confirm-btn" style="padding:6px 12px; background-color:#28a745; color:white; border:none; border-radius:4px; cursor:pointer;">
        Send to Sheet
      </button>
      <button id="web2sheet-cancel-btn" style="padding:6px 12px; background-color:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer;">
        Cancel
      </button>
    </div>
  `;

  document.body.appendChild(popup);

  // Send to sheet logic
  document.getElementById("web2sheet-confirm-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "sendToSheet", metadata: metadata }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("No receiving end found:", chrome.runtime.lastError.message);
        return;
      }
      if (response && response.success) {
        alert("✅ Data sent to Google Sheet successfully!");
        lastSelectedText = "";
      } else {
        alert("❌ Failed to send data. Please try again.");
        console.error("Error:", response && response.error);
      }
    });
  
  });

  // Cancel logic
  document.getElementById("web2sheet-cancel-btn").addEventListener("click", () => {
    popup.remove();
    lastSelectedText = "";
  });
}

// Hide button/popup when clicking outside
document.addEventListener("click", (event) => {
  const saveBtn = document.getElementById("web2sheet-save-btn");
  const confirmation = document.getElementById("web2sheet-confirmation");

  if (
    saveBtn &&
    !event.target.closest("#web2sheet-save-btn") &&
    !event.target.closest("#web2sheet-confirmation")
  ) {
    saveBtn.remove();
  }

  if (
    confirmation &&
    !event.target.closest("#web2sheet-confirmation") &&
    !event.target.closest("#web2sheet-save-btn")
  ) {
    confirmation.remove();
    lastSelectedText = "";
  }
});
