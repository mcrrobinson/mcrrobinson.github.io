function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, n);
    });
}

// CREATE PAGE TRANSITIONS
function pageTransition() {
    var tl = gsap.timeline();
    tl.to(".loading-screen", {
        duration: 0.5,
        width: "100%",
        left: "0%",
        ease: "Expo.easeInOut",
    });
    tl.to(".loading-screen", {
        duration: 0.5,
        width: "100%",
        left: "100%",
        ease: "Expo.easeInOut",
        delay: 0.3,
    });
    tl.set(".loading-screen", { left: "-100%" });
}

function contentAnimation() {
    var tl = gsap.timeline();
    tl.from(".animate-this", { duration: 1, y: 30, opacity: 0, stagger: 0.2, delay: 0.2 });
}

// SLIDE THE TITLES
function slideTitle() {
    $('.page-title').velocity('transition.slideLeftBigOut')
    $('.page-subtitle').velocity('transition.slideRightBigOut')
}

$(function () {
    barba.init({
        sync: true,
        transitions: [{
                async leave(data) {
                    const done = this.async();
                    pageTransition();
                    await delay(300);
                    done();
                },
                async enter({ next }) {
                    contentAnimation();
                    await delay(300);
                    if (next.namespace === 'project-section') {
                        fetchAndDisplayRepos();
                    }
                },
                async once(data) {
                    contentAnimation();
                },
            },
        ],
    });
});