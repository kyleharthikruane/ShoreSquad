# ShoreSquad

🌊 **Live Demo**: [https://kyleharthikruane.github.io/ShoreSquad/](https://kyleharthikruane.github.io/ShoreSquad/)

## Project Overview
ShoreSquad is a modern Progressive Web App (PWA) designed to mobilize young people for beach cleanups by providing interactive maps, real-time weather tracking, and social features. The app makes eco-action fun and connected, encouraging users to rally their crew and participate in environmental initiatives.

## Features
- **🗺️ Interactive Map**: Google Maps integration showing cleanup locations (Pasir Ris Beach)
- **🌡️ Weather Tracking**: Real-time weather data using NEA Singapore API with 4-day forecast
- **👥 Social Features**: Connect with your cleanup crew and join squad events
- **📱 Progressive Web App**: Installable on mobile devices with offline functionality
- **🎨 Modern UI**: Beautiful gradient design with responsive layout
- **📊 Statistics**: Track cleanup impact with kilograms collected and beaches cleaned

## Color Palette
- **Ocean Blue**: #0077be
- **Sand Beige**: #f4e1b1
- **Seafoam Green**: #a8e6cf
- **Coral Pink**: #ff6f61
- **Sunshine Yellow**: #ffeb3b

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Maps**: Google Maps Embed API
- **Weather**: NEA Singapore Realtime Weather API (data.gov.sg)
- **PWA**: Service Worker, Web App Manifest
- **Styling**: CSS Grid, Flexbox, CSS Animations
- **Hosting**: GitHub Pages with automated deployment

## Live Application
🚀 **Access the app**: [https://kyleharthikruane.github.io/ShoreSquad/](https://kyleharthikruane.github.io/ShoreSquad/)

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/kyleharthikruane/ShoreSquad.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd ShoreSquad
   ```

3. **Run locally**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   ```

4. **Open in browser**: Navigate to `http://localhost:8000`

## Usage Guidelines
- **Weather Data**: The app uses NEA Singapore's public API for real-time weather information
- **Map Integration**: Features Google Maps showing the next cleanup location at Pasir Ris Beach
- **Progressive Web App**: Can be installed on mobile devices for native app-like experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Offline Support**: Service worker enables basic offline functionality

## API Integration
- **NEA Weather API**: Provides 4-day weather forecast and current temperature
- **Google Maps**: Embedded map showing cleanup locations with custom markers
- **Fallback System**: Mock data ensures functionality when APIs are unavailable

## Contribution
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.