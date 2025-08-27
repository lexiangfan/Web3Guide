// src/directives/lazyLoad.js
const loadImage = (el, binding) => {
    const imgSrc = binding.value;
    const placeholder = binding.arg || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2VlZSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iYXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiNhYWEiPlx1Nzc1Y1x1Njc5Zlx1NTExRlx1NzZlZTwvdGV4dD4KPC9zdmc+';

    // 设置占位图
    el.src = placeholder;
    el.classList.add('lazy-loading');

    const image = new Image();
    image.onload = () => {
        el.src = imgSrc;
        el.classList.remove('lazy-loading');
        el.classList.add('lazy-loaded');
    };
    image.onerror = () => {
        el.src = placeholder;
        el.classList.remove('lazy-loading');
        el.classList.add('lazy-error');
    };
    image.src = imgSrc;
};

const loadVideo = (el, binding) => {
    const videoSrc = binding.value;
    const placeholder = binding.arg || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2VlZSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iYXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiNhYWEiPlx1Nzc1Y1x1Njc5Zlx1NTExRlx1NzZlZTwvdGV4dD4KPC9zdmc+';

    // 设置占位图
    el.poster = placeholder;
    el.classList.add('lazy-loading');

    const video = document.createElement('video');
    video.onloadeddata = () => {
        el.src = videoSrc;
        el.classList.remove('lazy-loading');
        el.classList.add('lazy-loaded');
    };
    video.onerror = () => {
        el.poster = placeholder;
        el.classList.remove('lazy-loading');
        el.classList.add('lazy-error');
    };
    video.src = videoSrc;
};

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const binding = el._lazyLoadBinding;
            if (binding) {
                loadImage(el, binding);
                observer.unobserve(el);
            }
        }
    });
}, observerOptions);

const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const binding = el._lazyLoadBinding;
            if (binding) {
                loadVideo(el, binding);
                observer.unobserve(el);
            }
        }
    });
}, observerOptions);

export default {
    mounted(el, binding) {
        el._lazyLoadBinding = binding;
        if (el.tagName === 'IMG') {
            imageObserver.observe(el);
        } else if (el.tagName === 'VIDEO') {
            videoObserver.observe(el);
        }
    },
    updated(el, binding) {
        el._lazyLoadBinding = binding;
    },
    unmounted(el) {
        if (el.tagName === 'IMG') {
            imageObserver.unobserve(el);
        } else if (el.tagName === 'VIDEO') {
            videoObserver.unobserve(el);
        }
    }
};
