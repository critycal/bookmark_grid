function generateBookmarkGrid(bookmarks) {
  const gridContainer = document.getElementById('bookmarkGrid');

  bookmarks.forEach((bookmark) => {
    const bookmarkLink = document.createElement('a');
    bookmarkLink.href = bookmark.url;
    bookmarkLink.classList.add('bookmark-item');

    const bookmarkImage = document.createElement('div');
    bookmarkImage.classList.add('bookmark-image');

    const imageAspectWrapper = document.createElement('div');
    imageAspectWrapper.classList.add('image-aspect-wrapper');

    const image = document.createElement('img');
    image.src = bookmark.image;

    imageAspectWrapper.appendChild(image);
    bookmarkImage.appendChild(imageAspectWrapper);
    bookmarkLink.appendChild(bookmarkImage);

    const bookmarkTitle = document.createElement('div');
    bookmarkTitle.classList.add('bookmark-title');
    bookmarkTitle.textContent = bookmark.title;
    bookmarkLink.appendChild(bookmarkTitle);

    gridContainer.appendChild(bookmarkLink);
  });
}

// Fetch bookmark data
chrome.runtime.sendMessage({ type: 'fetchBookmarks' }, (response) => {
  if (response.success) {
    const bookmarks = response.bookmarks;
    generateBookmarkGrid(bookmarks);
  } else {
    console.error('Error retrieving bookmark data:', response.error);
  }
});
