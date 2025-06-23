// 等待 DOM 完全加載
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM 已加載完成 ===');
    console.log('當前頁面:', window.location.pathname);
    
    // 漢堡選單功能
    function initMobileNav() {
        console.log('=== 初始化漢堡選單 ===');
        
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileNav = document.getElementById('mobile-nav');
        const closeNavBtn = document.getElementById('close-nav-btn');
        
        console.log('找到的元素:', {
            hamburgerBtn: hamburgerBtn,
            mobileNav: mobileNav,
            closeNavBtn: closeNavBtn
        });
        
        if (hamburgerBtn && mobileNav && closeNavBtn) {
            console.log('所有漢堡選單元素都找到了');
            
            // 檢查元素是否可見
            const hamburgerStyle = window.getComputedStyle(hamburgerBtn);
            console.log('漢堡按鈕樣式:', {
                display: hamburgerStyle.display,
                visibility: hamburgerStyle.visibility,
                opacity: hamburgerStyle.opacity,
                pointerEvents: hamburgerStyle.pointerEvents,
                position: hamburgerStyle.position,
                zIndex: hamburgerStyle.zIndex
            });
            
            // 漢堡按鈕點擊事件
            hamburgerBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('漢堡按鈕被點擊');
                mobileNav.classList.add('is-open');
                console.log('已添加 is-open 類');
                
                // 檢查是否真的添加了類
                setTimeout(() => {
                    console.log('檢查 is-open 類:', mobileNav.classList.contains('is-open'));
                }, 100);
            });
            
            // 關閉按鈕點擊事件
            closeNavBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('關閉按鈕被點擊');
                mobileNav.classList.remove('is-open');
                console.log('已移除 is-open 類');
            });
            
            // 點擊遮罩關閉選單
            mobileNav.addEventListener('click', function(e) {
                if (e.target === mobileNav) {
                    console.log('點擊遮罩關閉選單');
                    mobileNav.classList.remove('is-open');
                }
            });
            
            // 測試漢堡按鈕是否可點擊
            console.log('漢堡按鈕樣式:', window.getComputedStyle(hamburgerBtn));
            console.log('漢堡按鈕位置:', hamburgerBtn.getBoundingClientRect());
            
            console.log('漢堡選單事件監聽器已添加');
        } else {
            console.error('漢堡選單元素未找到:', {
                hamburgerBtn: !!hamburgerBtn,
                mobileNav: !!mobileNav,
                closeNavBtn: !!closeNavBtn
            });
        }
    }
    
    // 標籤切換功能
    function initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (tabBtns.length > 0 && tabContents.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const targetTab = this.getAttribute('data-tab');
                    
                    // 移除所有活動狀態
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    // 添加活動狀態
                    this.classList.add('active');
                    const targetContent = document.getElementById(targetTab);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
        }
    }
    
    // 預訂頁面過濾功能
    function initBookingFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const bookingCards = document.querySelectorAll('.booking-card');
        
        if (filterBtns.length > 0 && bookingCards.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    // 移除所有按鈕的活動狀態
                    filterBtns.forEach(b => b.classList.remove('active'));
                    // 添加當前按鈕的活動狀態
                    this.classList.add('active');
                    
                    // 過濾卡片
                    bookingCards.forEach(card => {
                        const category = card.getAttribute('data-category');
                        
                        if (filter === 'all' || category === filter) {
                            card.style.display = 'block';
                            card.style.opacity = '0';
                            setTimeout(() => {
                                card.style.opacity = '1';
                            }, 50);
                        } else {
                            card.style.opacity = '0';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }
    
    // 輪播功能（僅首頁）
    function initCarousel() {
        const navigationGrid = document.querySelector('.navigation-grid');
        if (!navigationGrid) return;
        
        const navCards = document.querySelectorAll('.nav-card');
    const infoPanel = {
        subtitle: document.querySelector('#info-panel .subtitle'),
        title: document.querySelector('#info-panel .title'),
        description: document.querySelector('#info-panel .description'),
    };
        
        const navBtnPrev = document.getElementById('nav-btn-prev');
        const navBtnNext = document.getElementById('nav-btn-next');

    const locations = [
        {
            subtitle: '專為舒適而設計',
            title: '豪華客房',
            description: '精心設計的客房，讓您在此放鬆身心，感受杜拜充滿活力的景觀。',
        },
        {
            subtitle: '精緻工藝打造',
            title: '精選套房',
            description: '高雅的聖殿，俯瞰杜拜的天際線，同時享受寧靜的海景。',
        },
        {
            subtitle: '時尚航海生活',
            title: '私人住宅',
            description: '提供一房、兩房和三房的住宅選擇，配備最頂級的設施，環繞在鬱鬱蔥蔥的景觀之中。',
        },
        {
            subtitle: '環球美食之旅',
            title: '餐飲體驗',
            description: '酒店內設有11間餐廳和4間酒吧，從異國情調的亞洲風味到永恆的地中海經典，一場全球美食之旅正等著您。',
        },
    ];

    const cardWidth = 220;
    const cardMargin = 20;
    const totalCardWidth = cardWidth + cardMargin;
        let currentIndex = 0;
        let isTransitioning = false;
        
        function updateInfoPanel(index) {
            const data = locations[index];
            if (infoPanel.subtitle) infoPanel.subtitle.textContent = data.subtitle;
            if (infoPanel.title) infoPanel.title.textContent = data.title;
            if (infoPanel.description) infoPanel.description.textContent = data.description;
        }
        
        function updateCards() {
            navCards.forEach((card, index) => {
                card.classList.toggle('active', index === currentIndex);
            });
            const scrollPosition = currentIndex * totalCardWidth;
            navigationGrid.style.transform = `translateX(-${scrollPosition}px)`;
        }
        
        function goToIndex(targetIndex) {
            if (isTransitioning) return;
            
            let newIndex = targetIndex;
            if (targetIndex < 0) {
                newIndex = locations.length - 1;
            } else if (targetIndex >= locations.length) {
                newIndex = 0;
            }
            
            if (newIndex === currentIndex) return;
            
            isTransitioning = true;
            currentIndex = newIndex;
            
            updateInfoPanel(currentIndex);
            updateCards();
            
            setTimeout(() => {
                isTransitioning = false;
            }, 600);
        }
        
        // 卡片點擊事件
        navCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                goToIndex(index);
            });
        });
        
        // 導航按鈕事件
        if (navBtnPrev) {
            navBtnPrev.addEventListener('click', () => {
                goToIndex(currentIndex - 1);
            });
        }
        
        if (navBtnNext) {
            navBtnNext.addEventListener('click', () => {
                goToIndex(currentIndex + 1);
            });
        }
        
        // 初始化
        updateInfoPanel(currentIndex);
        updateCards();
        navigationGrid.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    // 初始化所有功能
    try {
        initMobileNav();
        initTabs();
        initBookingFilters();
        initCarousel();
        console.log('=== 所有功能初始化完成 ===');
    } catch (error) {
        console.error('初始化過程中發生錯誤:', error);
    }
}); 