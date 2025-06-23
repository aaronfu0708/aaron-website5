document.addEventListener('DOMContentLoaded', () => {
    const siteWrapper = document.getElementById('site-wrapper');
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const counterEl = document.getElementById('counter');
    const infoPanel = {
        container: document.getElementById('info-panel'),
        subtitle: document.querySelector('#info-panel .subtitle'),
        title: document.querySelector('#info-panel .title'),
        description: document.querySelector('#info-panel .description'),
    };

    const locations = [
        {
            subtitle: '專為舒適而設計',
            title: '豪華客房',
            description: '精心設計的客房，讓您在此放鬆身心，感受杜拜充滿活力的景觀。',
            iframeSrc: 'https://aaronfu0708.github.io/aaron-website5/',
        },
        {
            subtitle: '精緻工藝打造',
            title: '精選套房',
            description: '高雅的聖殿，俯瞰杜拜的天際線，同時享受寧靜的海景。',
            iframeSrc: 'https://aaronfu0708.github.io/aaron-website5/',
        },
        {
            subtitle: '時尚航海生活',
            title: '私人住宅',
            description: '提供一房、兩房和三房的住宅選擇，配備最頂級的設施，環繞在鬱鬱蔥蔥的景觀之中。',
            iframeSrc: 'https://aaronfu0708.github.io/aaron-website5/',
        },
        {
            subtitle: '環球美食之旅',
            title: '餐飲體驗',
            description: '酒店內設有11間餐廳和4間酒吧，從異國情調的亞洲風味到永恆的地中海經典，一場全球美食之旅正等著您。',
            iframeSrc: 'https://aaronfu0708.github.io/aaron-website5/',
        },
        
    ];

    const cardWidth = 220;
    const cardMargin = 20;
    const totalCardWidth = cardWidth + cardMargin;

    // --- Infinite Loop Setup ---
    const cloneCount = locations.length;
    const extendedLocations = [...locations, ...locations, ...locations];
    let currentIndex = cloneCount; // Start at the first "real" item
    let isTransitioning = false; // Prevents spam clicking

    function createCards() {
        carousel.innerHTML = '';
        if (progressBar.children.length === 0) {
            const progressBarInner = document.createElement('div');
            progressBarInner.className = 'progress-bar-inner';
            progressBar.appendChild(progressBarInner);
        }

        extendedLocations.forEach((loc, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            
            cardEl.innerHTML = `
                <iframe src="${loc.iframeSrc}" frameborder="0" scrolling="no" allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="overlay"></div>
                <div class="card-content">
                    <span class="subtitle">${loc.subtitle}</span>
                    <h3 class="title">${loc.title}</h3>
                </div>
            `;
            
            cardEl.addEventListener('click', () => {
                const realIndex = currentIndex % locations.length;
                const clickedRealIndex = index % locations.length;
                if(realIndex !== clickedRealIndex) {
                    runTransition(index);
                }
            });
            carousel.appendChild(cardEl);
        });
    }

    function runTransition(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        const cardData = extendedLocations[index];
        const sourceCardEl = carousel.children[currentIndex];
        const rect = sourceCardEl.getBoundingClientRect();
        
        document.body.classList.add('is-animating');

        const transitionContainer = document.createElement('div');
        transitionContainer.id = 'transition-container';
        document.body.appendChild(transitionContainer);

        const clone = document.createElement('div');
        clone.className = 'transition-clone';
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        
        const iframe = document.createElement('iframe');
        iframe.src = cardData.iframeSrc;
        iframe.setAttribute('scrolling', 'no');
        clone.appendChild(iframe);
        transitionContainer.appendChild(clone);

        setActive(index);

        requestAnimationFrame(() => {
            clone.style.top = '0px';
            clone.style.left = '0px';
            clone.style.width = '100vw';
            clone.style.height = '100vh';
            clone.style.borderRadius = '0px';
        });

        clone.addEventListener('transitionend', () => {
            document.body.classList.remove('is-animating');
            transitionContainer.remove();
            isTransitioning = false;
        }, { once: true });
    }

    function setActive(index) {
        currentIndex = index;
        const realIndex = currentIndex % locations.length;
        const cardData = locations[realIndex];
        
        infoPanel.container.style.opacity = 0;
        setTimeout(() => {
            infoPanel.subtitle.textContent = cardData.subtitle;
            infoPanel.title.textContent = cardData.title;
            infoPanel.description.textContent = cardData.description;
            infoPanel.container.style.opacity = 1;
        }, 300);
        
        updateDisplay();
    }

    function updateDisplay() {
        carousel.style.transform = `translateX(-${currentIndex * totalCardWidth}px)`;
        
        document.querySelectorAll('.card').forEach((card, i) => {
            card.classList.toggle('active', i === currentIndex);
        });
        
        const realIndex = currentIndex % locations.length;
        const progressBarInner = progressBar.querySelector('.progress-bar-inner');
        if (progressBarInner) {
            const progress = ((realIndex + 1) / locations.length) * 100;
            progressBarInner.style.width = `${progress}%`;
        }
        counterEl.textContent = String(realIndex + 1).padStart(2, '0');
    }

    carousel.addEventListener('transitionend', () => {
        if (currentIndex < cloneCount || currentIndex >= cloneCount * 2) {
            currentIndex = (currentIndex % locations.length) + cloneCount;
            carousel.style.transition = 'none';
            updateDisplay();
            carousel.offsetHeight; // Trigger a reflow
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });
    
    function slide(direction) {
        if (isTransitioning) return;
        const nextIndex = currentIndex + (direction === 'next' ? 1 : -1);
        runTransition(nextIndex);
    }

    // --- Drag/Swipe to Scroll ---
    let isDragging = false;
    let startX;
    let startTranslate;
    let dragThreshold = 50; // Min pixels to drag to trigger a slide
    let hasDragged = false;

    function dragStart(e) {
        isDragging = true;
        startX = e.pageX || e.touches[0].pageX;
        hasDragged = false;
        carousel.style.transition = 'none';
        
        // Get the current transform value
        const transformMatrix = window.getComputedStyle(carousel).getPropertyValue('transform');
        if (transformMatrix !== 'none') {
            startTranslate = parseInt(transformMatrix.split(',')[4]);
        } else {
            startTranslate = 0;
        }
        carousel.classList.add('is-dragging');
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.pageX || e.touches[0].pageX;
        const diff = currentX - startX;
        
        if (Math.abs(diff) > 10) { // Register as a drag action
            hasDragged = true;
        }

        carousel.style.transform = `translateX(${startTranslate + diff}px)`;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        carousel.classList.remove('is-dragging');
        carousel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

        const finalTranslate = startTranslate + ((e.pageX || e.changedTouches[0].pageX) - startX);
        const cardSwiped = Math.round((startTranslate - finalTranslate) / totalCardWidth);
        
        let newIndex = currentIndex + cardSwiped;

        if (Math.abs((e.pageX || e.changedTouches[0].pageX) - startX) > dragThreshold) {
            runTransition(newIndex);
        } else {
            // Not dragged far enough, snap back
            updateDisplay();
        }
        
        // Prevent click event after drag
        setTimeout(() => {
            hasDragged = false;
        }, 0);
    }

    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('touchstart', dragStart);
    carousel.addEventListener('mousemove', dragMove);
    carousel.addEventListener('touchmove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
    
    // Override card click if dragging
    carousel.addEventListener('click', (e) => {
        if(hasDragged) {
            e.stopPropagation();
        }
    }, true); // Use capture phase to stop event early

    nextBtn.addEventListener('click', () => slide('next'));
    prevBtn.addEventListener('click', () => slide('prev'));

    createCards();
    carousel.style.transition = 'none';
    setActive(currentIndex);
    carousel.offsetHeight; 
    carousel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    // --- Mobile Nav ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeNavBtn = document.getElementById('close-nav-btn');

    if (hamburgerBtn && mobileNav && closeNavBtn) {
        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.add('is-open');
        });

        closeNavBtn.addEventListener('click', () => {
            mobileNav.classList.remove('is-open');
        });
    }
}); 