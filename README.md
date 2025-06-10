# 🌌 AuraPredict – Your Personal Mood & Horoscope Companion

AuraPredict is a futuristic mood and zodiac experience that combines user emotions and astrology-like predictions to generate a personalized daily aura. It's a fun, mystical, and interactive web application built with HTML, CSS, and JavaScript.

![AuraPredict Screenshot](https://i.ibb.co/VYvSnPLM/Screenshot-2025-06-10-13-16-39-083-org-torproject-android.jpg)

## ✨ Features

### Input Fields
- **Name**: Personalize your aura prediction
- **Date of Birth**: Used to calculate your zodiac sign and influence your aura
- **Time of Birth (Optional)**: For more precise astrological calculations
- **Mood Selector**: Choose your current mood from a variety of options

### Output Section
- **Aura Color**: A unique color generated based on your date of birth and current mood
- **Horoscope**: Daily horoscope fetched from the Aztro API based on your zodiac sign
- **Daily Energy Level**: Visual representation of your energy level for the day
- **Matched Symbol**: A mystical symbol that resonates with your current aura

### Extra Features
- **Background Animation**: Dynamic background that changes based on your aura color
- **Aura History**: Save and view your past aura predictions using localStorage
- **Share Functionality**: Share your aura prediction with others using the Web Share API

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API calls)

### Installation
1. Clone this repository or download the files
2. Open `index.html` in your web browser

```bash
# If you have Python installed, you can run a simple HTTP server
python -m http.server

# Then open http://localhost:8000 in your browser
```

## 🧩 API Integration

AuraPredict uses the [Aztro API](https://aztro.sameerkumar.website/) to fetch daily horoscopes based on the calculated zodiac sign.

```javascript
fetch('https://aztro.sameerkumar.website/?sign=leo&day=today', {
  method: 'POST'
})
  .then(res => res.json())
  .then(data => {
    console.log("Horoscope:", data.description);
  });
```

## 🎨 Design Elements

- **Pastel Gradients**: Soft color transitions for aura backgrounds
- **Glassmorphism**: Modern frosted glass effect for UI cards
- **Soft Glow Effects**: Subtle lighting using box-shadow properties
- **Mystic Symbols**: Icons representing zodiac signs and moods

## 🧠 How It Works

1. **Zodiac Calculation**: Determines your zodiac sign based on birth date
2. **Aura Generation**: Creates a unique color based on birth date and mood
3. **Energy Level**: Calculates your daily energy level using various factors
4. **Horoscope Integration**: Fetches your daily horoscope from the Aztro API
5. **Personalized Description**: Generates a custom aura description combining all elements

## 📱 Responsive Design

AuraPredict is fully responsive and works on devices of all sizes:
- **Desktop**: Full experience with expanded layout
- **Tablet**: Optimized spacing and card arrangements
- **Mobile**: Streamlined interface with touch-friendly controls

## 🔮 Future Enhancements

- Moon phase integration
- Compatibility readings between users
- Weekly and monthly predictions
- More detailed astrological information
- Custom theme options

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Aztro API](https://aztro.sameerkumar.website/) for horoscope data
- [Font Awesome](https://fontawesome.com/) for the mystical icons
- [Google Fonts](https://fonts.google.com/) for typography

---

Enjoy your mystical journey with AuraPredict! ✨🔮
