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
    initHomepageParallax(); // 初始化首页视差效果
    initDateInputs();
    initLoginTabs(); // 初始化登入頁面標籤頁
    initGuestSelectors(); // 初始化大人小孩選擇框
    initFilterTabs(); // 初始化過濾標籤功能
    
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
    
    // 初始化Masonry视差效果
    updateMasonryParallax();

    // 初始化緩慢顯示效果（僅在首頁）
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        initSlowReveal();
    }
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

// 過濾標籤功能
function initFilterTabs() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bookingCards = document.querySelectorAll('.booking-card');
    
    if (filterBtns.length === 0) return; // 如果不在預訂頁面，直接返回
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 移除所有按鈕的活動狀態
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // 添加活動狀態到當前選中的按鈕
            this.classList.add('active');
            
            // 過濾預訂卡片
            bookingCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || 
                    (filter === 'current' && (category === 'current' || category === 'upcoming')) ||
                    category === filter) {
                    card.style.display = 'block';
                    // 添加淡入動畫
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
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
    console.log('开始绑定轮播图事件');
    
    // 按鈕事件
    if (prevBtn) {
        prevBtn.addEventListener('click', () => { if (!isDragging) goToPrevious(); });
        console.log('上一张按钮事件已绑定');
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => { if (!isDragging) goToNext(); });
        console.log('下一张按钮事件已绑定');
    }

    // 觸控事件（手機）
    let touchStartX = 0;
    let isTouching = false;
    
    navigationGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isTouching = true;
        isDragging = false;
    }, { passive: true });
    
    navigationGrid.addEventListener('touchmove', (e) => {
        if (!isTouching) return;
        
        const touchX = e.touches[0].clientX;
        const diff = touchX - touchStartX;
        
        // 如果移动超过10px，开始拖拽
        if (Math.abs(diff) > 10) {
            isDragging = true;
            e.preventDefault();
            
            const translateX = -currentIndex * (cardWidth + gap) + diff;
            navigationGrid.style.transform = `translateX(${translateX}px)`;
        }
    }, { passive: false });
    
    navigationGrid.addEventListener('touchend', (e) => {
        if (!isTouching) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (isDragging) {
            // 如果滑动距离超过卡片宽度的1/3，切换轮播图
            const threshold = cardWidth / 3;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    goToNext();
                } else {
                    goToPrevious();
                }
            } else {
                // 回到原位置
                updateCarouselPosition(currentIndex);
            }
        }
        
        isTouching = false;
        isDragging = false;
    });

    // 滑鼠事件（桌機）
    let mouseStartTime = 0;
    
    navigationGrid.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        mouseStartTime = Date.now();
        isDragging = false;
        navigationGrid.classList.add('is-dragging');
        navigationGrid.style.cursor = 'grabbing';
    });
    
    navigationGrid.addEventListener('mousemove', (e) => {
        if (navigationGrid.classList.contains('is-dragging')) {
            isDragging = true;
            e.preventDefault();
            currentX = e.clientX;
            const diff = currentX - startX;
            const translateX = -currentIndex * (cardWidth + gap) + diff;
            navigationGrid.style.transform = `translateX(${translateX}px)`;
        }
    });
    
    navigationGrid.addEventListener('mouseup', (e) => {
        const mouseEndTime = Date.now();
        const mouseDuration = mouseEndTime - mouseStartTime;
        
        if (navigationGrid.classList.contains('is-dragging')) {
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
        if (navigationGrid.classList.contains('is-dragging')) {
            isDragging = false;
            navigationGrid.classList.remove('is-dragging');
            navigationGrid.style.cursor = 'grab';
            updateCarouselPosition(currentIndex);
        }
    });
    
    navigationGrid.style.cursor = 'grab';

    // 移除所有卡片的點擊事件監聽器，讓a標籤的默認行為工作
    const cards = navigationGrid.querySelectorAll('.nav-card');
    console.log('找到卡片数量用于事件绑定:', cards.length);
    
    cards.forEach(card => {
        // 移除舊的事件監聽器
        if (card._carouselClickHandler) {
            card.removeEventListener('click', card._carouselClickHandler);
            delete card._carouselClickHandler;
        }
        
        // 直接为每个卡片添加点击事件
        card.addEventListener('click', function(e) {
            console.log('卡片被点击:', this.href);
            if (isDragging) {
                console.log('拖拽中，阻止点击');
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            console.log('允许跳转到:', this.href);
            // 允许正常跳转
            return true;
        });
    });
    
    console.log('轮播图事件绑定完成');
}

function initCarousel() {
    console.log('开始初始化轮播图');
    if (!navigationGrid) {
        console.log('navigationGrid 未找到');
        return;
    }

    // 确保移除任何可能存在的is-dragging类
    navigationGrid.classList.remove('is-dragging');
    isDragging = false;

    // 重新取得所有卡片（包括新增的）
    const allCards = navigationGrid.querySelectorAll('.nav-card');
    console.log('找到卡片数量:', allCards.length);
    if (allCards.length === 0) {
        console.log('没有找到轮播图卡片');
        return;
    }

    // 1. 先移除所有 clone，只保留原始卡片
    const originalCards = Array.from(allCards);
    navigationGrid.innerHTML = '';
    originalCards.forEach(card => navigationGrid.appendChild(card));

    // 2. 重新計算
    cardWidth = originalCards[0].offsetWidth;
    const containerWidth = navigationGrid.parentElement.offsetWidth;
    visibleCards = Math.floor(containerWidth / (cardWidth + gap));
    console.log('轮播图参数:', { cardWidth, containerWidth, visibleCards });
    
    // 確保至少複製 2 張卡片
    const cardsToClone = Math.max(visibleCards, 2);

    // 3. 複製卡片（確保是a標籤且保留href）
    for (let i = 0; i < cardsToClone; i++) {
        const card = originalCards[i % originalCards.length];
        const clone = card.cloneNode(true);
        
        // 確保複製的卡片保持a標籤的完整性
        if (card.tagName === 'A') {
            const href = card.getAttribute('href');
            if (href) {
                clone.setAttribute('href', href);
            }
            // 確保複製的卡片也是a標籤
            if (clone.tagName !== 'A') {
                const newLink = document.createElement('a');
                newLink.setAttribute('href', href);
                newLink.className = card.className;
                newLink.innerHTML = card.innerHTML;
                clone = newLink;
            }
        }
        navigationGrid.appendChild(clone);
    }

    // 4. 重新設置 currentIndex
    currentIndex = 0;
    updateCarouselPosition(currentIndex);

    // 5. 重新綁定事件
    bindCarouselEvents();
    console.log('轮播图初始化完成');
}

// 前往下一張
function goToNext() {
    const allCards = navigationGrid.querySelectorAll('.nav-card');
    const originalCardCount = allCards.length - Math.floor(allCards.length / (allCards.length / 7)); // 估算原始卡片數量
    
    currentIndex++;
    // 無限循環：到達最後一張時跳回第一張
    if (currentIndex >= 7) { // 使用固定的 7 張卡片
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
            currentIndex = 6; // 使用固定的 6 (7-1)
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

// 首页视差滚动效果
function initHomepageParallax() {
    const parallaxBg = document.getElementById('homepage-parallax-bg');
    const body = document.body;
    
    console.log('首页视差效果初始化:', {
        parallaxBg: !!parallaxBg,
        isHomepage: body.classList.contains('homepage'),
        bodyClasses: body.className
    });
    
    // 只在首页执行
    if (!parallaxBg || !body.classList.contains('homepage')) {
        console.log('首页视差效果未启用');
        return;
    }
    
    console.log('首页视差效果已启用');
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // 计算滚动进度（0-1）
        const scrollProgress = Math.min(scrolled / (documentHeight - windowHeight), 1);
        
        // 背景图缩放效果：从120%逐渐放大到140%（确保始终覆盖视窗）
        const scale = 1.2 + (scrollProgress * 0.2); // 从1.2倍放大到1.4倍
        
        // 背景位置移动：创造由近到远的效果（向上移动）
        const moveY = -(scrolled * 0.1); // 减少移动速度，避免露出边界
        
        // 应用变换
        parallaxBg.style.backgroundSize = `${scale * 100}% ${scale * 100}%`;
        parallaxBg.style.backgroundPosition = `center ${moveY}px`;
        

        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // 监听窗口大小变化
    window.addEventListener('resize', requestTick, { passive: true });
    
    // 初始化
    updateParallax();
    console.log('首页视差效果初始化完成');
}

// 緩慢顯示背景圖片效果
function initSlowReveal() {
  const slowRevealBg = document.getElementById('slow-reveal-bg');
  const slowRevealSection = document.querySelector('.slow-reveal-section');
  const parallaxBg = document.getElementById('homepage-parallax-bg');
  
  if (!slowRevealBg || !slowRevealSection) return;
  
  function updateSlowReveal() {
    const rect = slowRevealSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // 計算滾動進度 (0 到 1)
    const progress = Math.max(0, Math.min(1, 
      (windowHeight - rect.top) / (rect.height + windowHeight)
    ));
    
    // 根據進度調整透明度
    slowRevealBg.style.opacity = progress;
    
    // 根據進度調整縮放
    const scale = 1.1 - (progress * 0.1);
    slowRevealBg.style.transform = `scale(${scale})`;
    
    // 當 2bg 開始顯示時（進度 > 0），立即隱藏原本的視差背景
    if (progress > 0 && parallaxBg) {
      parallaxBg.style.opacity = '0';
      parallaxBg.style.transition = 'opacity 0.3s ease';
    } else if (progress <= 0 && parallaxBg) {
      parallaxBg.style.opacity = '1';
      parallaxBg.style.transition = 'opacity 0.3s ease';
    }
    
    // 當完全滾動到底部時添加 revealed 類
    if (progress >= 0.95) {
      slowRevealBg.classList.add('revealed');
    } else {
      slowRevealBg.classList.remove('revealed');
    }
  }
  
  window.addEventListener('scroll', updateSlowReveal);
  window.addEventListener('resize', updateSlowReveal);
  
  // 初始化
  updateSlowReveal();
}

// 調試信息
console.log('漢堡選單和輪播功能 JS 已載入'); 