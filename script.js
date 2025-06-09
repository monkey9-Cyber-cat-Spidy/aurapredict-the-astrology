// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const auraForm = document.getElementById('aura-form');
    const nameInput = document.getElementById('name');
    const dobInput = document.getElementById('dob');
    const timeInput = document.getElementById('time-of-birth');
    const moodInput = document.getElementById('mood');
    const favoriteColorInput = document.getElementById('favorite-color');
    
    // Result section elements
    const resultSection = document.getElementById('result-section');
    const auraCircle = document.getElementById('aura-circle');
    const auraSymbol = document.getElementById('aura-symbol');
    const userNameDisplay = document.getElementById('user-name-display');
    const zodiacSignDisplay = document.getElementById('zodiac-sign');
    const auraDescription = document.getElementById('aura-description');
    const horoscopeText = document.getElementById('horoscope-text');
    const energyProgress = document.getElementById('energy-progress');
    
    // Action buttons
    const saveAuraBtn = document.getElementById('save-aura');
    const shareAuraBtn = document.getElementById('share-aura');
    const newPredictionBtn = document.getElementById('new-prediction');
    const toggleHistoryBtn = document.getElementById('toggle-history');
    const clearHistoryBtn = document.getElementById('clear-history');
    
    // History section
    const historySection = document.getElementById('history-section');
    const auraHistoryContainer = document.getElementById('aura-history-container');
    
    // Background animation
    const backgroundAnimation = document.getElementById('background-animation');
    
    // Chatbot Elements
    const openChatbotBtn = document.getElementById('open-chatbot');
    const toggleChatbotBtn = document.getElementById('toggle-chatbot');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInputField = document.getElementById('chatbot-input-field');
    const chatbotSendBtn = document.getElementById('chatbot-send');
    
    // Current prediction data
    let currentPrediction = {};
    
    // Initialize the app
    initApp();
    
    // Event Listeners
    auraForm.addEventListener('submit', handleFormSubmit);
    saveAuraBtn.addEventListener('click', saveAura);
    shareAuraBtn.addEventListener('click', shareAura);
    newPredictionBtn.addEventListener('click', resetForm);
    toggleHistoryBtn.addEventListener('click', toggleHistory);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Functions
    function initApp() {
        // Load history from localStorage
        loadAuraHistory();
    }
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const name = nameInput.value.trim();
        const dob = new Date(dobInput.value);
        const mood = moodInput.value;
        const favoriteColor = favoriteColorInput.value;
        
        // Calculate zodiac sign
        const day = dob.getDate();
        const month = dob.getMonth() + 1; // JavaScript months are 0-indexed
        const zodiacSign = await getZodiacSign(day, month);
        
        // Generate aura color (now incorporating favorite color)
        const auraColor = getAuraColor(dob, mood, favoriteColor);
        
        // Generate energy level (0-100)
        const energyLevel = generateEnergyLevel(dob, mood);
        
        // Get symbol based on zodiac and mood
        const symbol = getSymbol(zodiacSign, mood);
        
        // Fetch horoscope from Aztro API
        const horoscope = await fetchHoroscope(zodiacSign);
        
        // Generate aura description
        const auraDesc = generateAuraDescription(name, auraColor, mood, energyLevel);
        
        // Store current prediction
        currentPrediction = {
            name,
            date: new Date().toISOString(),
            zodiacSign,
            auraColor,
            favoriteColor,
            mood,
            energyLevel,
            symbol,
            horoscope,
            auraDescription: auraDesc
        };
        
        // Display the results
        displayResults();
        
        // Send welcome message from chatbot after prediction
        setTimeout(() => {
            if (!chatbotContainer.classList.contains('active')) {
                toggleChatbot();
            }
            addBotMessage(`I sense a beautiful ${getColorName(auraColor)} aura around you today, ${name}. How does your reading make you feel?`);
        }, 2000);
    }
    
    function displayResults() {
        // Update UI with prediction results
        userNameDisplay.textContent = `${currentPrediction.name}'s Aura`;
        zodiacSignDisplay.textContent = `Zodiac: ${capitalizeFirstLetter(currentPrediction.zodiacSign)}`;
        
        // Set aura color
        auraCircle.style.background = `radial-gradient(circle, ${currentPrediction.auraColor}, ${adjustColorBrightness(currentPrediction.auraColor, -30)})`;
        auraCircle.style.boxShadow = `0 0 30px ${currentPrediction.auraColor}`;
        
        // Set symbol
        auraSymbol.innerHTML = currentPrediction.symbol;
        
        // Set description and horoscope
        auraDescription.textContent = currentPrediction.auraDescription;
        horoscopeText.textContent = currentPrediction.horoscope;
        
        // Set energy level
        energyProgress.style.width = `${currentPrediction.energyLevel}%`;
        
        // Update background animation
        updateBackgroundAnimation(currentPrediction.auraColor);
        
        // Show result section
        resultSection.classList.remove('hidden');
        
        // Scroll to result section
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Calculate zodiac sign based on date of birth using API
    async function getZodiacSign(day, month) {
        try {
            // First try to get zodiac sign from API
            const response = await fetch(`https://zodiac-api.herokuapp.com/zodiac?date=${month}/${day}`);
            
            // If API call is successful, use the result
            if (response.ok) {
                const data = await response.json();
                return data.name.toLowerCase();
            } else {
                // Fallback to local calculation if API fails
                console.log('Zodiac API failed, using fallback calculation');
                return getZodiacSignFallback(day, month);
            }
        } catch (error) {
            console.error('Error fetching zodiac sign:', error);
            // Fallback to local calculation
            return getZodiacSignFallback(day, month);
        }
    }

    // Fallback function for zodiac sign calculation
    function getZodiacSignFallback(day, month) {
        const zodiacs = [
            { sign: "Capricorn", from: [12, 22], to: [1, 19] },
            { sign: "Aquarius", from: [1, 20], to: [2, 18] },
            { sign: "Pisces", from: [2, 19], to: [3, 20] },
            { sign: "Aries", from: [3, 21], to: [4, 19] },
            { sign: "Taurus", from: [4, 20], to: [5, 20] },
            { sign: "Gemini", from: [5, 21], to: [6, 20] },
            { sign: "Cancer", from: [6, 21], to: [7, 22] },
            { sign: "Leo", from: [7, 23], to: [8, 22] },
            { sign: "Virgo", from: [8, 23], to: [9, 22] },
            { sign: "Libra", from: [9, 23], to: [10, 22] },
            { sign: "Scorpio", from: [10, 23], to: [11, 21] },
            { sign: "Sagittarius", from: [11, 22], to: [12, 21] }
        ];
        
        for (let z of zodiacs) {
            const [fromMonth, fromDay] = z.from;
            const [toMonth, toDay] = z.to;
            
            if ((month === fromMonth && day >= fromDay) || (month === toMonth && day <= toDay)) {
                return z.sign.toLowerCase();
            }
        }
        
        return "capricorn"; // Default fallback
    }
    
    function getAuraColor(dob, mood, favoriteColor) {
        const birthMonth = dob.getMonth() + 1;
        const birthDay = dob.getDate();
        
        const moodMap = {
            happy: "#FDE68A", // Soft yellow
            sad: "#A5B4FC", // Lavender blue
            stressed: "#FCA5A5", // Light red
            calm: "#6EE7B7", // Mint green
            excited: "#FCD34D", // Amber
            anxious: "#C4B5FD", // Lavender
            tired: "#CBD5E1", // Slate gray
            energetic: "#F87171" // Coral red
        };
        
        // Base color from mood
        const baseColor = moodMap[mood] || "#D9F99D";
        
        // Blend with favorite color if provided (30% influence)
        let resultColor = baseColor;
        if (favoriteColor) {
            resultColor = blendColors(baseColor, favoriteColor, 0.7);
        }
        
        // Adjust color based on birth date
        if (birthMonth % 3 === 0) {
            // More vibrant for certain months
            return adjustColorBrightness(resultColor, 10);
        } else if (birthDay % 2 === 0) {
            // Slightly different shade for even birth days
            return adjustColorBrightness(resultColor, -10);
        }
        
        return resultColor;
    }
    
    function blendColors(color1, color2, ratio) {
        // Convert hex to RGB
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);
        
        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);
        
        // Blend the colors
        const r = Math.round(r1 * ratio + r2 * (1 - ratio));
        const g = Math.round(g1 * ratio + g2 * (1 - ratio));
        const b = Math.round(b1 * ratio + b2 * (1 - ratio));
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    function adjustColorBrightness(hex, percent) {
        // Convert hex to RGB
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        
        // Adjust brightness
        r = Math.max(0, Math.min(255, r + percent));
        g = Math.max(0, Math.min(255, g + percent));
        b = Math.max(0, Math.min(255, b + percent));
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    function generateEnergyLevel(dob, mood) {
        // Base energy levels for different moods
        const moodEnergyMap = {
            happy: 80,
            sad: 30,
            stressed: 65,
            calm: 50,
            excited: 90,
            anxious: 75,
            tired: 20,
            energetic: 95
        };
        
        // Get base energy from mood
        const baseEnergy = moodEnergyMap[mood] || 60;
        
        // Add some randomness based on birth date
        const birthDay = dob.getDate();
        const variation = birthDay % 10 - 5; // -5 to +4 variation
        
        // Return energy level clamped between 10 and 100
        return Math.max(10, Math.min(100, baseEnergy + variation));
    }
    
    function getSymbol(zodiacSign, mood) {
        // Map of symbols for different zodiac signs
        const zodiacSymbols = {
            aries: '<i class="fas fa-fire"></i>',
            taurus: '<i class="fas fa-mountain"></i>',
            gemini: '<i class="fas fa-yin-yang"></i>',
            cancer: '<i class="fas fa-water"></i>',
            leo: '<i class="fas fa-sun"></i>',
            virgo: '<i class="fas fa-leaf"></i>',
            libra: '<i class="fas fa-balance-scale"></i>',
            scorpio: '<i class="fas fa-dragon"></i>',
            sagittarius: '<i class="fas fa-arrow-alt-circle-up"></i>',
            capricorn: '<i class="fas fa-mountain"></i>',
            aquarius: '<i class="fas fa-tint"></i>',
            pisces: '<i class="fas fa-fish"></i>'
        };
        
        // Map of symbols for different moods
        const moodSymbols = {
            happy: '<i class="fas fa-smile"></i>',
            sad: '<i class="fas fa-cloud-rain"></i>',
            stressed: '<i class="fas fa-bolt"></i>',
            calm: '<i class="fas fa-feather"></i>',
            excited: '<i class="fas fa-star"></i>',
            anxious: '<i class="fas fa-wind"></i>',
            tired: '<i class="fas fa-moon"></i>',
            energetic: '<i class="fas fa-fire-alt"></i>'
        };
        
        // Randomly choose between zodiac symbol and mood symbol
        return Math.random() > 0.5 ? zodiacSymbols[zodiacSign] : moodSymbols[mood];
    }
    
    async function fetchHoroscope(sign) {
        try {
            const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch horoscope');
            }
            
            const data = await response.json();
            return data.description;
        } catch (error) {
            console.error('Error fetching horoscope:', error);
            return "The cosmic energies are shifting too rapidly to read your stars today. Try again later.";
        }
    }
    
    function generateAuraDescription(name, color, mood, energyLevel) {
        // Color descriptions
        const colorDescriptions = {
            '#FDE68A': 'golden yellow',
            '#A5B4FC': 'soft lavender',
            '#FCA5A5': 'gentle rose',
            '#6EE7B7': 'healing mint',
            '#FCD34D': 'radiant amber',
            '#C4B5FD': 'mystical purple',
            '#CBD5E1': 'serene silver',
            '#F87171': 'passionate coral'
        };
        
        // Find the closest color description
        let closestColor = Object.keys(colorDescriptions)[0];
        let minDistance = colorDistance(color, closestColor);
        
        for (const c in colorDescriptions) {
            const distance = colorDistance(color, c);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = c;
            }
        }
        
        const colorName = colorDescriptions[closestColor];
        
        // Energy level descriptions
        let energyDesc = '';
        if (energyLevel > 80) {
            energyDesc = 'vibrant and powerful';
        } else if (energyLevel > 60) {
            energyDesc = 'steady and balanced';
        } else if (energyLevel > 40) {
            energyDesc = 'gentle and flowing';
        } else {
            energyDesc = 'subtle and reflective';
        }
        
        // Generate a random description template
        const templates = [
            `Your aura glows a ${colorName} today – ${energyDesc}. The stars hint at opportunities for growth and connection. Trust your intuition.`,
            `A ${colorName} aura surrounds you, ${name}. It's ${energyDesc}, suggesting a day of meaningful insights and personal discoveries.`,
            `The cosmic energies have aligned to create a ${colorName} aura around you today. It feels ${energyDesc}, perfect for embracing new challenges.`,
            `${name}, your energy field radiates a ${colorName} light today. This ${energyDesc} aura suggests focusing on self-care and inner harmony.`,
            `A beautiful ${colorName} aura envelops you today. Its ${energyDesc} nature indicates favorable conditions for creative pursuits and emotional healing.`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    function colorDistance(hex1, hex2) {
        // Convert hex to RGB
        const r1 = parseInt(hex1.substring(1, 3), 16);
        const g1 = parseInt(hex1.substring(3, 5), 16);
        const b1 = parseInt(hex1.substring(5, 7), 16);
        
        const r2 = parseInt(hex2.substring(1, 3), 16);
        const g2 = parseInt(hex2.substring(3, 5), 16);
        const b2 = parseInt(hex2.substring(5, 7), 16);
        
        // Calculate Euclidean distance
        return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    }
    
    function updateBackgroundAnimation(color) {
        // Create a gradient based on the aura color
        const lighterColor = adjustColorBrightness(color, 30);
        const darkerColor = adjustColorBrightness(color, -30);
        
        backgroundAnimation.style.background = `linear-gradient(135deg, ${lighterColor}, ${color}, ${darkerColor})`;
        backgroundAnimation.style.backgroundSize = '400% 400%';
        backgroundAnimation.style.animation = 'gradient 15s ease infinite';
    }
    
    function saveAura() {
        if (!currentPrediction.name) return;
        
        // Get existing history or initialize empty array
        const history = JSON.parse(localStorage.getItem('auraHistory') || '[]');
        
        // Add current prediction to history
        history.push({
            ...currentPrediction,
            savedAt: new Date().toISOString()
        });
        
        // Save to localStorage (limit to last 10 entries)
        localStorage.setItem('auraHistory', JSON.stringify(history.slice(-10)));
        
        // Update history display
        loadAuraHistory();
        
        // Show confirmation
        alert('Your aura has been saved!');
    }
    
    function loadAuraHistory() {
        // Clear current history display
        auraHistoryContainer.innerHTML = '';
        
        // Get history from localStorage
        const history = JSON.parse(localStorage.getItem('auraHistory') || '[]');
        
        if (history.length === 0) {
            auraHistoryContainer.innerHTML = '<p class="text-center">No saved auras yet.</p>';
            return;
        }
        
        // Create history items
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(item.savedAt || item.date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            historyItem.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div class="history-aura" style="background-color: ${item.auraColor};"></div>
                    <div>
                        <strong>${item.name}</strong>
                        <div class="history-date">${formattedDate}</div>
                    </div>
                </div>
                <div>${capitalizeFirstLetter(item.zodiacSign)} - ${capitalizeFirstLetter(item.mood)}</div>
                <button class="btn-text view-history" data-index="${index}">View Details</button>
            `;
            
            auraHistoryContainer.appendChild(historyItem);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-history').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                currentPrediction = history[index];
                displayResults();
            });
        });
    }
    
    function shareAura() {
        if (!currentPrediction.name) return;
        
        // Check if Web Share API is supported
        if (navigator.share) {
            navigator.share({
                title: 'My AuraPredict Reading',
                text: `${currentPrediction.auraDescription}\n\nMy zodiac sign: ${capitalizeFirstLetter(currentPrediction.zodiacSign)}\nMy mood: ${capitalizeFirstLetter(currentPrediction.mood)}\nMy energy level: ${currentPrediction.energyLevel}%`,
                url: window.location.href
            })
            .catch(error => {
                console.error('Error sharing:', error);
                fallbackShare();
            });
        } else {
            fallbackShare();
        }
    }
    
    function fallbackShare() {
        // Fallback for browsers that don't support Web Share API
        const shareText = `${currentPrediction.auraDescription}\n\nMy zodiac sign: ${capitalizeFirstLetter(currentPrediction.zodiacSign)}\nMy mood: ${capitalizeFirstLetter(currentPrediction.mood)}\nMy energy level: ${currentPrediction.energyLevel}%`;
        
        // Create a temporary textarea element to copy the text
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        alert('Aura details copied to clipboard! You can now paste and share it.');
    }
    
    function toggleHistory() {
        historySection.classList.toggle('hidden');
        
        // Update button text
        if (historySection.classList.contains('hidden')) {
            toggleHistoryBtn.innerHTML = '<i class="fas fa-history"></i> View History';
        } else {
            toggleHistoryBtn.innerHTML = '<i class="fas fa-times"></i> Hide History';
            historySection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear your aura history?')) {
            localStorage.removeItem('auraHistory');
            loadAuraHistory();
        }
    }
    
    function resetForm() {
        auraForm.reset();
        resultSection.classList.add('hidden');
        
        // Reset background
        backgroundAnimation.style.background = 'linear-gradient(135deg, #c084fc, #f0abfc, #818cf8)';
        
        // Scroll back to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Helper function to get color name for chatbot messages
    function getColorName(hexColor) {
        const colorNames = {
            '#FDE68A': 'golden yellow',
            '#A5B4FC': 'soft lavender',
            '#FCA5A5': 'gentle rose',
            '#6EE7B7': 'healing mint',
            '#FCD34D': 'radiant amber',
            '#C4B5FD': 'mystical purple',
            '#CBD5E1': 'serene silver',
            '#F87171': 'passionate coral'
        };
        
        // Find the closest color
        let closestColor = Object.keys(colorNames)[0];
        let minDistance = colorDistance(hexColor, closestColor);
        
        for (const c in colorNames) {
            const distance = colorDistance(hexColor, c);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = c;
            }
        }
        
        return colorNames[closestColor];
    }
    
    // Chatbot Functionality
    openChatbotBtn.addEventListener('click', toggleChatbot);
    toggleChatbotBtn.addEventListener('click', toggleChatbot);
    chatbotSendBtn.addEventListener('click', sendUserMessage);
    chatbotInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
    
    function toggleChatbot() {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active') && chatbotMessages.children.length === 0) {
            // First time opening the chatbot
            addBotMessage("Greetings, seeker of cosmic wisdom! I am AuraBot, your mystical guide to the energies that surround you. How may I illuminate your path today?");
        }
        
        if (chatbotContainer.classList.contains('active')) {
            chatbotInputField.focus();
        }
    }
    
    function sendUserMessage() {
        const message = chatbotInputField.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addUserMessage(message);
        chatbotInputField.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            processChatbotResponse(message);
        }, 1000 + Math.random() * 1000); 
    }
    
    function addUserMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        scrollChatToBottom();
        
        // Play send sound
        playSound('send');
    }
    
    function addBotMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        
        // Typing effect
        const typingSpeed = 30; 
        let i = 0;
        messageElement.textContent = '';
        chatbotMessages.appendChild(messageElement);
        
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                messageElement.textContent += text.charAt(i);
                i++;
                scrollChatToBottom();
            } else {
                clearInterval(typingInterval);
                playSound('receive');
            }
        }, typingSpeed);
        
        scrollChatToBottom();
    }
    
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        typingIndicator.id = 'typing-indicator';
        chatbotMessages.appendChild(typingIndicator);
        scrollChatToBottom();
    }
    
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function scrollChatToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function playSound(type) {
        // Create audio element
        const audio = new Audio();
        
        if (type === 'send') {
            audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3';
        } else if (type === 'receive') {
            audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-fairy-message-notification-2358.mp3';
        }
        
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    function processChatbotResponse(userMessage) {
        // Convert to lowercase for easier matching
        const message = userMessage.toLowerCase();
        
        // Check for keywords and respond accordingly
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            addBotMessage("Greetings, dear soul! The cosmic energies guided you to me today. How may I assist in your spiritual journey?");
        }
        else if (message.includes('how are you')) {
            addBotMessage("I exist in the space between dimensions, ever-present and ever-changing. My energies align with the universe today. Thank you for asking, gentle being.");
        }
        else if (message.includes('aura') || message.includes('energy')) {
            if (currentPrediction.name) {
                addBotMessage(`Your ${getColorName(currentPrediction.auraColor)} aura reveals much about your inner state. This color suggests ${getAuraPersonality(currentPrediction.auraColor)}. Would you like to know more about what this means for your day ahead?`);
            } else {
                addBotMessage("Auras are the luminous energy field that surrounds all living beings. To reveal yours, please complete the prediction form above. I sense great potential in your energy!");
            }
        }
        else if (message.includes('zodiac') || message.includes('sign') || message.includes('horoscope')) {
            if (currentPrediction.zodiacSign) {
                addBotMessage(`As a ${capitalizeFirstLetter(currentPrediction.zodiacSign)}, you possess ${getZodiacTraits(currentPrediction.zodiacSign)}. The stars have aligned to bring you this message: ${currentPrediction.horoscope}`);
            } else {
                addBotMessage("The zodiac is a mystical map of the heavens, divided into twelve signs. Each sign carries unique energies and traits. Share your birth date in the form above, and I shall reveal what the stars have written for you.");
            }
        }
        else if (message.includes('mood') || message.includes('feel')) {
            if (currentPrediction.mood) {
                addBotMessage(`I sense that your ${currentPrediction.mood} mood is influencing your aura today. Remember that emotions are like clouds passing through the sky of your consciousness - ever-changing, never permanent. How does this resonate with you?`);
            } else {
                addBotMessage("Your mood is a window into your soul's current journey. Tell me, how do the cosmic energies make you feel today?");
            }
        }
        else if (message.includes('thank')) {
            addBotMessage("You're most welcome, gentle soul. May the universe continue to guide your path with light and wisdom.");
        }
        else if (message.includes('bye') || message.includes('goodbye')) {
            addBotMessage("Farewell for now, but remember that energy never truly departs—it merely transforms. I'll be here when the cosmic winds bring you back to me.");
        }
        else if (message.includes('color') || message.includes('favourite') || message.includes('favorite')) {
            if (currentPrediction.favoriteColor) {
                addBotMessage(`Your chosen color reveals much about your inner spirit. This shade resonates with your energy in mysterious ways, influencing the vibrant tapestry of your aura. Colors are the language of the soul, speaking what words cannot express.`);
            } else {
                addBotMessage("Colors are vibrations of light, each carrying unique energies. Your favorite color can reveal hidden aspects of your soul's journey. What shade speaks to your spirit?");
            }
        }
        else if (message.includes('tarot') || message.includes('card') || message.includes('reading')) {
            addBotMessage("The tarot whispers secrets of past, present, and future through its mystical imagery. While I cannot draw cards in this realm, I can tell you that the energy surrounding you now suggests a time of transformation and insight. Listen to your intuition—it speaks volumes.");
        }
        else if (message.includes('crystal') || message.includes('stone') || message.includes('gem')) {
            addBotMessage("Crystals are Earth's ancient keepers of wisdom and energy. Based on your aura, you might find resonance with amethyst for spiritual growth, rose quartz for heart healing, or clear quartz to amplify your intentions. Which crystal calls to your spirit?");
        }
        else if (message.includes('meditate') || message.includes('meditation') || message.includes('relax')) {
            addBotMessage("Meditation is the sacred bridge between your conscious mind and the cosmic consciousness. Close your eyes, breathe deeply, and visualize your aura expanding with each breath. Allow your energy to harmonize with the universe's eternal rhythm. Peace awaits in the silence between thoughts.");
        }
        else {
            // Default responses for messages that don't match keywords
            const defaultResponses = [
                "The cosmic energies surrounding that question are complex. Perhaps try asking about your aura, zodiac sign, or how to balance your energies?",
                "I sense curiosity in your energy field. Your question touches on mysteries beyond simple answers. Would you like to explore your aura or zodiac influences instead?",
                "The stars whisper many secrets, but I'm best attuned to matters of auras, zodiac energies, and spiritual balance. How else might I illuminate your path today?",
                "Your question ripples through the cosmic consciousness. While I ponder its depths, perhaps I can assist with insights about your energy, astrological influences, or spiritual practices?",
                "The universe works in mysterious ways, dear seeker. I'm most adept at discussing your aura, zodiac traits, and the energetic influences in your life. Shall we explore these realms?"
            ];
            
            const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            addBotMessage(randomResponse);
        }
    }
    
    function getAuraPersonality(auraColor) {
        // Find closest color match and return personality traits
        const personalities = {
            '#FDE68A': 'optimism, clarity of thought, and creative inspiration', // Yellow
            '#A5B4FC': 'intuition, spiritual awareness, and emotional sensitivity', // Lavender
            '#FCA5A5': 'compassion, emotional healing, and gentle strength', // Rose
            '#6EE7B7': 'growth, renewal, and connection to nature', // Mint
            '#FCD34D': 'confidence, personal power, and inner wisdom', // Amber
            '#C4B5FD': 'spiritual awakening, mystical insight, and transformation', // Purple
            '#CBD5E1': 'peace, clarity, and emotional balance', // Silver
            '#F87171': 'passion, vitality, and creative energy' // Coral
        };
        
        let closestColor = Object.keys(personalities)[0];
        let minDistance = colorDistance(auraColor, closestColor);
        
        for (const c in personalities) {
            const distance = colorDistance(auraColor, c);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = c;
            }
        }
        
        return personalities[closestColor];
    }
    
    function getZodiacTraits(sign) {
        const traits = {
            'aries': 'fiery determination, courage, and pioneering spirit',
            'taurus': 'steadfast reliability, sensuality, and connection to the earth',
            'gemini': 'intellectual curiosity, adaptability, and communicative brilliance',
            'cancer': 'emotional depth, nurturing instincts, and intuitive wisdom',
            'leo': 'radiant charisma, creative passion, and noble leadership',
            'virgo': 'analytical precision, healing abilities, and practical wisdom',
            'libra': 'harmonious balance, diplomatic grace, and aesthetic appreciation',
            'scorpio': 'transformative power, emotional intensity, and mystical insight',
            'sagittarius': 'philosophical wisdom, adventurous spirit, and optimistic vision',
            'capricorn': 'disciplined ambition, practical mastery, and enduring strength',
            'aquarius': 'innovative thinking, humanitarian vision, and independent spirit',
            'pisces': 'compassionate empathy, spiritual connection, and artistic imagination'
        };
        
        return traits[sign.toLowerCase()] || 'unique cosmic energies that transcend simple description';
    }
});