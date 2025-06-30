export const getUserIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP:', error);
        return null;
    }
};

export const getUserCountry = async (ip) => {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        return {
            country: data.country_name,
            countryCode: data.country_code.toLowerCase(),
            city: data.city,
            region: data.region
        };
    } catch (error) {
        console.error('Error fetching country info:', error);
        return null;
    }
}; 