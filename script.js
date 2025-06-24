// 漢堡選單功能腳本
// 本腳本適用於所有頁面，請確保每頁皆有引入

// 日期輸入框初始化（iOS相容性）
function initDateInputs() {
    const checkinDate = document.getElementById('checkin-date');
    const checkoutDate = document.getElementById('checkout-date');
    
    if (checkinDate && checkoutDate) {
        // 設置今天為最小日期
        const today = new Date().toISOString().split('T')[0];
        checkinDate.min = today;
        checkoutDate.min = today;
        
        // 設置預設值（今天和明天）
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        checkinDate.value = today;
        checkoutDate.value = tomorrowStr;
        
        // 入住日期變更時，更新退房日期的最小值
        checkinDate.addEventListener('change', function() {
            if (this.value) {
                const selectedDate = new Date(this.value);
                const nextDay = new Date(selectedDate);
                nextDay.setDate(selectedDate.getDate() + 1);
                const nextDayStr = nextDay.toISOString().split('T')[0];
                
                checkoutDate.min = nextDayStr;
                if (checkoutDate.value && checkoutDate.value <= this.value) {
                    checkoutDate.value = nextDayStr;
                }
            }
        });
        
        // iOS 特定處理
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            // 確保在iOS上能正常觸發日期選擇器
            checkinDate.addEventListener('focus', function() {
                this.click();
            });
            checkoutDate.addEventListener('focus', function() {
                this.click();
            });
        }
    }
}

// 初始化大人小孩選擇框
function initGuestSelectors() {
    const adultsSelect = document.getElementById('adults');
    const childrenSelect = document.getElementById('children');
    
    if (adultsSelect && childrenSelect) {
        // 為手機版添加更清楚的選項文字
        if (window.innerWidth <= 900) {
            // 更新大人選項文字
            Array.from(adultsSelect.options).forEach(option => {
                const value = option.value;
                option.textContent = `${value}位成人`;
            });
            
            // 更新小孩選項文字
            Array.from(childrenSelect.options).forEach(option => {
                const value = option.value;
                if (value === '0') {
                    option.textContent = '0位小孩';
                } else {
                    option.textContent = `${value}位小孩`;
                }
            });
        }
        
        // 添加選擇變更事件
        adultsSelect.addEventListener('change', function() {
            console.log('選擇成人數量:', this.value);
        });
        
        childrenSelect.addEventListener('change', function() {
            console.log('選擇小孩數量:', this.value);
        });
    }
}

// 頁面載入完成後初始化日期輸入框
document.addEventListener('DOMContentLoaded', function() {
    initDateInputs();
    initLoginTabs(); // 初始化登入頁面標籤頁
    initGuestSelectors(); // 初始化大人小孩選擇框
});

// 登入頁面標籤頁切換功能
function initLoginTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length === 0) return; // 如果不在登入頁面，直接返回
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活動狀態
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加活動狀態到當前選中的標籤頁
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 取得漢堡按鈕、行動選單、關閉按鈕、頁面遮罩
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');
const closeNavBtn = document.getElementById('close-nav-btn');
const overlay = document.querySelector('.overlay');

// 開啟行動選單
function openMobileNav() {
    if (mobileNav) mobileNav.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // 禁止背景滾動
}

// 關閉行動選單
function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
}

// 點擊漢堡按鈕開啟選單
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileNav);
}

// 點擊關閉按鈕或遮罩關閉選單
if (closeNavBtn) {
    closeNavBtn.addEventListener('click', closeMobileNav);
}
if (overlay) {
    overlay.addEventListener('click', closeMobileNav);
}

// 按下ESC鍵也可關閉選單
window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMobileNav();
    }
});

// 輪播功能
// 取得輪播相關元素
const navigationGrid = document.querySelector('.navigation-grid');
const navCards = document.querySelectorAll('.nav-card');
const prevBtn = document.getElementById('nav-btn-prev');
const nextBtn = document.getElementById('nav-btn-next');

// 輪播狀態變數
let currentIndex = 0;
let isDragging = false;
let startX = 0;
let currentX = 0;
let cardWidth = 0;
let gap = 20; // 卡片間距
let visibleCards = 0;

function bindCarouselEvents() {
    // 按鈕事件
    if (prevBtn) {
        prevBtn.addEventListener('click', () => { if (!isDragging) goToPrevious(); });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => { if (!isDragging) goToNext(); });
    }

    // 觸控事件（手機）
    let touchStartX = 0, touchEndX = 0;
    
    navigationGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        navigationGrid.classList.add('is-dragging');
    }, { passive: false });
    
    navigationGrid.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;
            const translateX = -currentIndex * (cardWidth + gap) + diff;
            navigationGrid.style.transform = `translateX(${translateX}px)`;
        }
    }, { passive: false });
    
    navigationGrid.addEventListener('touchend', (e) => {
        if (isDragging) {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            const threshold = cardWidth / 3;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) goToNext();
                else goToPrevious();
            } else {
                updateCarouselPosition(currentIndex);
            }
            isDragging = false;
            navigationGrid.classList.remove('is-dragging');
        }
    });

    // 滑鼠事件（桌機）
    navigationGrid.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        navigationGrid.classList.add('is-dragging');
        navigationGrid.style.cursor = 'grabbing';
    });
    
    navigationGrid.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX;
            const diff = currentX - startX;
            const translateX = -currentIndex * (cardWidth + gap) + diff;
            navigationGrid.style.transform = `translateX(${translateX}px)`;
        }
    });
    
    navigationGrid.addEventListener('mouseup', (e) => {
        if (isDragging) {
            const diff = startX - currentX;
            const threshold = cardWidth / 3;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) goToNext();
                else goToPrevious();
            } else {
                updateCarouselPosition(currentIndex);
            }
            isDragging = false;
            navigationGrid.classList.remove('is-dragging');
            navigationGrid.style.cursor = 'grab';
        }
    });
    
    navigationGrid.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            navigationGrid.classList.remove('is-dragging');
            navigationGrid.style.cursor = 'grab';
            updateCarouselPosition(currentIndex);
        }
    });
    
    navigationGrid.style.cursor = 'grab';
}

function initCarousel() {
    if (!navigationGrid || navCards.length === 0) return;

    // 1. 先移除所有 clone，只保留原始卡片
    const originalCards = Array.from(navigationGrid.querySelectorAll('.nav-card')).slice(0, navCards.length);
    navigationGrid.innerHTML = '';
    originalCards.forEach(card => navigationGrid.appendChild(card));

    // 2. 重新計算
    cardWidth = originalCards[0].offsetWidth;
    const containerWidth = navigationGrid.parentElement.offsetWidth;
    visibleCards = Math.floor(containerWidth / (cardWidth + gap));
    
    // 確保至少複製 2 張卡片
    const cardsToClone = Math.max(visibleCards, 2);

    // 3. 複製卡片
    for (let i = 0; i < cardsToClone; i++) {
        const clone = originalCards[i % originalCards.length].cloneNode(true);
        navigationGrid.appendChild(clone);
    }

    // 4. 重新設置 currentIndex
    currentIndex = 0;
    updateCarouselPosition(currentIndex);
    
    // 調試信息
    console.log('輪播初始化:', {
        originalCards: originalCards.length,
        visibleCards: visibleCards,
        cardsToClone: cardsToClone,
        totalCards: navigationGrid.querySelectorAll('.nav-card').length,
        cardWidth: cardWidth,
        gap: gap
    });

    // 5. 重新綁定事件
    bindCarouselEvents();
}

// 前往下一張
function goToNext() {
    currentIndex++;
    // 無限循環：到達最後一張時跳回第一張
    if (currentIndex >= navCards.length) {
        setTimeout(() => {
            currentIndex = 0;
            updateCarouselPosition(currentIndex);
        }, 300);
    }
    updateCarouselPosition(currentIndex);
}

// 前往上一張
function goToPrevious() {
    currentIndex--;
    // 無限循環：到達第一張前時跳到最後一張
    if (currentIndex < 0) {
        setTimeout(() => {
            currentIndex = navCards.length - 1;
            updateCarouselPosition(currentIndex);
        }, 300);
    }
    updateCarouselPosition(currentIndex);
}

// 更新輪播位置
function updateCarouselPosition(index) {
    const translateX = -index * (cardWidth + gap);
    navigationGrid.style.transform = `translateX(${translateX}px)`;
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化輪播（僅在首頁）
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        setTimeout(() => {
            initCarousel();
        }, 100);
    }

    // ===== Masonry 瀑布流圖片動畫區塊 Intersection Observer =====
    const masonryCards = document.querySelectorAll('.masonry-card');
    if (masonryCards.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        masonryCards.forEach(card => observer.observe(card));
    } else if (masonryCards.length > 0) {
        // Fallback: 直接顯示
        masonryCards.forEach(card => card.classList.add('visible'));
    }
});

// resize 時重新初始化
window.addEventListener('resize', function() {
    initCarousel();
});

// Masonry 圖片視差效果
function updateMasonryParallax() {
  const cards = document.querySelectorAll('.masonry-card img');
  const wh = window.innerHeight;
  cards.forEach(img => {
    const rect = img.getBoundingClientRect();
    // 視差強度大幅提升（160px 為最大偏移）
    const parallax = ((rect.top + rect.height/2 - wh/2) / wh) * 80;
    img.style.transform = `scale(1.15) translateY(${parallax}px)`;
  });
}
window.addEventListener('scroll', updateMasonryParallax);
window.addEventListener('resize', updateMasonryParallax);
document.addEventListener('DOMContentLoaded', updateMasonryParallax);

// 調試信息
console.log('漢堡選單和輪播功能 JS 已載入'); 
