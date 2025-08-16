// राम नाम जप काउंटर Pro - Professional JavaScript Application (Fixed)

class RamJapCounterPro {
    constructor() {
        // Initialize app state with sample data
        this.currentCount = 847;
        this.dailyGoal = 2400;
        this.lastDate = this.getTodayString();
        this.settings = {
            soundEnabled: true,
            volume: 50
        };

        // Sample professional data
        this.historicalData = {
            '2025-08-16': 847,
            '2025-08-15': 2400,
            '2025-08-14': 1876,
            '2025-08-13': 2100,
            '2025-08-12': 1950,
            '2025-08-11': 2400,
            '2025-08-10': 1654,
            '2025-08-09': 2225,
            '2025-08-08': 1789,
            '2025-08-07': 2156
        };

        this.achievements = [
            { name: "शतक पूर्ण", count: 100, unlocked: true },
            { name: "सहस्त्र पूर्ण", count: 1000, unlocked: true },
            { name: "दैनिक लक्ष्य", count: 2400, unlocked: true },
            { name: "पंच सहस्त्र", count: 5000, unlocked: false }
        ];

        this.streakDays = 15;
        this.weeklyTotal = 15237;
        this.monthlyTotal = 58490;

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
        this.hideLoadingScreen();
    }

    loadData() {
        // Load from localStorage or use sample data
        const storedCount = localStorage.getItem('ramCounter_currentCount');
        const storedGoal = localStorage.getItem('ramCounter_dailyGoal');
        const storedSettings = localStorage.getItem('ramCounter_settings');
        const storedHistorical = localStorage.getItem('ramCounter_historical');

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

        this.lastDate = localStorage.getItem('ramCounter_lastDate') || this.getTodayString();
    }

    saveData() {
        localStorage.setItem('ramCounter_currentCount', this.currentCount.toString());
        localStorage.setItem('ramCounter_dailyGoal', this.dailyGoal.toString());
        localStorage.setItem('ramCounter_lastDate', this.lastDate);
        localStorage.setItem('ramCounter_settings', JSON.stringify(this.settings));
        localStorage.setItem('ramCounter_historical', JSON.stringify(this.historicalData));
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

    setupEventListeners() {
        // FIXED: Tap area for counting - only on home screen
        if (this.tapArea) {
            this.tapArea.addEventListener('click', (e) => {
                // Only handle taps on home screen
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

        // FIXED: Navigation setup
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
        const navTabs = document.querySelectorAll('.nav-tab');
        const screens = document.querySelectorAll('.screen');

        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // FIXED: Prevent event bubbling
                
                if (this.isNavigating) return; // Prevent double navigation
                this.isNavigating = true;
                
                const targetScreenId = tab.getAttribute('data-screen');
                console.log('Navigating to:', targetScreenId); // Debug log
                
                if (!targetScreenId) {
                    this.isNavigating = false;
                    return;
                }
                
                // Update nav tabs
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update screens
                screens.forEach(s => s.classList.remove('active'));
                const targetScreen = document.getElementById(targetScreenId);
                
                if (targetScreen) {
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
                    console.error('Target screen not found:', targetScreenId);
                    this.isNavigating = false;
                }
            });
        });
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
                if (newGoal >= 1 && newGoal <= 10000) {
                    this.dailyGoal = newGoal;
                    this.saveData();
                    this.updateUI();
                } else {
                    e.target.value = this.dailyGoal;
                }
            });
        }

        if (soundToggle) {
            soundToggle.checked = this.settings.soundEnabled;
            soundToggle.addEventListener('change', (e) => {
                this.settings.soundEnabled = e.target.checked;
                this.saveData();
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

        if (dailyGoalInput) {
            dailyGoalInput.value = this.dailyGoal;
        }
        if (soundToggle) {
            soundToggle.checked = this.settings.soundEnabled;
        }
        if (volumeSlider) {
            volumeSlider.value = this.settings.volume;
        }
        if (volumeDisplay) {
            volumeDisplay.textContent = this.settings.volume;
        }
    }

    setupModals() {
        const confirmModal = document.getElementById('confirmModal');
        const cancelReset = document.getElementById('cancelReset');
        const confirmReset = document.getElementById('confirmReset');

        if (cancelReset) {
            cancelReset.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirmModal) {
                    confirmModal.classList.add('hidden');
                }
            });
        }

        if (confirmReset) {
            confirmReset.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetCounter();
                if (confirmModal) {
                    confirmModal.classList.add('hidden');
                }
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

    // FIXED: Professional Odometer Animation System
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

    handleTap(e) {
        e.preventDefault();
        e.stopPropagation();

        const oldCount = this.currentCount;
        this.currentCount++;

        console.log('Tap handled, count:', this.currentCount); // Debug log

        // FIXED: Professional visual feedback
        if (this.ramImage) {
            this.ramImage.classList.add('animate');
            setTimeout(() => {
                this.ramImage.classList.remove('animate');
            }, 300);
        }

        // Play sound
        if (this.settings.soundEnabled && this.tapAudio) {
            this.tapAudio.currentTime = 0;
            this.tapAudio.play().catch(e => console.log('Audio play failed:', e));
        }

        // FIXED: Update odometer with animation
        this.updateOdometer(this.currentCount, true);

        // Update other UI elements
        this.updateUI();
        this.saveData();

        // Add ripple effect
        this.createRippleEffect(e);
    }

    createRippleEffect(e) {
        const ripple = document.createElement('div');
        const rect = this.tapArea.getBoundingClientRect();
        const size = 60;
        const x = (e.clientX || (e.touches && e.touches[0].clientX) || rect.width / 2) - rect.left - size / 2;
        const y = (e.clientY || (e.touches && e.touches[0].clientY) || rect.height / 2) - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out forwards;
            z-index: 100;
        `;

        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    0% { transform: scale(0); opacity: 0.6; }
                    100% { transform: scale(4); opacity: 0; }
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
        }, 600);
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
    }

    updateProgressRing() {
        const circle = document.querySelector('.progress-ring-circle');
        if (!circle) return;

        const radius = 120;
        const circumference = 2 * Math.PI * radius;
        const progress = Math.min(this.currentCount / this.dailyGoal, 1);
        const offset = circumference - (progress * circumference);

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Professional Dashboard with Charts
    updateDashboard() {
        this.updateStats();
        setTimeout(() => {
            this.createCharts();
            this.updateMilestones();
        }, 200);
    }

    updateStats() {
        const todayCount = document.getElementById('todayCount');
        const streakDays = document.getElementById('streakDays');
        const weekTotal = document.getElementById('weekTotal');
        const monthTotal = document.getElementById('monthTotal');

        if (todayCount) todayCount.textContent = this.currentCount.toLocaleString();
        if (streakDays) streakDays.textContent = this.streakDays;
        if (weekTotal) weekTotal.textContent = this.weeklyTotal.toLocaleString();
        if (monthTotal) monthTotal.textContent = this.monthlyTotal.toLocaleString();
    }

    createCharts() {
        this.createDailyChart();
        this.createWeeklyChart();
        this.createMonthlyChart();
    }

    createDailyChart() {
        const canvas = document.getElementById('dailyChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        // Destroy existing chart
        if (this.charts.daily) {
            this.charts.daily.destroy();
        }

        // Prepare data
        const last7Days = this.getLast7DaysData();
        const labels = last7Days.map(d => d.label);
        const data = last7Days.map(d => d.count);

        this.charts.daily = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Japs',
                    data: data,
                    borderColor: '#FF9933',
                    backgroundColor: 'rgba(255, 153, 51, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#FFD700',
                    pointBorderColor: '#FF6600',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(139, 69, 19, 0.1)'
                        },
                        ticks: {
                            color: '#8B4513'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(139, 69, 19, 0.1)'
                        },
                        ticks: {
                            color: '#8B4513'
                        }
                    }
                }
            }
        });
    }

    createWeeklyChart() {
        const canvas = document.getElementById('weeklyChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        // Destroy existing chart
        if (this.charts.weekly) {
            this.charts.weekly.destroy();
        }

        const weeklyData = [
            { day: 'Mon', count: 2100, goal: 2400 },
            { day: 'Tue', count: 1950, goal: 2400 },
            { day: 'Wed', count: 2400, goal: 2400 },
            { day: 'Thu', count: 1654, goal: 2400 },
            { day: 'Fri', count: 2225, goal: 2400 },
            { day: 'Sat', count: 1789, goal: 2400 },
            { day: 'Sun', count: this.currentCount, goal: 2400 }
        ];

        this.charts.weekly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weeklyData.map(d => d.day),
                datasets: [
                    {
                        label: 'Completed',
                        data: weeklyData.map(d => d.count),
                        backgroundColor: '#FF9933',
                        borderColor: '#FF6600',
                        borderWidth: 1,
                        borderRadius: 6
                    },
                    {
                        label: 'Goal',
                        data: weeklyData.map(d => d.goal),
                        backgroundColor: 'rgba(255, 215, 0, 0.3)',
                        borderColor: '#FFD700',
                        borderWidth: 2,
                        borderRadius: 6,
                        type: 'line'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#8B4513',
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(139, 69, 19, 0.1)'
                        },
                        ticks: {
                            color: '#8B4513'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#8B4513'
                        }
                    }
                }
            }
        });
    }

    createMonthlyChart() {
        const canvas = document.getElementById('monthlyChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        // Destroy existing chart
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
                        '#FF9933',
                        'rgba(255, 215, 0, 0.2)'
                    ],
                    borderColor: [
                        '#FF6600',
                        'rgba(255, 215, 0, 0.4)'
                    ],
                    borderWidth: 2
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
                            padding: 15
                        }
                    }
                },
                cutout: '60%'
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
                count = this.historicalData[dateStr] || Math.floor(Math.random() * 2000) + 500;
            }
            
            data.push({
                label: date.getDate().toString(),
                count: count,
                date: dateStr
            });
        }
        
        return data;
    }

    updateMilestones() {
        const container = document.getElementById('milestonesGrid');
        if (!container) return;

        const milestones = [
            { title: 'शतक पूर्ण', target: 100, icon: '💯', description: '100 जप completed' },
            { title: 'सहस्त्र पूर्ण', target: 1000, icon: '🏆', description: '1,000 जप milestone' },
            { title: 'दैनिक लक्ष्य', target: this.dailyGoal, icon: '🎯', description: 'Daily goal achieved' },
            { title: 'पंच सहस्त्र', target: 5000, icon: '⭐', description: '5,000 जप milestone' },
            { title: 'दश सहस्त्र', target: 10000, icon: '💎', description: '10,000 जप milestone' },
            { title: 'मासिक योद्धा', target: this.dailyGoal * 30, icon: '🏅', description: 'Monthly champion' }
        ];

        const lifetimeTotal = this.calculateLifetimeTotal();

        container.innerHTML = '';

        milestones.forEach(milestone => {
            const achieved = lifetimeTotal >= milestone.target || this.currentCount >= milestone.target;
            
            const card = document.createElement('div');
            card.className = `milestone-card ${achieved ? 'achieved' : ''}`;
            
            card.innerHTML = `
                <div class="milestone-icon">${milestone.icon}</div>
                <div class="milestone-content">
                    <div class="milestone-title">${milestone.title}</div>
                    <div class="milestone-description">${milestone.description}</div>
                </div>
                <div class="milestone-badge">${achieved ? 'Achieved' : 'Locked'}</div>
            `;
            
            container.appendChild(card);
        });
    }

    calculateLifetimeTotal() {
        let total = this.currentCount;
        Object.values(this.historicalData).forEach(count => {
            total += count;
        });
        return total;
    }

    updateShareScreen() {
        const shareCountDisplay = document.getElementById('shareCountDisplay');
        const shareGoalDisplay = document.getElementById('shareGoalDisplay');
        const shareProgressBar = document.getElementById('shareProgressBar');
        const messagePreview = document.getElementById('messagePreview');

        if (shareCountDisplay) {
            shareCountDisplay.textContent = this.currentCount.toLocaleString();
        }

        if (shareGoalDisplay) {
            shareGoalDisplay.textContent = this.dailyGoal.toLocaleString();
        }

        if (shareProgressBar) {
            const progress = Math.min((this.currentCount / this.dailyGoal) * 100, 100);
            shareProgressBar.style.width = `${progress}%`;
        }

        if (messagePreview) {
            const message = `मैं 'राम नाम जप काउंटर Pro' का उपयोग कर रहा हूँ। आज मैंने ${this.currentCount.toLocaleString()} बार राम नाम का जप किया। आप भी इस आध्यात्मिक यात्रा में जुड़ें 🙏✨ #रामनाम #जप #आध्यात्म`;
            messagePreview.textContent = message;
        }
    }

    shareToWhatsApp() {
        const message = `🙏 राम नाम जप काउंटर Pro 🙏\n\nआज मैंने ${this.currentCount.toLocaleString()} बार राम नाम का जप किया!\n\nलक्ष्य: ${this.dailyGoal.toLocaleString()} जप\nप्रगति: ${Math.round((this.currentCount / this.dailyGoal) * 100)}%\n\nआप भी इस आध्यात्मिक यात्रा में जुड़ें! ✨\n\n#रामनाम #जप #आध्यात्म`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    shareToSocial() {
        const message = `🙏 आज मैंने ${this.currentCount.toLocaleString()} बार राम नाम का जप किया! राम नाम जप काउंटर Pro के साथ अपनी आध्यात्मिक यात्रा जारी रखें। #रामनाम #जप #आध्यात्म ✨`;
        
        if (navigator.share) {
            navigator.share({
                title: 'राम नाम जप काउंटर Pro',
                text: message,
                url: window.location.href
            }).catch(console.error);
        } else {
            this.copyToClipboard(message);
            this.showToast('Message copied! You can paste it on social media.');
        }
    }

    copyLink() {
        const appUrl = window.location.href;
        this.copyToClipboard(appUrl);
        this.showToast('App link copied to clipboard! 📋');
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

    showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #8B4513, #654321);
            color: white;
            padding: 16px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 8px 24px rgba(139, 69, 19, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.3);
            max-width: 300px;
            text-align: center;
            animation: toast-enter 0.3s ease-out;
        `;

        // Add toast animation CSS if not exists
        if (!document.querySelector('#toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                @keyframes toast-enter {
                    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    100% { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.animation = 'toast-enter 0.3s ease-out reverse';
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
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
        this.currentCount = 0;
        this.updateOdometer(0, true);
        this.updateUI();
        this.saveData();
        this.showToast('Counter reset successfully! 🔄');
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
        }, 2000);
    }
}

// External link handler
function openExternalLink(url) {
    if (url === '#') {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 1.5rem;">📚</div>
                <div>
                    <div style="font-weight: 600; color: #8B4513;">Resource Opening</div>
                    <div style="font-size: 12px; opacity: 0.8;">External resource would open here</div>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFF8DC, #FFECB3);
            border: 2px solid #FFD700;
            padding: 16px 20px;
            border-radius: 16px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 8px 24px rgba(139, 69, 19, 0.2);
            max-width: 300px;
            animation: toast-enter 0.3s ease-out;
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    } else {
        window.open(url, '_blank');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing राम नाम जप काउंटर Pro...');
    window.ramJapCounterPro = new RamJapCounterPro();
});

// Handle page visibility for data saving
document.addEventListener('visibilitychange', () => {
    if (window.ramJapCounterPro && document.visibilityState === 'hidden') {
        window.ramJapCounterPro.saveData();
    }
});

// Save data before page unload
window.addEventListener('beforeunload', () => {
    if (window.ramJapCounterPro) {
        window.ramJapCounterPro.saveData();
    }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (window.ramJapCounterPro) {
            window.ramJapCounterPro.updateProgressRing();
        }
    }, 500);
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.ramJapCounterPro) {
        window.ramJapCounterPro.updateProgressRing();
    }
});

// Prevent context menu on tap area
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.tap-area')) {
        e.preventDefault();
    }
});

// Enhanced mobile experience
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1 && e.target.closest('.tap-area')) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Professional error handling
window.addEventListener('error', (e) => {
    console.error('राम नाम जप काउंटर Pro Error:', e.error);
});

// Feature detection
if (!Number.prototype.toLocaleString) {
    Number.prototype.toLocaleString = function() {
        return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RamJapCounterPro;
}