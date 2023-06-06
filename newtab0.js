// newtab.js

// Function to capture a screenshot of a given URL
async function captureScreenshot(url, filename) {
  const tab = await chrome.tabs.create({ url, active: false });

  return new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        chrome.tabs.captureVisibleTab({ format: 'png' }, function (screenshotUrl) {
          chrome.tabs.remove(tab.id, function () {
            resolve({ filename, screenshotUrl });
          });
        });
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });
}

// Function to generate the bookmark grid with images
function generateBookmarkGrid(bookmarks) {
  const gridContainer = document.getElementById('grid-container');

  for (const bookmark of bookmarks) {
    const bookmarkItem = document.createElement('div');
    bookmarkItem.classList.add('bookmark-item');

    const bookmarkImage = document.createElement('img');
    bookmarkImage.src = bookmark.imageSrc;
    bookmarkImage.alt = bookmark.title;

    bookmarkItem.appendChild(bookmarkImage);
    gridContainer.appendChild(bookmarkItem);
  }
}

// Fetch bookmark data and generate the grid with images
chrome.runtime.sendMessage({ action: 'fetchBookmarks' }, function (response) {
  if (response.success && response.bookmarks) {
    const bookmarks = response.bookmarks;

    (async function () {
      for (const bookmark of bookmarks) {
        const screenshot = await captureScreenshot(bookmark.url, bookmark.title);
        bookmark.imageSrc = screenshot.screenshotUrl;
      }

      generateBookmarkGrid(bookmarks);
    })();
  } else {
    console.error('Error retrieving bookmark data:', response.error);
  }
});
