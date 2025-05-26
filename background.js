// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToSheet",
    title: "Save selection to Sheet",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToSheet" && info.selectionText) {
    const text = info.selectionText.trim();

    // Validate selection: minimum 3 characters and not only whitespace/punctuation
    if (text.length < 3 || /^[\s\W]+$/.test(text)) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => alert("Selection too short or invalid. Please select meaningful text."),
      });
      return; // Don't send invalid data
    }

    const metadata = {
      text: text,
      title: tab.title,
      url: tab.url,
      timestamp: new Date().toISOString(),
    };

    chrome.runtime.sendMessage(
      { action: "sendToSheet", metadata: metadata },
      (response) => {
        if (response && response.success) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => alert("✅ Data sent to Google Sheet successfully!"),
          });
        } else {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => alert("❌ Failed to send data. Please try again."),
          });
        }
      }
    );
  }
});

// Listen for messages from content scripts or context menu to send data to Google Sheet
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendToSheet") {
    fetch(
      "https://script.google.com/macros/s/AKfycbxkX4fCIS-an-ywA8SqmZchWoj2l4SZBdKTrUl0IVj4h0_uf1UBQnrfrWTtRTl9Ne2N/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request.metadata),
      }
    )
      .then((res) => res.text())
      .then((data) => {
        sendResponse({ success: true, data: data });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });

    // Return true to keep message channel open for async response
    return true;
  }
});
