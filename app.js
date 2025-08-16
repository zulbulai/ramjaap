// राम नाम जप काउंटर Pro - Professional Spiritual Counter (Navigation Fixed)

class RamJapCounterPro {
    constructor() {
        // Initialize app state
        this.currentCount = 0;
        this.dailyGoal = 2400;
        this.lastDate = this.getTodayString();
        
        // Audio settings
        this.bgVolume = 0.3;
        this.tapVolume = 0.7;
        
        // Historical data
        this.historicalData = {};
        
        // Track user interaction for audio autoplay
        this.hasUserInteracted = false;
        this.audioContextUnlocked = false;

        // DOM elements
        this.loadingScreen = document.getElementById('loadingScreen');
        this.appContainer = document.getElementById('appContainer');
        this.tapArea = document.getElementById('tapArea');
        this.odometerContainer = document.getElementById('odometerContainer');
        this.ramImage = document.getElementById('ramImage');
        this.progressBar = document.getElementById('progressBar');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.dailyGoalDisplay = document.getElementById('dailyGoalDisplay');
        this.bgAudio = document.getElementById('bgAudio');
        this.tapAudio = document.getElementById('tapAudio');

        // Chart instances
        this.charts = {};

        // Initialize application
        this.init();
    }

    init() {
        this.loadData();
        this.checkDailyReset();
        this.setupEventListeners();
        this.initializeOdometer();
        this.setupAudio();
        this.updateUI();
        this.hideLoadingScreen();
    }

    loadData() {
        const storedCount = localStorage.getItem('ramjap_currentCount');
        const storedGoal = localStorage.getItem('ramjap_dailyGoal');
        const storedHistorical = localStorage.getItem('ramjap_historicalData');
        const storedBgVolume = localStorage.getItem('ramjap_bgVolume');
        const storedTapVolume = localStorage.getItem('ramjap_tapVolume');
        const storedLastDate = localStorage.getItem('ramjap_lastDate');

        if (storedCount !== null) {
            this.currentCount = parseInt(storedCount) || 0;
        }
        if (storedGoal !== null) {
            this.dailyGoal = parseInt(storedGoal) || 2400;
        }
        if (storedHistorical !== null) {
            try {
                this.historicalData = JSON.parse(storedHistorical) || {};
            } catch (e) {
                this.historicalData = {};
            }
        }
        if (storedBgVolume !== null) {
            this.bgVolume = parseFloat(storedBgVolume) || 0.3;
        }
        if (storedTapVolume !== null) {
            this.tapVolume = parseFloat(storedTapVolume) || 0.7;
        }
        if (storedLastDate !== null) {
            this.lastDate = storedLastDate;
        }
    }

    saveData() {
        localStorage.setItem('ramjap_currentCount', this.currentCount.toString());
        localStorage.setItem('ramjap_dailyGoal', this.dailyGoal.toString());
        localStorage.setItem('ramjap_lastDate', this.lastDate);
        localStorage.setItem('ramjap_historicalData', JSON.stringify(this.historicalData));
        localStorage.setItem('ramjap_bgVolume', this.bgVolume.toString());
        localStorage.setItem('ramjap_tapVolume', this.tapVolume.toString());
    }

    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    checkDailyReset() {
        const today = this.getTodayString();
        if (this.lastDate !== today) {
            if (this.currentCount > 0) {
                this.historicalData[this.lastDate] = this.currentCount;
            }
            this.currentCount = 0;
            this.lastDate = today;
            this.saveData();
        }
    }

    setupAudio() {
        if (this.bgAudio) {
            this.bgAudio.volume = this.bgVolume;
            this.bgAudio.loop = true;
        }
        if (this.tapAudio) {
            this.tapAudio.volume = this.tapVolume;
        }
    }

    async unlockAudioContext() {
        if (this.audioContextUnlocked) return;
        
        try {
            if (this.bgAudio) {
                await this.bgAudio.play();
                this.audioContextUnlocked = true;
                console.log('Audio context unlocked, background music started');
            }
        } catch (error) {
            console.log('Audio autoplay prevented, will start on user interaction:', error);
        }
    }

    setupEventListeners() {
        // Setup navigation with proper event delegation
        this.setupNavigation();
        
        // Setup tap area
        this.setupTapArea();
        
        // Other setups
        this.setupSettings();
        this.setupModals();
        this.setupShare();
        this.updateProgressRing();

        // Audio unlock
        document.addEventListener('click', () => {
            if (!this.hasUserInteracted) {
                this.handleFirstInteraction();
            }
        }, { once: true });
    }

    setupNavigation() {
        // COMPLETELY REWRITTEN NAVIGATION SYSTEM
        const footer = document.getElementById('stickyFooter');
        if (!footer) return;

        // Use event delegation on the footer container
        footer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // Find the nav tab that was clicked
            const navTab = e.target.closest('.nav-tab');
            if (!navTab) return;
            
            const targetScreenId = navTab.getAttribute('data-screen');
            console.log('Navigation clicked:', targetScreenId);
            
            if (!targetScreenId) return;
            
            this.navigateToScreen(targetScreenId);
        });

        console.log('Navigation system initialized with event delegation');
    }

    navigateToScreen(targetScreenId) {
        console.log('Navigating to:', targetScreenId);
        
        // Update navigation tabs
        const allNavTabs = document.querySelectorAll('.nav-tab');
        const allScreens = document.querySelectorAll('.screen');
        
        // Remove active class from all tabs and screens
        allNavTabs.forEach(tab => tab.classList.remove('active'));
        allScreens.forEach(screen => screen.classList.remove('active'));
        
        // Add active class to the target tab and screen
        const targetTab = document.querySelector(`[data-screen="${targetScreenId}"]`);
        const targetScreen = document.getElementById(targetScreenId);
        
        if (targetTab) {
            targetTab.classList.add('active');
            console.log('Tab activated:', targetScreenId);
        }
        
        if (targetScreen) {
            targetScreen.classList.add('active');
            console.log('Screen activated:', targetScreenId);
            
            // Load screen-specific content
            setTimeout(() => {
                this.loadScreenContent(targetScreenId);
            }, 100);
        }
    }

    loadScreenContent(screenId) {
        switch (screenId) {
            case 'dashboardScreen':
                this.updateDashboard();
                break;
            case 'shareScreen':
                this.updateShareScreen();
                break;
            case 'settingsScreen':
                this.updateSettingsScreen();
                break;
        }
    }

    setupTapArea() {
        if (!this.tapArea) return;

        const handleTapEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Only handle if on home screen
            const homeScreen = document.getElementById('homeScreen');
            if (!homeScreen || !homeScreen.classList.contains('active')) {
                return;
            }
            
            if (!this.hasUserInteracted) {
                this.handleFirstInteraction();
            }

            this.handleTap(e);
        };

        this.tapArea.addEventListener('click', handleTapEvent);
        this.tapArea.addEventListener('touchend', handleTapEvent, { passive: false });
    }

    handleFirstInteraction() {
        this.hasUserInteracted = true;
        this.unlockAudioContext();
    }

    setupSettings() {
        // Daily Goal Input
        const dailyGoalInput = document.getElementById('dailyGoalInput');
        if (dailyGoalInput) {
            // Remove existing listeners
            const newInput = dailyGoalInput.cloneNode(true);
            dailyGoalInput.parentNode.replaceChild(newInput, dailyGoalInput);
            
            newInput.addEventListener('change', (e) => {
                e.stopPropagation();
                const newGoal = parseInt(e.target.value) || 2400;
                if (newGoal >= 1 && newGoal <= 10000) {
                    this.dailyGoal = newGoal;
                    this.saveData();
                    this.updateUI();
                    console.log('Daily goal updated to:', newGoal);
                } else {
                    e.target.value = this.dailyGoal;
                }
            });
        }

        // Background Volume Slider
        const bgVolumeSlider = document.getElementById('bgVolumeSlider');
        const bgVolumeDisplay = document.getElementById('bgVolumeDisplay');
        if (bgVolumeSlider && bgVolumeDisplay) {
            bgVolumeSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                this.bgVolume = parseInt(e.target.value) / 100;
                bgVolumeDisplay.textContent = e.target.value;
                if (this.bgAudio) {
                    this.bgAudio.volume = this.bgVolume;
                }
                this.saveData();
                console.log('Background volume updated to:', this.bgVolume);
            });
        }

        // Tap Sound Volume Slider
        const tapVolumeSlider = document.getElementById('tapVolumeSlider');
        const tapVolumeDisplay = document.getElementById('tapVolumeDisplay');
        if (tapVolumeSlider && tapVolumeDisplay) {
            tapVolumeSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                this.tapVolume = parseInt(e.target.value) / 100;
                tapVolumeDisplay.textContent = e.target.value;
                if (this.tapAudio) {
                    this.tapAudio.volume = this.tapVolume;
                }
                this.saveData();
                console.log('Tap volume updated to:', this.tapVolume);
            });
        }

        // Export Button
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exportData();
            });
        }

        // Import Button
        const importBtn = document.getElementById('importDataBtn');
        const fileInput = document.getElementById('importFileInput');
        if (importBtn && fileInput) {
            importBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                e.stopPropagation();
                const file = e.target.files[0];
                if (file) {
                    this.importData(file);
                }
                fileInput.value = '';
            });
        }

        // Reset Button
        const resetBtn = document.getElementById('resetCounterBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showResetModal();
            });
        }
    }

    exportData() {
        const exportData = {
            currentCount: this.currentCount,
            dailyGoal: this.dailyGoal,
            historicalData: this.historicalData,
            bgVolume: this.bgVolume,
            tapVolume: this.tapVolume,
            lastDate: this.lastDate,
            exportDate: new Date().toISOString(),
            version: "1.0"
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `ram-jap-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
        this.showToast('Data exported successfully! 📤');
        console.log('Data exported successfully');
    }

    async importData(file) {
        try {
            const text = await file.text();
            const importedData = JSON.parse(text);

            if (!this.validateImportData(importedData)) {
                this.showToast('Invalid data format! ❌', 4000);
                return;
            }

            if (importedData.currentCount !== undefined) {
                this.currentCount = importedData.currentCount;
            }
            if (importedData.dailyGoal !== undefined) {
                this.dailyGoal = importedData.dailyGoal;
            }
            if (importedData.historicalData !== undefined) {
                this.historicalData = importedData.historicalData;
            }
            if (importedData.bgVolume !== undefined) {
                this.bgVolume = importedData.bgVolume;
            }
            if (importedData.tapVolume !== undefined) {
                this.tapVolume = importedData.tapVolume;
            }
            if (importedData.lastDate !== undefined) {
                this.lastDate = importedData.lastDate;
            }

            this.saveData();
            this.updateUI();
            this.updateSettingsScreen();
            this.updateOdometer(this.currentCount, true);
            this.setupAudio();

            this.showToast('Data imported successfully! 📥');
            console.log('Data imported successfully');

        } catch (error) {
            console.error('Import error:', error);
            this.showToast('Failed to import data! ❌', 4000);
        }
    }

    validateImportData(data) {
        if (typeof data !== 'object' || data === null) return false;
        
        const requiredFields = ['currentCount', 'dailyGoal'];
        for (const field of requiredFields) {
            if (!(field in data)) return false;
        }

        if (typeof data.currentCount !== 'number') return false;
        if (typeof data.dailyGoal !== 'number') return false;

        return true;
    }

    updateSettingsScreen() {
        const dailyGoalInput = document.getElementById('dailyGoalInput');
        const bgVolumeSlider = document.getElementById('bgVolumeSlider');
        const bgVolumeDisplay = document.getElementById('bgVolumeDisplay');
        const tapVolumeSlider = document.getElementById('tapVolumeSlider');
        const tapVolumeDisplay = document.getElementById('tapVolumeDisplay');

        if (dailyGoalInput) {
            dailyGoalInput.value = this.dailyGoal;
        }
        if (bgVolumeSlider && bgVolumeDisplay) {
            const bgVolume = Math.round(this.bgVolume * 100);
            bgVolumeSlider.value = bgVolume;
            bgVolumeDisplay.textContent = bgVolume;
        }
        if (tapVolumeSlider && tapVolumeDisplay) {
            const tapVolume = Math.round(this.tapVolume * 100);
            tapVolumeSlider.value = tapVolume;
            tapVolumeDisplay.textContent = tapVolume;
        }
        console.log('Settings screen updated');
    }

    setupModals() {
        const confirmModal = document.getElementById('confirmModal');
        const cancelReset = document.getElementById('cancelReset');
        const confirmReset = document.getElementById('confirmReset');

        if (cancelReset) {
            cancelReset.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirmModal) {
                    confirmModal.classList.add('hidden');
                }
            });
        }

        if (confirmReset) {
            confirmReset.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
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
                e.stopPropagation();
                this.shareToWhatsApp();
            });
        }

        if (socialBtn) {
            socialBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.shareToSocial();
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.copyLink();
            });
        }
    }

    initializeOdometer() {
        this.displayCount = this.currentCount;
        this.updateOdometer(this.currentCount, false);
    }

    updateOdometer(newValue, animate = true) {
        const container = this.odometerContainer;
        if (!container) return;

        const oldValue = this.displayCount || 0;
        const oldStr = oldValue.toString().padStart(4, '0');
        const newStr = newValue.toString().padStart(4, '0');

        const digits = container.querySelectorAll('.odometer-digit');

        for (let i = 0; i < 4; i++) {
            const digit = digits[i];
            if (!digit) continue;

            if (animate && oldStr[i] !== newStr[i]) {
                const oldDigit = document.createElement('div');
                oldDigit.className = 'digit-old';
                oldDigit.textContent = oldStr[i];

                const newDigit = document.createElement('div');
                newDigit.className = 'digit-new';
                newDigit.textContent = newStr[i];

                digit.innerHTML = '';
                digit.appendChild(oldDigit);
                digit.appendChild(newDigit);

                setTimeout(() => {
                    digit.innerHTML = '';
                    const currentDigit = document.createElement('div');
                    currentDigit.className = 'digit-current';
                    currentDigit.textContent = newStr[i];
                    digit.appendChild(currentDigit);
                }, 800);
            } else {
                digit.innerHTML = '';
                const currentDigit = document.createElement('div');
                currentDigit.className = 'digit-current';
                currentDigit.textContent = newStr[i];
                digit.appendChild(currentDigit);
            }
        }

        this.displayCount = newValue;
    }

    handleTap(e) {
        this.currentCount++;
        console.log('Tap registered! New count:', this.currentCount);

        if (this.ramImage) {
            this.ramImage.classList.add('animate');
            setTimeout(() => {
                this.ramImage.classList.remove('animate');
            }, 300);
        }

        if (this.tapAudio && this.hasUserInteracted) {
            try {
                this.tapAudio.currentTime = 0;
                this.tapAudio.play().catch(error => {
                    console.log('Tap audio play failed:', error);
                });
            } catch (error) {
                console.log('Audio error:', error);
            }
        }

        this.updateOdometer(this.currentCount, true);
        this.updateUI();
        this.saveData();
        this.createRippleEffect(e);
    }

    createRippleEffect(e) {
        if (!this.tapArea) return;

        const ripple = document.createElement('div');
        const rect = this.tapArea.getBoundingClientRect();
        const size = 60;
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if (e.clientX !== undefined) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else {
            clientX = rect.left + rect.width / 2;
            clientY = rect.top + rect.height / 2;
        }

        const x = clientX - rect.left - size / 2;
        const y = clientY - rect.top - size / 2;

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
            if (ripple && ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    updateUI() {
        if (this.dailyGoalDisplay) {
            this.dailyGoalDisplay.textContent = this.dailyGoal.toLocaleString();
        }

        const progress = Math.min((this.currentCount / this.dailyGoal) * 100, 100);

        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${Math.round(progress)}%`;
        }

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

    updateDashboard() {
        this.updateStats();
        setTimeout(() => {
            this.createCharts();
            this.updateMilestones();
        }, 300);
    }

    updateStats() {
        const todayCount = document.getElementById('todayCount');
        const streakDays = document.getElementById('streakDays');
        const weekTotal = document.getElementById('weekTotal');
        const monthTotal = document.getElementById('monthTotal');

        const streak = this.calculateStreak();
        const weeklyTotal = this.calculateWeeklyTotal();
        const monthlyTotal = this.calculateMonthlyTotal();

        if (todayCount) todayCount.textContent = this.currentCount.toLocaleString();
        if (streakDays) streakDays.textContent = streak;
        if (weekTotal) weekTotal.textContent = weeklyTotal.toLocaleString();
        if (monthTotal) monthTotal.textContent = monthlyTotal.toLocaleString();
    }

    calculateStreak() {
        let streak = 0;
        const today = new Date();
        
        if (this.currentCount > 0) {
            streak = 1;
        }
        
        for (let i = 1; i <= 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            if (this.historicalData[dateStr] && this.historicalData[dateStr] > 0) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    calculateWeeklyTotal() {
        let total = this.currentCount;
        const today = new Date();
        
        for (let i = 1; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            if (this.historicalData[dateStr]) {
                total += this.historicalData[dateStr];
            }
        }
        
        return total;
    }

    calculateMonthlyTotal() {
        let total = this.currentCount;
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        Object.keys(this.historicalData).forEach(dateStr => {
            const date = new Date(dateStr);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                total += this.historicalData[dateStr];
            }
        });
        
        return total;
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

        if (this.charts.daily) {
            this.charts.daily.destroy();
        }

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
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
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
                        label: 'Completed',
                        data: weeklyData.map(d => d.count),
                        backgroundColor: '#FFC185',
                        borderColor: '#FF6600',
                        borderWidth: 1,
                        borderRadius: 6
                    }
                ]
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

        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }

        const monthlyGoal = this.dailyGoal * 30;
        const completed = this.calculateMonthlyTotal();
        const remaining = Math.max(0, monthlyGoal - completed);

        this.charts.monthly = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [completed, remaining],
                    backgroundColor: [
                        '#B4413C',
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
                count = this.historicalData[dateStr] || 0;
            }
            
            data.push({
                label: date.getDate().toString(),
                count: count,
                date: dateStr
            });
        }
        
        return data;
    }

    getWeeklyData() {
        const data = [];
        const today = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
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
                day: dayNames[date.getDay()],
                count: count,
                goal: this.dailyGoal
            });
        }
        
        return data;
    }

    updateMilestones() {
        const container = document.getElementById('milestonesGrid');
        if (!container) return;

        const milestones = [
            { title: 'शुरुआत', target: 108, icon: '🌅', description: '108 जप completed' },
            { title: 'शतक पूर्ण', target: 100, icon: '💯', description: '100 जप milestone' },
            { title: 'सहस्त्र पूर्ण', target: 1000, icon: '🏆', description: '1,000 जप milestone' },
            { title: 'दैनिक लक्ष्य', target: this.dailyGoal, icon: '🎯', description: 'Daily goal achieved' },
            { title: 'पंच सहस्त्र', target: 5000, icon: '⭐', description: '5,000 जप milestone' },
            { title: 'दश सहस्त्र', target: 10000, icon: '💎', description: '10,000 जप milestone' },
            { title: 'पच्चीस हजार', target: 25000, icon: '👑', description: '25,000 जप milestone' },
            { title: 'लाख जप योद्धा', target: 100000, icon: '🗡️', description: '100,000 जप warrior' }
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
            const message = `मैं राम नाम जप काउंटर Pro का उपयोग कर रहा हूँ। आज मैंने ${this.currentCount.toLocaleString()} बार राम नाम का जप किया। आप भी इस आध्यात्मिक यात्रा में जुड़ें 🙏✨ #रामनाम #जप #आध्यात्म`;
            messagePreview.textContent = message;
        }
        console.log('Share screen updated');
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
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #8B4513, #654321);
            color: white;
            padding: 16px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            z-index: 15000;
            box-shadow: 0 8px 24px rgba(139, 69, 19, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.3);
            max-width: 300px;
            text-align: center;
            animation: toast-enter 0.3s ease-out;
        `;

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
                this.loadingScreen.style.transition = 'opacity 0.5s ease';
            }
            if (this.appContainer) {
                this.appContainer.classList.add('loaded');
            }

            setTimeout(() => {
                if (this.loadingScreen) {
                    this.loadingScreen.style.display = 'none';
                }
            }, 500);
        }, 1500);
    }
}

// Global function for external link handling
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
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFF8DC, #FFECB3);
            border: 2px solid #FFD700;
            padding: 16px 20px;
            border-radius: 16px;
            font-size: 14px;
            z-index: 15000;
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