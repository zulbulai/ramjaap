// राम नाम जप काउंटर Pro v2.4 - FINAL PROFESSIONAL VERSION with LEFT FAB & Enhanced Features

class RamJapCounterPro {
    constructor() {
        // Initialize app state with enhanced data
        this.currentCount = 1247;
        this.dailyGoal = 2400;
        this.lastDate = this.getTodayString();
        this.settings = {
            soundEnabled: true,
            volume: 65
        };

        // Professional sample data for charts and stats
        this.historicalData = {
            '2025-01-16': 1247,
            '2025-01-15': 2400,
            '2025-01-14': 1876,
            '2025-01-13': 2156,
            '2025-01-12': 1950,
            '2025-01-11': 2400,
            '2025-01-10': 1654,
            '2025-01-09': 2285,
            '2025-01-08': 1789,
            '2025-01-07': 2089,
            '2025-01-06': 1834,
            '2025-01-05': 2400,
            '2025-01-04': 1967,
            '2025-01-03': 2234
        };

        // Enhanced milestones system
        this.milestones = [
            { name: "शुरुआत", count: 108, icon: "🌅", unlocked: true, unlockedDate: "2025-01-01" },
            { name: "शतक पूर्ण", count: 100, icon: "💯", unlocked: true, unlockedDate: "2025-01-02" },
            { name: "सहस्त्र पूर्ण", count: 1000, icon: "🏆", unlocked: true, unlockedDate: "2025-01-05" },
            { name: "दैनिक लक्ष्य", count: 2400, icon: "🎯", unlocked: true, unlockedDate: "2025-01-06" },
            { name: "पंच सहस्त्र", count: 5000, icon: "⭐", unlocked: false },
            { name: "दश सहस्त्र", count: 10000, icon: "💎", unlocked: false },
            { name: "पच्चीस हजार", count: 25000, icon: "👑", unlocked: false },
            { name: "लाख जप योद्धा", count: 100000, icon: "🕉️", unlocked: false }
        ];

        // Enhanced achievements system
        this.achievements = [
            { 
                title: "प्रथम जप", 
                description: "आपने अपना पहला राम नाम जप पूरा किया", 
                target: 1, 
                icon: "🌟", 
                unlocked: true,
                unlockedDate: "2025-01-01"
            },
            { 
                title: "निरंतर साधक", 
                description: "7 दिन लगातार जप किया", 
                target: 7, 
                icon: "🔥", 
                unlocked: true,
                unlockedDate: "2025-01-08"
            },
            { 
                title: "भक्ति मार्गी", 
                description: "30 दिन का लक्ष्य पूरा किया", 
                target: 30, 
                icon: "🙏", 
                unlocked: false
            },
            { 
                title: "योग साधक", 
                description: "50,000 जप पूरे किए", 
                target: 50000, 
                icon: "🧘", 
                unlocked: false
            }
        ];

        // Stats calculation
        this.streakDays = 16;
        this.weeklyTotal = this.calculateWeeklyTotal();
        this.monthlyTotal = this.calculateMonthlyTotal();
        this.lifetimeTotal = this.calculateLifetimeTotal();

        // DOM elements
        this.loadingScreen = document.getElementById('loadingScreen');
        this.appContainer = document.getElementById('appContainer');
        this.tapArea = document.getElementById('tapArea');
        this.odometerContainer = document.getElementById('odometerContainer');
        this.ramImage = document.getElementById('ramImage');
        this.progressBar = document.getElementById('progressBar');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.dailyGoalDisplay = document.getElementById('dailyGoalDisplay');
        this.tapAudio = document.getElementById('tapAudio');

        // LEFT FAB elements
        this.footerToggleFab = document.getElementById('footerToggleFab');
        this.bottomNavigation = document.getElementById('bottomNavigation');
        this.fabIcon = document.getElementById('fabIcon');
        this.isFooterVisible = true;

        // Chart instances
        this.charts = {};
        this.isNavigating = false;

        // Initialize application
        this.init();
    }

    init() {
        this.loadData();
        this.checkDailyReset();
        this.setupEventListeners();
        this.initializeOdometer();
        this.updateUI();
        this.setupLeftFAB(); // Setup LEFT side FAB
        this.hideLoadingScreen();
    }

    // LEFT FAB FUNCTIONALITY
    setupLeftFAB() {
        if (this.footerToggleFab) {
            this.footerToggleFab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleFooterNavigation();
            });
        }
    }

    toggleFooterNavigation() {
        if (!this.bottomNavigation) return;

        this.isFooterVisible = !this.isFooterVisible;
        
        if (this.isFooterVisible) {
            this.bottomNavigation.classList.remove('hidden');
            this.footerToggleFab.classList.remove('active');
            this.fabIcon.textContent = '≡';
        } else {
            this.bottomNavigation.classList.add('hidden');
            this.footerToggleFab.classList.add('active');
            this.fabIcon.textContent = '×';
        }

        // Animate FAB
        this.footerToggleFab.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.footerToggleFab.style.transform = 'scale(1)';
        }, 150);

        // Show toast notification
        this.showToast(
            this.isFooterVisible ? 'Navigation shown 📱' : 'Navigation hidden 🔒',
            2000
        );
    }

    loadData() {
        // Load from localStorage or use enhanced sample data
        const storedCount = localStorage.getItem('ramCounter_currentCount');
        const storedGoal = localStorage.getItem('ramCounter_dailyGoal');
        const storedSettings = localStorage.getItem('ramCounter_settings');
        const storedHistorical = localStorage.getItem('ramCounter_historical');
        const storedMilestones = localStorage.getItem('ramCounter_milestones');
        const storedAchievements = localStorage.getItem('ramCounter_achievements');

        if (storedCount !== null) {
            this.currentCount = parseInt(storedCount);
        }
        if (storedGoal !== null) {
            this.dailyGoal = parseInt(storedGoal);
        }
        if (storedSettings !== null) {
            this.settings = JSON.parse(storedSettings);
        }
        if (storedHistorical !== null) {
            this.historicalData = JSON.parse(storedHistorical);
        }
        if (storedMilestones !== null) {
            this.milestones = JSON.parse(storedMilestones);
        }
        if (storedAchievements !== null) {
            this.achievements = JSON.parse(storedAchievements);
        }

        this.lastDate = localStorage.getItem('ramCounter_lastDate') || this.getTodayString();
    }

    saveData() {
        localStorage.setItem('ramCounter_currentCount', this.currentCount.toString());
        localStorage.setItem('ramCounter_dailyGoal', this.dailyGoal.toString());
        localStorage.setItem('ramCounter_lastDate', this.lastDate);
        localStorage.setItem('ramCounter_settings', JSON.stringify(this.settings));
        localStorage.setItem('ramCounter_historical', JSON.stringify(this.historicalData));
        localStorage.setItem('ramCounter_milestones', JSON.stringify(this.milestones));
        localStorage.setItem('ramCounter_achievements', JSON.stringify(this.achievements));
    }

    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    checkDailyReset() {
        const today = this.getTodayString();
        if (this.lastDate !== today) {
            // Save yesterday's data
            if (this.currentCount > 0) {
                this.historicalData[this.lastDate] = this.currentCount;
            }
            // Reset for new day
            this.currentCount = 0;
            this.lastDate = today;
            this.saveData();
        }
    }

    // ENHANCED STATS CALCULATION
    calculateWeeklyTotal() {
        const today = new Date();
        let total = this.currentCount;
        
        for (let i = 1; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            total += this.historicalData[dateStr] || 0;
        }
        
        return total;
    }

    calculateMonthlyTotal() {
        const today = new Date();
        let total = this.currentCount;
        
        for (let i = 1; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            total += this.historicalData[dateStr] || 0;
        }
        
        return total;
    }

    calculateLifetimeTotal() {
        let total = this.currentCount;
        Object.values(this.historicalData).forEach(count => {
            total += count;
        });
        return total;
    }

    setupEventListeners() {
        // Enhanced tap area for counting
        if (this.tapArea) {
            this.tapArea.addEventListener('click', (e) => {
                const homeScreen = document.getElementById('homeScreen');
                if (homeScreen && homeScreen.classList.contains('active')) {
                    this.handleTap(e);
                }
            });
            
            this.tapArea.addEventListener('touchstart', (e) => {
                const homeScreen = document.getElementById('homeScreen');
                if (homeScreen && homeScreen.classList.contains('active')) {
                    e.preventDefault();
                    this.handleTap(e);
                }
            }, { passive: false });
        }

        // Navigation setup
        this.setupNavigation();
        
        // Settings
        this.setupSettings();
        
        // Modal handlers
        this.setupModals();
        
        // Share functionality
        this.setupShare();

        // Audio setup
        if (this.tapAudio) {
            this.tapAudio.volume = this.settings.volume / 100;
        }

        // Progress ring setup
        this.updateProgressRing();
    }

    setupNavigation() {
        setTimeout(() => {
            const navTabs = document.querySelectorAll('.nav-tab');
            const screens = document.querySelectorAll('.screen');
            
            navTabs.forEach((tab) => {
                tab.removeEventListener('click', this.handleNavClick);
                
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (this.isNavigating) return;
                    this.isNavigating = true;
                    
                    const targetScreenId = tab.getAttribute('data-screen');
                    
                    if (!targetScreenId) {
                        this.isNavigating = false;
                        return;
                    }
                    
                    // Update active states
                    navTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    // Hide all screens
                    screens.forEach(s => {
                        s.classList.remove('active');
                        s.style.display = 'none';
                    });
                    
                    // Show target screen
                    const targetScreen = document.getElementById(targetScreenId);
                    if (targetScreen) {
                        targetScreen.style.display = 'block';
                        targetScreen.offsetHeight; // Force reflow
                        targetScreen.classList.add('active');
                        
                        // Load screen-specific content
                        setTimeout(() => {
                            if (targetScreenId === 'dashboardScreen') {
                                this.updateDashboard();
                            } else if (targetScreenId === 'shareScreen') {
                                this.updateShareScreen();
                            } else if (targetScreenId === 'settingsScreen') {
                                this.updateSettingsScreen();
                            }
                            this.isNavigating = false;
                        }, 100);
                    } else {
                        this.isNavigating = false;
                        // Restore home screen
                        const homeScreen = document.getElementById('homeScreen');
                        if (homeScreen) {
                            homeScreen.style.display = 'block';
                            homeScreen.classList.add('active');
                        }
                        const homeTab = document.querySelector('[data-screen="homeScreen"]');
                        if (homeTab) {
                            navTabs.forEach(t => t.classList.remove('active'));
                            homeTab.classList.add('active');
                        }
                    }
                });
            });

            // Ensure home screen is visible initially
            const homeScreen = document.getElementById('homeScreen');
            const homeTab = document.querySelector('[data-screen="homeScreen"]');
            
            if (homeScreen) {
                homeScreen.style.display = 'block';
                homeScreen.classList.add('active');
            }
            
            if (homeTab) {
                homeTab.classList.add('active');
            }
        }, 100);
    }

    setupSettings() {
        const dailyGoalInput = document.getElementById('dailyGoalInput');
        const soundToggle = document.getElementById('soundToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeDisplay = document.getElementById('volumeDisplay');
        const resetBtn = document.getElementById('resetCounterBtn');

        if (dailyGoalInput) {
            dailyGoalInput.value = this.dailyGoal;
            dailyGoalInput.addEventListener('change', (e) => {
                const newGoal = parseInt(e.target.value) || 2400;
                if (newGoal >= 108 && newGoal <= 15000) {
                    this.dailyGoal = newGoal;
                    this.saveData();
                    this.updateUI();
                    this.showToast('Daily goal updated! 🎯');
                } else {
                    e.target.value = this.dailyGoal;
                    this.showToast('Please enter a valid goal (108-15,000)', 3000);
                }
            });
        }

        if (soundToggle) {
            soundToggle.checked = this.settings.soundEnabled;
            soundToggle.addEventListener('change', (e) => {
                this.settings.soundEnabled = e.target.checked;
                this.saveData();
                this.showToast(
                    this.settings.soundEnabled ? 'Sound enabled 🔊' : 'Sound disabled 🔇'
                );
            });
        }

        if (volumeSlider) {
            volumeSlider.value = this.settings.volume;
            if (volumeDisplay) {
                volumeDisplay.textContent = this.settings.volume;
            }

            volumeSlider.addEventListener('input', (e) => {
                this.settings.volume = parseInt(e.target.value);
                if (volumeDisplay) {
                    volumeDisplay.textContent = this.settings.volume;
                }
                if (this.tapAudio) {
                    this.tapAudio.volume = this.settings.volume / 100;
                }
                this.saveData();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showResetModal();
            });
        }
    }

    updateSettingsScreen() {
        const dailyGoalInput = document.getElementById('dailyGoalInput');
        const soundToggle = document.getElementById('soundToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeDisplay = document.getElementById('volumeDisplay');

        if (dailyGoalInput) dailyGoalInput.value = this.dailyGoal;
        if (soundToggle) soundToggle.checked = this.settings.soundEnabled;
        if (volumeSlider) volumeSlider.value = this.settings.volume;
        if (volumeDisplay) volumeDisplay.textContent = this.settings.volume;
    }

    setupModals() {
        const confirmModal = document.getElementById('confirmModal');
        const cancelReset = document.getElementById('cancelReset');
        const confirmReset = document.getElementById('confirmReset');

        if (cancelReset) {
            cancelReset.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirmModal) confirmModal.classList.add('hidden');
            });
        }

        if (confirmReset) {
            confirmReset.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetCounter();
                if (confirmModal) confirmModal.classList.add('hidden');
            });
        }

        if (confirmModal) {
            confirmModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    confirmModal.classList.add('hidden');
                }
            });
        }
    }

    setupShare() {
        const whatsappBtn = document.getElementById('whatsappShareBtn');
        const socialBtn = document.getElementById('socialShareBtn');
        const copyBtn = document.getElementById('copyLinkBtn');

        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.shareToWhatsApp();
            });
        }

        if (socialBtn) {
            socialBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.shareToSocial();
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyLink();
            });
        }
    }

    // PROFESSIONAL ODOMETER SYSTEM
    initializeOdometer() {
        this.displayCount = this.currentCount;
        this.updateOdometer(this.currentCount, false);
    }

    updateOdometer(newValue, animate = true) {
        const container = this.odometerContainer;
        if (!container) return;

        const oldValue = this.displayCount || 0;
        const oldStr = oldValue.toString().split('');
        const newStr = newValue.toString().split('');
        const maxLength = Math.max(oldStr.length, newStr.length, 4);

        // Pad with zeros
        while (oldStr.length < maxLength) oldStr.unshift('0');
        while (newStr.length < maxLength) newStr.unshift('0');

        // Clear and rebuild odometer
        container.innerHTML = '';

        for (let i = 0; i < maxLength; i++) {
            const digitContainer = document.createElement('div');
            digitContainer.className = 'odometer-digit';

            if (animate && oldStr[i] !== newStr[i]) {
                // Create animated transition
                const oldDigit = document.createElement('div');
                oldDigit.className = 'digit-old';
                oldDigit.textContent = oldStr[i];

                const newDigit = document.createElement('div');
                newDigit.className = 'digit-new';
                newDigit.textContent = newStr[i];

                digitContainer.appendChild(oldDigit);
                digitContainer.appendChild(newDigit);

                // Clean up after animation
                setTimeout(() => {
                    digitContainer.innerHTML = '';
                    const currentDigit = document.createElement('div');
                    currentDigit.className = 'digit-current';
                    currentDigit.textContent = newStr[i];
                    digitContainer.appendChild(currentDigit);
                }, 800);
            } else {
                // Static digit
                const currentDigit = document.createElement('div');
                currentDigit.className = 'digit-current';
                currentDigit.textContent = animate ? oldStr[i] : newStr[i];
                digitContainer.appendChild(currentDigit);
            }

            container.appendChild(digitContainer);
        }

        this.displayCount = newValue;
    }

    // ENHANCED TAP HANDLING
    handleTap(e) {
        e.preventDefault();
        e.stopPropagation();

        const oldCount = this.currentCount;
        this.currentCount++;

        // Enhanced visual feedback
        if (this.ramImage) {
            this.ramImage.classList.add('animate');
            setTimeout(() => {
                this.ramImage.classList.remove('animate');
            }, 400);
        }

        // Play sound with enhanced effect
        if (this.settings.soundEnabled && this.tapAudio) {
            this.tapAudio.currentTime = 0;
            this.tapAudio.play().catch(e => console.log('Audio play failed:', e));
        }

        // Update odometer with animation
        this.updateOdometer(this.currentCount, true);

        // Update other UI elements
        this.updateUI();
        this.checkMilestones();
        this.checkAchievements();
        this.saveData();

        // Enhanced ripple effect
        this.createAdvancedRippleEffect(e);

        // Show milestone notification
        if (this.currentCount % 108 === 0 && this.currentCount > oldCount) {
            this.showMilestoneNotification(this.currentCount);
        }
    }

    createAdvancedRippleEffect(e) {
        const ripple = document.createElement('div');
        const rect = this.tapArea.getBoundingClientRect();
        const size = 80;
        const x = (e.clientX || (e.touches && e.touches[0].clientX) || rect.width / 2) - rect.left - size / 2;
        const y = (e.clientY || (e.touches && e.touches[0].clientY) || rect.height / 2) - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 153, 51, 0.6) 40%, transparent 80%);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: advanced-ripple 0.8s ease-out forwards;
            z-index: 100;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
        `;

        // Add enhanced ripple animation CSS
        if (!document.querySelector('#advanced-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'advanced-ripple-style';
            style.textContent = `
                @keyframes advanced-ripple {
                    0% { 
                        transform: scale(0) rotate(0deg); 
                        opacity: 0.8; 
                        box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
                    }
                    50% { 
                        transform: scale(2) rotate(180deg); 
                        opacity: 0.6; 
                        box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
                    }
                    100% { 
                        transform: scale(5) rotate(360deg); 
                        opacity: 0; 
                        box-shadow: 0 0 60px rgba(255, 215, 0, 0.2);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        this.tapArea.style.position = 'relative';
        this.tapArea.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
    }

    checkMilestones() {
        const lifetimeCount = this.calculateLifetimeTotal();
        
        this.milestones.forEach(milestone => {
            if (!milestone.unlocked && (this.currentCount >= milestone.count || lifetimeCount >= milestone.count)) {
                milestone.unlocked = true;
                milestone.unlockedDate = this.getTodayString();
                this.showMilestoneUnlockedNotification(milestone);
            }
        });
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked) {
                let shouldUnlock = false;
                
                if (achievement.target <= this.streakDays) {
                    shouldUnlock = true;
                } else if (achievement.target <= this.calculateLifetimeTotal()) {
                    shouldUnlock = true;
                }
                
                if (shouldUnlock) {
                    achievement.unlocked = true;
                    achievement.unlockedDate = this.getTodayString();
                    this.showAchievementUnlockedNotification(achievement);
                }
            }
        });
    }

    showMilestoneNotification(count) {
        if (count % 1000 === 0) {
            this.showToast(`🏆 Amazing! ${count.toLocaleString()} जप completed!`, 4000);
        } else if (count % 500 === 0) {
            this.showToast(`⭐ Great progress! ${count.toLocaleString()} जप!`, 3000);
        } else if (count % 108 === 0) {
            this.showToast(`🙏 Blessed milestone: ${count.toLocaleString()} जप`, 2000);
        }
    }

    showMilestoneUnlockedNotification(milestone) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2rem;">${milestone.icon}</div>
                <div>
                    <div style="font-weight: 700; color: #8B4513; font-size: 16px;">Milestone Unlocked!</div>
                    <div style="font-size: 14px; opacity: 0.8; margin-top: 4px;">${milestone.name} achieved</div>
                </div>
            </div>
        `;
        this.showCustomNotification(notification, 5000);
    }

    showAchievementUnlockedNotification(achievement) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2rem;">${achievement.icon}</div>
                <div>
                    <div style="font-weight: 700; color: #8B4513; font-size: 16px;">Achievement Unlocked!</div>
                    <div style="font-size: 14px; opacity: 0.8; margin-top: 4px;">${achievement.title}</div>
                </div>
            </div>
        `;
        this.showCustomNotification(notification, 5000);
    }

    showCustomNotification(content, duration = 3000) {
        const notification = document.createElement('div');
        notification.appendChild(content);
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFF8DC, #FFECB3);
            border: 2px solid #FFD700;
            padding: 20px;
            border-radius: 20px;
            z-index: 10000;
            box-shadow: 0 12px 32px rgba(139, 69, 19, 0.3);
            max-width: 320px;
            animation: notification-enter 0.5s ease-out;
        `;

        if (!document.querySelector('#notification-style')) {
            const style = document.createElement('style');
            style.id = 'notification-style';
            style.textContent = `
                @keyframes notification-enter {
                    0% { 
                        opacity: 0; 
                        transform: translateX(-50%) translateY(-30px) scale(0.9); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateX(-50%) translateY(0) scale(1); 
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'notification-enter 0.5s ease-out reverse';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 500);
            }
        }, duration);
    }

    updateUI() {
        // Update daily goal display
        if (this.dailyGoalDisplay) {
            this.dailyGoalDisplay.textContent = this.dailyGoal.toLocaleString();
        }

        // Calculate progress
        const progress = Math.min((this.currentCount / this.dailyGoal) * 100, 100);

        // Update progress bar
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${Math.round(progress)}%`;
        }

        // Update progress ring
        this.updateProgressRing();
        
        // Update stats
        this.weeklyTotal = this.calculateWeeklyTotal();
        this.monthlyTotal = this.calculateMonthlyTotal();
        this.lifetimeTotal = this.calculateLifetimeTotal();
    }

    updateProgressRing() {
        const circle = document.querySelector('.progress-ring-circle');
        if (!circle) return;

        const radius = 130;
        const circumference = 2 * Math.PI * radius;
        const progress = Math.min(this.currentCount / this.dailyGoal, 1);
        const offset = circumference - (progress * circumference);

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
    }

    // PROFESSIONAL DASHBOARD WITH ADVANCED CHARTS
    updateDashboard() {
        this.updateStats();
        setTimeout(() => {
            this.createAdvancedCharts();
            this.updateAdvancedAchievements();
            this.updateAdvancedMilestones();
        }, 250);
    }

    updateStats() {
        const todayCount = document.getElementById('todayCount');
        const weekTotal = document.getElementById('weekTotal');
        const monthTotal = document.getElementById('monthTotal');
        const lifetimeTotal = document.getElementById('lifetimeTotal');

        if (todayCount) todayCount.textContent = this.currentCount.toLocaleString();
        if (weekTotal) weekTotal.textContent = this.weeklyTotal.toLocaleString();
        if (monthTotal) monthTotal.textContent = this.monthlyTotal.toLocaleString();
        if (lifetimeTotal) lifetimeTotal.textContent = this.lifetimeTotal.toLocaleString();
    }

    createAdvancedCharts() {
        this.createProfessionalDailyChart();
        this.createProfessionalWeeklyChart();
        this.createProfessionalMonthlyChart();
    }

    createProfessionalDailyChart() {
        const canvas = document.getElementById('dailyChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        if (this.charts.daily) {
            this.charts.daily.destroy();
        }

        const last7Days = this.getLast7DaysData();
        const labels = last7Days.map(d => d.label);
        const data = last7Days.map(d => d.count);
        const goals = last7Days.map(() => this.dailyGoal);

        this.charts.daily = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Daily Japs',
                        data: data,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        borderWidth: 4,
                        fill: true,
                        tension: 0.5,
                        pointBackgroundColor: '#FFC185',
                        pointBorderColor: '#1FB8CD',
                        pointBorderWidth: 3,
                        pointRadius: 8,
                        pointHoverRadius: 12,
                        pointHoverBackgroundColor: '#B4413C',
                        pointHoverBorderColor: '#ECEBD5',
                        pointHoverBorderWidth: 4
                    },
                    {
                        label: 'Daily Goal',
                        data: goals,
                        borderColor: '#5D878F',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#8B4513',
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                weight: 'bold',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(139, 69, 19, 0.9)',
                        titleColor: '#FFD700',
                        bodyColor: '#FFFFFF',
                        borderColor: '#FFD700',
                        borderWidth: 2,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(139, 69, 19, 0.1)',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#8B4513',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(139, 69, 19, 0.1)',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#8B4513',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }

    createProfessionalWeeklyChart() {
        const canvas = document.getElementById('weeklyChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        if (this.charts.weekly) {
            this.charts.weekly.destroy();
        }

        const weeklyData = this.getWeeklyData();

        this.charts.weekly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weeklyData.map(d => d.day),
                datasets: [
                    {
                        label: 'Completed Japs',
                        data: weeklyData.map(d => d.count),
                        backgroundColor: '#DB4545',
                        borderColor: '#944454',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    },
                    {
                        label: 'Daily Goal',
                        data: weeklyData.map(d => d.goal),
                        backgroundColor: '#D2BA4C',
                        borderColor: '#964325',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#8B4513',
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                weight: 'bold',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(139, 69, 19, 0.9)',
                        titleColor: '#FFD700',
                        bodyColor: '#FFFFFF',
                        borderColor: '#FFD700',
                        borderWidth: 2,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(139, 69, 19, 0.1)'
                        },
                        ticks: {
                            color: '#8B4513',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#8B4513',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }

    createProfessionalMonthlyChart() {
        const canvas = document.getElementById('monthlyChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }

        const monthlyGoal = this.dailyGoal * 30;
        const completed = this.monthlyTotal;
        const remaining = Math.max(0, monthlyGoal - completed);

        this.charts.monthly = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [completed, remaining],
                    backgroundColor: [
                        '#13343B',
                        '#ECEBD5'
                    ],
                    borderColor: [
                        '#1FB8CD',
                        '#FFC185'
                    ],
                    borderWidth: 4,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#8B4513',
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                weight: 'bold',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(139, 69, 19, 0.9)',
                        titleColor: '#FFD700',
                        bodyColor: '#FFFFFF',
                        borderColor: '#FFD700',
                        borderWidth: 2,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    getLast7DaysData() {
        const data = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            let count;
            if (i === 0) {
                count = this.currentCount;
            } else {
                count = this.historicalData[dateStr] || 0;
            }
            
            data.push({
                label: date.getDate() + '/' + (date.getMonth() + 1),
                count: count,
                date: dateStr
            });
        }
        
        return data;
    }

    getWeeklyData() {
        const data = [];
        const today = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            let count;
            if (i === 0) {
                count = this.currentCount;
            } else {
                count = this.historicalData[dateStr] || 0;
            }
            
            data.push({
                day: days[date.getDay()],
                count: count,
                goal: this.dailyGoal,
                date: dateStr
            });
        }
        
        return data;
    }

    // ADVANCED ACHIEVEMENTS & MILESTONES
    updateAdvancedAchievements() {
        const container = document.getElementById('achievementsGrid');
        if (!container) return;

        container.innerHTML = '';

        this.achievements.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            
            card.innerHTML = `
                <div class="achievement-icon ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    ${achievement.icon}
                </div>
                <div class="achievement-content">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-status ${achievement.unlocked ? 'unlocked' : 'locked'}">
                        ${achievement.unlocked ? `Unlocked on ${achievement.unlockedDate}` : 'Locked'}
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
    }

    updateAdvancedMilestones() {
        const container = document.getElementById('milestonesGrid');
        if (!container) return;

        container.innerHTML = '';

        this.milestones.forEach(milestone => {
            const card = document.createElement('div');
            card.className = `milestone-card ${milestone.unlocked ? 'achieved' : ''}`;
            
            card.innerHTML = `
                <div class="milestone-icon">${milestone.icon}</div>
                <div class="milestone-content">
                    <div class="milestone-title">${milestone.name}</div>
                    <div class="milestone-description">${milestone.count.toLocaleString()} जप milestone</div>
                </div>
                <div class="milestone-badge">${milestone.unlocked ? 'Achieved' : 'Locked'}</div>
            `;
            
            container.appendChild(card);
        });
    }

    // ATTRACTIVE SHARE FUNCTIONALITY
    updateShareScreen() {
        const shareCountDisplay = document.getElementById('shareCountDisplay');
        const shareGoalDisplay = document.getElementById('shareGoalDisplay');
        const shareProgressBar = document.getElementById('shareProgressBar');
        const shareProgressText = document.getElementById('shareProgressText');
        const messagePreview = document.getElementById('messagePreview');

        if (shareCountDisplay) {
            shareCountDisplay.textContent = this.currentCount.toLocaleString();
        }

        if (shareGoalDisplay) {
            shareGoalDisplay.textContent = this.dailyGoal.toLocaleString();
        }

        const progress = Math.min((this.currentCount / this.dailyGoal) * 100, 100);

        if (shareProgressBar) {
            shareProgressBar.style.width = `${progress}%`;
        }

        if (shareProgressText) {
            shareProgressText.textContent = `${Math.round(progress)}%`;
        }

        if (messagePreview) {
            const messageContent = messagePreview.querySelector('.message-content');
            if (messageContent) {
                messageContent.innerHTML = `
                    मैं राम नाम जप काउंटर Pro का उपयोग कर आज <strong>${this.currentCount.toLocaleString()}</strong> बार राम नाम का जप किया हूँ। 
                    यह अद्भुत आध्यात्मिक यात्रा में आप भी जुड़ें! 🙏✨
                `;
            }
        }
    }

    shareToWhatsApp() {
        const progress = Math.round((this.currentCount / this.dailyGoal) * 100);
        const message = `🙏 राम नाम जप काउंटर Pro 🙏

आज की आध्यात्मिक उपलब्धि:
📿 ${this.currentCount.toLocaleString()} राम नाम जप completed
🎯 Daily Goal: ${this.dailyGoal.toLocaleString()}
📈 Progress: ${progress}%

यह सप्ताह: ${this.weeklyTotal.toLocaleString()} जप
यह महीना: ${this.monthlyTotal.toLocaleString()} जप
जीवनकाल: ${this.lifetimeTotal.toLocaleString()} जप

आप भी इस दिव्य यात्रा में जुड़ें! ✨

#रामनाम #जप #आध्यात्म #भक्ति #ध्यान`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        
        this.showToast('Opening WhatsApp... 💬', 2000);
    }

    shareToSocial() {
        const progress = Math.round((this.currentCount / this.dailyGoal) * 100);
        const message = `🙏 राम नाम जप काउंटर Pro के साथ आज ${this.currentCount.toLocaleString()} बार राम नाम का जप पूरा किया! 

📈 Progress: ${progress}%
🎯 Goal: ${this.dailyGoal.toLocaleString()}
⏰ Streak: ${this.streakDays} days

यह अद्भुत आध्यात्मिक यात्रा में जुड़ें। ✨

#रामनाम #जप #आध्यात्म #भक्ति #ध्यान #RamNaam`;
        
        if (navigator.share) {
            navigator.share({
                title: 'राम नाम जप काउंटर Pro - आध्यात्मिक प्रगति',
                text: message,
                url: window.location.href
            }).catch(console.error);
        } else {
            this.copyToClipboard(message);
            this.showToast('Message copied! You can paste it on social media. 📱', 3000);
        }
    }

    copyLink() {
        const appLink = `${window.location.href}

🙏 राम नाम जप काउंटर Pro
Professional spiritual counter for devotional practice

Features:
✨ Professional Analytics Dashboard
📊 Advanced Progress Tracking  
🏆 Achievement Milestones
📱 Smart Social Sharing
🎯 Customizable Goals`;

        this.copyToClipboard(appLink);
        this.showToast('App link copied to clipboard! 📋✨', 3000);
    }

    copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(() => {
                this.fallbackCopyTextToClipboard(text);
            });
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Could not copy text: ', err);
        }

        document.body.removeChild(textArea);
    }

    // ENHANCED TOAST NOTIFICATIONS
    showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #8B4513, #654321);
            color: white;
            padding: 16px 24px;
            border-radius: 28px;
            font-size: 14px;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 12px 32px rgba(139, 69, 19, 0.4);
            backdrop-filter: blur(12px);
            border: 2px solid rgba(255, 215, 0, 0.3);
            max-width: 320px;
            text-align: center;
            animation: enhanced-toast-enter 0.4s ease-out;
        `;

        // Add enhanced toast animation CSS
        if (!document.querySelector('#enhanced-toast-style')) {
            const style = document.createElement('style');
            style.id = 'enhanced-toast-style';
            style.textContent = `
                @keyframes enhanced-toast-enter {
                    0% { 
                        opacity: 0; 
                        transform: translateX(-50%) translateY(30px) scale(0.9); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateX(-50%) translateY(0) scale(1); 
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.animation = 'enhanced-toast-enter 0.4s ease-out reverse';
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 400);
            }
        }, duration);
    }

    showResetModal() {
        const modal = document.getElementById('confirmModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    resetCounter() {
        const oldCount = this.currentCount;
        this.currentCount = 0;
        this.updateOdometer(0, true);
        this.updateUI();
        this.saveData();
        
        this.showToast(`Counter reset! Previous: ${oldCount.toLocaleString()} 🔄`, 3000);
    }

    hideLoadingScreen() {
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.style.opacity = '0';
            }
            if (this.appContainer) {
                this.appContainer.classList.add('loaded');
            }

            setTimeout(() => {
                if (this.loadingScreen) {
                    this.loadingScreen.style.display = 'none';
                }
            }, 500);
        }, 2500); // Slightly longer loading for professional feel
    }
}

// External link handler
function openExternalLink(url) {
    if (url === '#') {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2rem;">📚</div>
                <div>
                    <div style="font-weight: 700; color: #8B4513; font-size: 16px;">Resource Opening</div>
                    <div style="font-size: 12px; opacity: 0.8;">External spiritual resource would open here</div>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFF8DC, #FFECB3);
            border: 2px solid #FFD700;
            padding: 20px 24px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 12px 32px rgba(139, 69, 19, 0.3);
            max-width: 320px;
            animation: resource-enter 0.4s ease-out;
        `;

        if (!document.querySelector('#resource-style')) {
            const style = document.createElement('style');
            style.id = 'resource-style';
            style.textContent = `
                @keyframes resource-enter {
                    0% { 
                        opacity: 0; 
                        transform: translateX(-50%) translateY(-20px) scale(0.95); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateX(-50%) translateY(0) scale(1); 
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 4000);
    } else {
        window.open(url, '_blank');
    }
}

// ENHANCED DOM INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    console.log('राम नाम जप काउंटर Pro v2.4 initializing...');
    
    // Wait for all elements to be ready
    setTimeout(() => {
        window.ramJapCounterPro = new RamJapCounterPro();
        console.log('राम नाम जप काउंटर Pro v2.4 initialized successfully with enhanced features');
    }, 200);
});

// Enhanced page lifecycle management
document.addEventListener('visibilitychange', () => {
    if (window.ramJapCounterPro && document.visibilityState === 'hidden') {
        window.ramJapCounterPro.saveData();
    }
});

window.addEventListener('beforeunload', () => {
    if (window.ramJapCounterPro) {
        window.ramJapCounterPro.saveData();
    }
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (window.ramJapCounterPro) {
            window.ramJapCounterPro.updateProgressRing();
            // Refresh charts on orientation change
            if (window.ramJapCounterPro.charts) {
                Object.values(window.ramJapCounterPro.charts).forEach(chart => {
                    if (chart && typeof chart.resize === 'function') {
                        chart.resize();
                    }
                });
            }
        }
    }, 500);
});

window.addEventListener('resize', () => {
    if (window.ramJapCounterPro) {
        window.ramJapCounterPro.updateProgressRing();
        // Debounce chart resize
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
            if (window.ramJapCounterPro.charts) {
                Object.values(window.ramJapCounterPro.charts).forEach(chart => {
                    if (chart && typeof chart.resize === 'function') {
                        chart.resize();
                    }
                });
            }
        }, 300);
    }
});

// Enhanced touch experience
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.tap-area') || e.target.closest('.footer-toggle-fab')) {
        e.preventDefault();
    }
});

document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1 && e.target.closest('.tap-area')) {
        e.preventDefault();
    }
}, { passive: false });

// Professional error handling
window.addEventListener('error', (e) => {
    console.error('राम नाम जप काउंटर Pro v2.4 Error:', e.error);
    if (window.ramJapCounterPro) {
        window.ramJapCounterPro.showToast('An error occurred. App data is safe. 🛡️', 3000);
    }
});

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Feature detection and polyfills
if (!Number.prototype.toLocaleString) {
    Number.prototype.toLocaleString = function() {
        return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
}

// Performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload animations and styles
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = 'style.css';
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RamJapCounterPro;
}

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker could be implemented for offline functionality
    });
}