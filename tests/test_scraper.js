import { AstroScraper } from '../scraper.js';

// Test suite for AstroScraper
describe('AstroScraper', () => {
    let scraper;

    beforeEach(() => {
        scraper = new AstroScraper();
        document.body.innerHTML = `
            <div class="profile-card">
                <div class="name">John Doe</div>
                <div class="birth-date">1990-05-15</div>
                <div class="birth-time">14:30</div>
            </div>
        `;
    });

    test('should initialize with correct API URL', () => {
        expect(scraper.apiUrl).toBe('https://web-production-9d458.up.railway.app/');
    });

    test('should calculate zodiac sign correctly', () => {
        const zodiacSign = scraper.calculateZodiacSign('1990-05-15');
        expect(zodiacSign).toBe('Taurus');
    });

    test('should extract profile data correctly', () => {
        const profiles = scraper.getProfilesFromPage();
        expect(profiles).toHaveLength(1);
        expect(profiles[0]).toEqual({
            name: 'John Doe',
            birthDate: '1990-05-15',
            birthTime: '14:30'
        });
    });

    test('should handle API errors gracefully', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));
        const result = await scraper.getHoroscope('Taurus');
        expect(result).toEqual({
            message: 'Unable to fetch horoscope. Please try again later.',
            compatibility: 'Unknown',
            mood: 'Unknown',
            date: expect.any(String)
        });
    });

    test('should save predictions to history', () => {
        const prediction = {
            name: 'John Doe',
            zodiacSign: 'Taurus',
            horoscope: 'Your day will be great!',
            date: '2024-03-20'
        };
        scraper.saveToHistory(prediction);
        const history = JSON.parse(localStorage.getItem('auraHistory'));
        expect(history).toHaveLength(1);
        expect(history[0]).toEqual(prediction);
    });
}); 