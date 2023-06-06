// background.js

// Function to fetch the bookmark data
function fetchBookmarkData() {
  // Replace with your logic to fetch the bookmark data
  // Return the bookmark data as an array of objects with properties like url, title, etc.
  return [
    { url: 'https://example.com', title: 'Example' },
    { url: 'https://google.com', title: 'Google' },
    // ...
  ];
}

// Function to capture a screenshot of a given URL
async function captureScreenshot(url) {
  console.log('Capturing screenshot for:', url); // Check if the function is being called

  return new Promise((resolve) => {
    chrome.tabs.create({ url, active: false }, (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.captureVisibleTab({ format: 'png' }, (screenshotUrl) => {
            chrome.tabs.remove(tabId, () => {
              resolve(screenshotUrl);
            });
          });
          chrome.tabs.onUpdated.removeListener(listener);
        }
      });
    });
  });
}

// Message handler for content script requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getBookmarkData') {
    const bookmarks = fetchBookmarkData();
    sendResponse({ success: true, bookmarks });
  }
});

// Perform actions when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Set up initial configurations or perform other setup tasks
});

// Schedule daily execution of bookmark data update
chrome.alarms.create({ periodInMinutes: 60 * 24 });

// Handle the alarm firing event
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'bookmarkUpdate') {
    // Update bookmark data in the background
    const bookmarks = fetchBookmarkData();

    // Capture screenshots for each bookmark
    for (const bookmark of bookmarks) {
      const screenshotUrl = await captureScreenshot(bookmark.url);
      bookmark.imageSrc = screenshotUrl;
    }

    // Perform any necessary processing or storage of updated bookmarks
  }
});
