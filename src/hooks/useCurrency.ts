import { create } from 'zustand';

interface CurrencyState {
    currency: string;
    symbol: string;
    rate: number;
    setCurrency: (currency: string) => void;
    formatPrice: (amount: number) => string;
}

const CURRENCIES: Record<string, { symbol: string, rate: number }> = {
    INR: { symbol: '₹', rate: 1 },
    USD: { symbol: '$', rate: 0.012 }, // Mock rate
    EUR: { symbol: '€', rate: 0.011 },
};

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
    currency: 'INR',
    symbol: '₹',
    rate: 1,
    setCurrency: (currency) => {
        const data = CURRENCIES[currency] || CURRENCIES.INR;
        set({ currency, symbol: data.symbol, rate: data.rate });
    },
    formatPrice: (amount) => {
        const { currency, symbol, rate } = get();
        // In real app, amount should be stored in base currency (INR) and converted
        // Or stored in USD and converted. Assuming base = INR for now.
        const converted = amount * rate;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(converted);
    },
}));

// Hook wrapper for easier usage if needed, or just useStore
export const useCurrency = () => useCurrencyStore();
