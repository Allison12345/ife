
new FullPage({
    id: "pageContain",
    slideTime: 800,
    continuous: false,
    effect: {
        transform: {
            translate: 'Y',
            scale: [1, 1],
            rotate: [0, 0]
        },
        opacity: [0, 1]
    },
    mode: 'wheel,touch,nav:navBar',
    easing: 'ease'
});