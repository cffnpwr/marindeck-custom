const aspect = () => {
    const mediaItems = document.getElementsByClassName('js-media-image-link');
    for (const mediaItem of mediaItems) {
        const imageURL = mediaItem.style.getPropertyValue('background-image').replace(/^url(["']?/, '').replace(/["']?)$/, '');
        const image = new Image()
        image.src = imageURL;

        if (mediaItem.childElementCount == 0) {
            mediaItem.classList.add('aspect-ratio');

            const padding = Math.min(window.innerHeight, image.naturalHeight / image.naturalWidth * mediaItem.clientWidth) + 'px';
            mediaItem.style.setProperty('padding-top', padding);

            // 複数画像のときは圧縮しないで全部縦に並べる
            if (mediaItem.classList.contains('block')) {
                mediaItem.classList.remove('pin-all');
                mediaItem.parentElement.classList.remove('position-rel');
                mediaItem.style.setProperty('border-radius', '14px');
                mediaItem.parentElement.style.setProperty('margin-bottom', '8px');
                mediaItem.parentElement.parentElement.classList.remove('media-grid-2', 'media-grid-3', 'media-grid-4');
                mediaItem.parentElement.parentElement.parentElement.style.setProperty('height', 'auto', 'important');
            }
        } else {
            mediaItem.classList.remove('aspect-ratio');
        }
    }
}

const body = document.body;
const observer = new MutationObserver(() => {
    aspect()
});
const config = {
    childList: true,
    attributes: false,
    characterData: false,
    subtree: true
}
observer.observe(body, config);
aspect();