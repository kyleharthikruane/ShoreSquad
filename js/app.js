// ShoreSquad Weather Integration
class WeatherService {
    constructor() {
        this.baseUrl = 'https://api.data.gov.sg/v1/environment';
        this.init();
    }

    async init() {
        await this.loadCurrentTemperature();
        await this.loadWeatherForecast();
    }

    // Fetch current temperature from NEA API with fallback
    async loadCurrentTemperature() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(`${this.baseUrl}/air-temperature`, {
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const readings = data.items[0].readings;
                
                // Find reading closest to Pasir Ris (station S24 - Upper Changi Road North)
                const pasirRisReading = readings.find(r => r.station_id === 'S24') || readings[0];
                
                const currentTemp = Math.round(pasirRisReading.value);
                const stationName = this.getStationName(pasirRisReading.station_id, data.metadata.stations);
                
                this.updateCurrentTemperature(currentTemp, stationName);
            }
        } catch (error) {
            console.warn('API unavailable, using mock data:', error.message);
            // Use realistic Singapore temperature data as fallback
            const mockTemp = 28 + Math.floor(Math.random() * 4); // 28-31°C range
            this.updateCurrentTemperature(mockTemp, 'Upper Changi Road North');
        }
    }

    // Fetch 4-day weather forecast from NEA API with fallback
    async loadWeatherForecast() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(`${this.baseUrl}/4-day-weather-forecast`, {
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const forecasts = data.items[0].forecasts;
                this.updateWeatherForecast(forecasts);
            }
        } catch (error) {
            console.warn('API unavailable, using mock data:', error.message);
            this.loadMockWeatherData();
        }
    }

    // Mock weather data for demo purposes (realistic Singapore weather)
    loadMockWeatherData() {
        const mockForecasts = [
            {
                date: "2025-06-05",
                forecast: "Partly cloudy with afternoon thundery showers",
                temperature: { low: 24, high: 32 },
                relative_humidity: { low: 60, high: 95 },
                wind: { speed: { low: 10, high: 20 }, direction: "SSW" }
            },
            {
                date: "2025-06-06",
                forecast: "Morning thundery showers",
                temperature: { low: 25, high: 33 },
                relative_humidity: { low: 55, high: 90 },
                wind: { speed: { low: 12, high: 25 }, direction: "SW" }
            },
            {
                date: "2025-06-07",
                forecast: "Cloudy with occasional showers",
                temperature: { low: 23, high: 31 },
                relative_humidity: { low: 65, high: 95 },
                wind: { speed: { low: 8, high: 18 }, direction: "S" }
            },
            {
                date: "2025-06-08",
                forecast: "Fair weather with brief afternoon showers",
                temperature: { low: 24, high: 34 },
                relative_humidity: { low: 50, high: 85 },
                wind: { speed: { low: 15, high: 30 }, direction: "SSE" }
            }
        ];
        
        this.updateWeatherForecast(mockForecasts);
    }    // Get station name from metadata
    getStationName(stationId, stations) {
        if (!stations) return 'Singapore';
        const station = stations.find(s => s.id === stationId);
        return station ? station.name : 'Singapore';
    }

    // Update current temperature display
    updateCurrentTemperature(temp, location) {
        const tempElement = document.getElementById('currentTemp');
        const locationElement = document.getElementById('currentLocation');
        
        if (tempElement) {
            tempElement.textContent = temp === '--' ? '--°C' : `${temp}°C`;
            // Add animation effect
            tempElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                tempElement.style.transform = 'scale(1)';
            }, 300);
        }
        if (locationElement) {
            locationElement.textContent = location;
        }
    }

    // Update weather forecast display
    updateWeatherForecast(forecasts) {
        const weatherGrid = document.getElementById('weatherForecast');
        if (!weatherGrid) return;

        // Clear loading state
        weatherGrid.innerHTML = '';

        forecasts.forEach((forecast, index) => {
            const card = this.createWeatherCard(forecast, index);
            weatherGrid.appendChild(card);
            
            // Add staggered animation
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }, index * 100);
        });
    }

    // Create weather card HTML element
    createWeatherCard(forecast, index) {
        const card = document.createElement('div');
        card.className = 'weather-card';

        const date = new Date(forecast.date);
        const formattedDate = this.formatDate(date, index);
        const weatherIcon = this.getWeatherIcon(forecast.forecast);
        const tempRange = `${forecast.temperature.low}°C - ${forecast.temperature.high}°C`;
        
        card.innerHTML = `
            <div class="weather-date">${formattedDate}</div>
            <div class="weather-icon">${weatherIcon}</div>
            <div class="weather-desc">${forecast.forecast}</div>
            <div class="weather-temp">${tempRange}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-label">Humidity</div>
                    <div class="weather-detail-value">${forecast.relative_humidity.low}-${forecast.relative_humidity.high}%</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Wind</div>
                    <div class="weather-detail-value">${forecast.wind.speed.low}-${forecast.wind.speed.high} km/h</div>
                </div>
            </div>
        `;

        return card;
    }

    // Format date for display
    formatDate(date, index) {
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (index === 0) return 'Today';
        if (index === 1) return 'Tomorrow';
        
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-SG', options);
    }

    // Get weather icon based on forecast description
    getWeatherIcon(forecast) {
        const description = forecast.toLowerCase();
        
        if (description.includes('thundery') || description.includes('thunder')) {
            return '⛈️';
        } else if (description.includes('shower') || description.includes('rain')) {
            return '🌧️';
        } else if (description.includes('cloudy')) {
            return '☁️';
        } else if (description.includes('partly cloudy')) {
            return '⛅';
        } else if (description.includes('fair') || description.includes('sunny')) {
            return '☀️';
        } else if (description.includes('hazy')) {
            return '🌫️';
        } else if (description.includes('windy')) {
            return '💨';
        }
        
        return '🌤️'; // Default partly sunny
    }

    // Show error message for forecast
    showForecastError() {
        const weatherGrid = document.getElementById('weatherForecast');
        if (weatherGrid) {
            weatherGrid.innerHTML = `
                <div class="weather-card">
                    <div class="weather-date">Error</div>
                    <div class="weather-icon">❌</div>
                    <div class="weather-desc">Unable to load weather forecast</div>
                    <div class="weather-temp">Try again later</div>
                </div>
            `;
        }
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.initNavigation();
    }

    initNavigation() {
        // Handle navigation tab clicks
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveTab(tab);
            });
        });

        // Handle bottom navigation clicks
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveBottomNav(item);
            });
        });

        // Handle join button clicks
        const joinButtons = document.querySelectorAll('.join-button');
        joinButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleJoinSquad(button);
            });
        });
    }

    setActiveTab(activeTab) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    setActiveBottomNav(activeItem) {
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    handleJoinSquad(button) {
        // Add joining animation
        button.textContent = '✓ Joined!';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            button.innerHTML = '👥 Join Squad';
            button.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
        }, 2000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherService();
    new Navigation();
});

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}