// backend.js
const CDP = require('chrome-remote-interface');
const fetch = require('node-fetch');
const fs = require('fs');

// Function to fetch bookmark data from storage or API
function fetchBookmarkData() {
  // Example implementation using an API
  return fetch('https://example.com/bookmarks')
    .then((response) => response.json())
    .then((data) => {
      // Store the fetched bookmark data in a local file for future use
      fs.writeFileSync('bookmarks.json', JSON.stringify(data));
      return data;
    })
    .catch((error) => {
      console.error('Error fetching bookmark data:', error);
      throw error;
    });
}

module.exports = {
  fetchBookmarkData,
};

async function recreateImagesInBackground() {
  const client = await CDP();

  const { DOM, Page, Emulation } = client;

  await Promise.all([DOM.enable(), Page.enable(), Emulation.enable()]);

  const bookmarkTreeNodes = await getBookmarks();
  const bookmarkUrls = getBookmarkUrls(bookmarkTreeNodes);

  for (const url of bookmarkUrls) {
    try {
      await Page.navigate({ url });
      await Page.loadEventFired();

      const screenshotData = await Page.captureScreenshot({ format: 'png' });
      const imageBuffer = Buffer.from(screenshotData.data, 'base64');
      const fileName = urlToFileName(url) + '.png';

      fs.writeFileSync(fileName, imageBuffer);
      console.log(`Image recreated for ${url}`);
    } catch (error) {
      console.error(`Error recreating image for ${url}:`, error);
    }
  }

  await client.close();
}

async function getBookmarks() {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      resolve(bookmarkTreeNodes);
    });
  });
}

function getBookmarkUrls(bookmarkNodes) {
  const urls = [];

  function traverseNodes(nodes) {
    for (const node of nodes) {
      if (node.url) {
        urls.push(node.url);
      } else if (node.children) {
        traverseNodes(node.children);
      }
    }
  }

  traverseNodes(bookmarkNodes);
  return urls;
}

function urlToFileName(url) {
  const cleanUrl = url.replace(/https?:\/\//, '');
  return cleanUrl.replace(/[^\w\s]/gi, '_');
}

module.exports = {
  recreateImagesInBackground,
};
