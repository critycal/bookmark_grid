// background.js
const { recreateImagesInBackground } = require('./backend.js');



// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getBookmarkData') {
    // Retrieve the bookmark data (replace with your logic to fetch the data)
    const bookmarks = fetchBookmarkData();

    // Send the bookmark data as a response to the content script
    sendResponse({ success: true, bookmarks });
  }
});

// Function to fetch the bookmark data
function fetchBookmarkData() {
  // Replace with your logic to fetch the bookmark data
  // Return the bookmark data as an array of objects with properties like imageSrc, title, etc.
  return [
    { imageSrc: 'bookmark1.png', title: 'Bookmark 1' },
    { imageSrc: 'bookmark2.png', title: 'Bookmark 2' },
    // ...
  ];
}

// Rest of the code for bookmark retrieval and display...

// Trigger the image recreation process once a day
chrome.alarms.create({ delayInMinutes: 60 * 24 });

// Add an event listener for the alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'recreateImages') {
    try {
      await recreateImagesInBackground();
    } catch (error) {
      console.error('Error recreating images:', error);
    }
  }
});

// Rest of the code for bookmark retrieval and display
document.addEventListener('DOMContentLoaded', function () {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    try {
      const bookmarkUrls = getBookmarkUrls(bookmarkTreeNodes);
      displayBookmarks(bookmarkUrls);
    } catch (error) {
      console.error('Error:', error);
      displayErrorMessage();
    }
  });
});

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

function displayBookmarks(urls) {
  const gridContainer = document.getElementById('bookmarkGrid');

  for (const url of urls) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';

    const image = document.createElement('img');
    image.src = `http://www.google.com/s2/favicons?domain=${getDomainFromUrl(url)}`;
    image.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const aspectRatio = 16 / 9;
      const imageWidth = image.width;
      const imageHeight = image.width / aspectRatio;

      canvas.width = imageWidth;
      canvas.height = imageHeight;

      context.drawImage(image, 0, 0, imageWidth, imageHeight);

      const cachedImage = new Image();
      cachedImage.src = canvas.toDataURL('image/png');
      gridItem.appendChild(cachedImage);
    };

    gridContainer.appendChild(gridItem);
  }
}

function displayErrorMessage() {
  const errorMessage = document.createElement('p');
  errorMessage.textContent = 'An error occurred while loading bookmarks.';
  document.body.appendChild(errorMessage);
}

function getDomainFromUrl(url) {
  const domainMatch = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/g);
  return domainMatch ? domainMatch[0] : '';
}
// background.js

// Import the backend module
const backend = require('./backend');

// Create a function to handle the creation of images
function createBookmarkImages() {
  backend.recreateImagesInBackground()
    .then(() => {
      console.log('Bookmark images created successfully.');
    })
    .catch((error) => {
      console.error('Error creating bookmark images:', error);
    });
}

// Call the function to initiate image creation
createBookmarkImages();
