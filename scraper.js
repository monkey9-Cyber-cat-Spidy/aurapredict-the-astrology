export class AstroScraper {
    constructor() {
        this.apiUrl = 'https://web-production-9d458.up.railway.app/';
        this.stats = {
            processed: 0,
            errors: 0,
            startTime: null
        };
    }

    async scrapeAndProcess() {
        try {
            // Get all profiles from the page
            const profiles = await this.getProfilesFromPage();
            
            // Process each profile
            for (const profile of profiles) {
                await this.processProfile(profile);
            }

            return this.stats;
        } catch (error) {
            console.error("Error in scraping process:", error);
            this.stats.errors.push(error.message);
            return this.stats;
        }
    }

    getProfilesFromPage() {
        const cards = document.querySelectorAll('.profile-card');
        const profiles = [];
        cards.forEach(card => {
            profiles.push({
                name: card.querySelector('.name')?.textContent || '',
                birthDate: card.querySelector('.birth-date')?.textContent || '',
                birthTime: card.querySelector('.birth-time')?.textContent || ''
            });
        });
        return profiles;
    }

    async processProfile(profile) {
        try {
            // Calculate zodiac sign
            const zodiacSign = this.calculateZodiacSign(profile.birthDate);
            
            // Get horoscope
            const horoscope = await this.getHoroscope(zodiacSign);
            
            // Create aura prediction
            const auraPrediction = this.createAuraPrediction(profile, zodiacSign, horoscope);
            
            // Save to history
            this.saveToHistory(auraPrediction);
            
            this.stats.processed++;
            
            return auraPrediction;
        } catch (error) {
            console.error("Error processing profile:", error);
            this.stats.errors++;
            this.stats.errors.push(error.message);
            return null;
        }
    }

    calculateZodiacSign(dateString) {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const signs = [
            { sign: 'Capricorn', from: [1, 1], to: [1, 19] },
            { sign: 'Aquarius', from: [1, 20], to: [2, 18] },
            { sign: 'Pisces', from: [2, 19], to: [3, 20] },
            { sign: 'Aries', from: [3, 21], to: [4, 19] },
            { sign: 'Taurus', from: [4, 20], to: [5, 20] },
            { sign: 'Gemini', from: [5, 21], to: [6, 20] },
            { sign: 'Cancer', from: [6, 21], to: [7, 22] },
            { sign: 'Leo', from: [7, 23], to: [8, 22] },
            { sign: 'Virgo', from: [8, 23], to: [9, 22] },
            { sign: 'Libra', from: [9, 23], to: [10, 22] },
            { sign: 'Scorpio', from: [10, 23], to: [11, 21] },
            { sign: 'Sagittarius', from: [11, 22], to: [12, 21] },
            { sign: 'Capricorn', from: [12, 22], to: [12, 31] }
        ];
        for (const s of signs) {
            const [fromMonth, fromDay] = s.from;
            const [toMonth, toDay] = s.to;
            if (
                (month === fromMonth && day >= fromDay) ||
                (month === toMonth && day <= toDay)
            ) {
                return s.sign;
            }
        }
        return '';
    }

    async getHoroscope(sign) {
        try {
            const response = await fetch(this.apiUrl + 'horoscopev2', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sign: sign,
                    day: "today",
                    tz: "UTC"
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.message;
            } else {
                throw new Error("Failed to fetch horoscope");
            }
        } catch (error) {
            console.error("Error fetching horoscope:", error);
            return "The stars are aligning in your favor today.";
        }
    }

    createAuraPrediction(profile, zodiacSign, horoscope) {
        return {
            name: profile.name,
            date: new Date().toISOString(),
            zodiacSign: zodiacSign,
            birthDate: profile.birthDate,
            birthTime: profile.birthTime,
            location: profile.location,
            gender: profile.gender,
            horoscope: horoscope
        };
    }

    saveToHistory(prediction) {
        let history = JSON.parse(localStorage.getItem("auraHistory") || "[]");
        history.push(prediction);
        localStorage.setItem("auraHistory", JSON.stringify(history.slice(-10)));
    }
}

// Export the scraper
window.AstroScraper = AstroScraper; 