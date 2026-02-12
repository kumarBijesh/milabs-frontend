
export interface LocationData {
    city: string;
    state: string;
    country: 'US' | 'IN';
    currency: 'USD' | 'INR';
}

// A more extensive mock database of Zip/PIN codes
// In a real app, this would be an API call
export const zipCodeMap: Record<string, LocationData> = {
    // USA (5 digits)
    '10001': { city: 'New York', state: 'NY', country: 'US', currency: 'USD' },
    '90210': { city: 'Beverly Hills', state: 'CA', country: 'US', currency: 'USD' },
    '60601': { city: 'Chicago', state: 'IL', country: 'US', currency: 'USD' },
    '33101': { city: 'Miami', state: 'FL', country: 'US', currency: 'USD' },
    '77001': { city: 'Houston', state: 'TX', country: 'US', currency: 'USD' },
    '94105': { city: 'San Francisco', state: 'CA', country: 'US', currency: 'USD' },
    '98101': { city: 'Seattle', state: 'WA', country: 'US', currency: 'USD' },
    '02110': { city: 'Boston', state: 'MA', country: 'US', currency: 'USD' },
    '33549': { city: 'Lutz', state: 'FL', country: 'US', currency: 'USD' },

    // India (6 digits)
    '110001': { city: 'New Delhi', state: 'DL', country: 'IN', currency: 'INR' },
    '400001': { city: 'Mumbai', state: 'MH', country: 'IN', currency: 'INR' },
    '560001': { city: 'Bangalore', state: 'KA', country: 'IN', currency: 'INR' },
    '600001': { city: 'Chennai', state: 'TN', country: 'IN', currency: 'INR' },
    '700001': { city: 'Kolkata', state: 'WB', country: 'IN', currency: 'INR' },
    '500001': { city: 'Hyderabad', state: 'TS', country: 'IN', currency: 'INR' },
    '380001': { city: 'Ahmedabad', state: 'GJ', country: 'IN', currency: 'INR' },
    '411001': { city: 'Pune', state: 'MH', country: 'IN', currency: 'INR' },
};

// Async function to fetch location data
export const getLocationFromZip = async (zip: string): Promise<LocationData | null> => {
    // 1. Check strict mock map first (for instant demos)
    if (zipCodeMap[zip]) return zipCodeMap[zip];

    // 2. Determine country based on length
    // US = 5 digits, IN = 6 digits
    let countryCode = '';
    if (zip.length === 5 && /^\d+$/.test(zip)) countryCode = 'us';
    else if (zip.length === 6 && /^\d+$/.test(zip)) countryCode = 'in';

    if (!countryCode) return null;

    try {
        const response = await fetch(`https://api.zippopotam.us/${countryCode}/${zip}`);
        if (!response.ok) throw new Error('Zip not found');

        const data = await response.json();

        if (data.places && data.places.length > 0) {
            const place = data.places[0];
            return {
                city: place['place name'],
                state: place['state abbreviation'],
                country: countryCode.toUpperCase() as 'US' | 'IN',
                currency: countryCode === 'us' ? 'USD' : 'INR'
            };
        }
    } catch (error) {
        console.warn(`Failed to fetch zip data for ${zip}:`, error);
    }

    // 3. Fallback logic if API fails
    if (countryCode === 'us') {
        if (zip.startsWith('1')) return { city: 'New York Area', state: 'NY', country: 'US', currency: 'USD' };
        if (zip.startsWith('9')) return { city: 'California Area', state: 'CA', country: 'US', currency: 'USD' };
        if (zip.startsWith('3')) return { city: 'Florida Area', state: 'FL', country: 'US', currency: 'USD' };
        return { city: 'United States', state: 'US', country: 'US', currency: 'USD' };
    }

    if (countryCode === 'in') {
        if (zip.startsWith('1')) return { city: 'Delhi NCR', state: 'DL', country: 'IN', currency: 'INR' };
        if (zip.startsWith('4')) return { city: 'Maharashtra Area', state: 'MH', country: 'IN', currency: 'INR' };
        if (zip.startsWith('5')) return { city: 'Karnataka/Telangana', state: 'South', country: 'IN', currency: 'INR' };
        return { city: 'India', state: 'IN', country: 'IN', currency: 'INR' };
    }

    return null;
};
