// popup.js

// Add any necessary JavaScript code to interact with the popup.html or perform actions
// popup.js

document.addEventListener('DOMContentLoaded', function () {
  // Get the bookmarked URLs using the Chrome bookmarks API
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    const bookmarkUrls = getBookmarkUrls(bookmarkTreeNodes);
    displayBookmarks(bookmarkUrls);
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
    image.src = `chrome://favicon/${url}`;
    gridItem.appendChild(image);

    gridContainer.appendChild(gridItem);
  }
}
