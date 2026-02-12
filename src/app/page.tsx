"use client";


// Header is now in global layout
import HeroSection from '@/components/home/HeroSection';
import TrendingDeals from '@/components/home/TrendingDeals';
import HowItWorks from '@/components/home/HowItWorks';
import { useState, useEffect } from 'react';
import { getLocationFromZip } from '@/lib/locationData';
import { useUserStore } from '@/store/userStore';

export default function Home() {
  const { location, setLocation, setCurrency } = useUserStore();
  const [zipInput, setZipInput] = useState(location.zip);



  const handleUseCurrentLocation = (showError = true) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim API for free reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();

          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown Location';
            const state = data.address.state || '';
            const zip = data.address.postcode || '';
            const countryCode = data.address.country_code?.toUpperCase() || 'US';

            // map country to currency
            const currency = countryCode === 'IN' ? 'INR' : 'USD';

            setZipInput(zip);
            setLocation({
              city,
              state,
              zip,
              country: countryCode
            });
            setCurrency(currency);
          } else {
            console.warn("Could not determine address from your location.");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          if (showError) alert("Error getting location details. Please try again.");
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        if (showError && error.code !== error.PERMISSION_DENIED) {
          // Only alert if there actul error, not just denial (which is common on auto-ask)
          // actually, better to be silent on auto-ask always
        }
        if (showError) alert("Unable to retrieve your location. Check browser permissions.");
      });
    } else {
      if (showError) alert("Geolocation is not supported by this browser.");
    }
  };

  // Effect to sync local state with store when store updates (e.g. from hydration or detection)
  useEffect(() => {
    setZipInput(location.zip || '');
  }, [location.zip]);

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setZipInput(val);

    // Only attempt lookup if it looks like a valid US (5) or IN (6) zip
    if (val.length === 5 || val.length === 6) {
      // Lookup location and update currency
      const locData = await getLocationFromZip(val);
      if (locData) {
        setLocation({
          city: locData.city,
          state: locData.state,
          zip: val,
          country: locData.country
        });
        setCurrency(locData.currency);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">

      <HeroSection />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 mb-8">
        <div className="max-w-4xl mx-auto glass rounded-2xl shadow-xl border border-white/20 dark:border-white/10 p-2 flex flex-col md:flex-row md:items-stretch gap-2 md:gap-0">
          {/* Location Display */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <div className="flex flex-col">

              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {location.city && location.state ? `${location.city}, ${location.state}` : 'Select Location'}
              </span>
            </div>
          </div>

          {/* ZIP Input */}
          <div className="flex-[1.5] w-full relative">
            <input
              type="text"
              value={zipInput}
              onChange={handleZipChange}
              placeholder="Enter ZIP code..."
              maxLength={6}
              className="w-full pl-4 pr-32 py-4 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              onClick={() => handleUseCurrentLocation(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Detect Location
            </button>
          </div>
        </div>
      </div>

      {/* Quick Collections Strip */}
      <section className="pb-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar pt-4">
          <div className="flex justify-center gap-4 min-w-max">
            {["New Year, New Me", "Women's Wellness", "Heart Health", "Vitamin Boosters", "Senior Care"].map((col, i) => (
              <div key={i} className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all shadow-sm">
                {col}
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* App Promotion Strip */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Get the MiLabs App</h2>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                Exclusive mobile-only deals
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                Instant notifications for reports
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                Digital voucher wallet
              </li>
            </ul>
            <div className="flex gap-4">
              <button className="bg-black/30 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-black/40 transition-colors border border-white/20">
                App Store
              </button>
              <button className="bg-black/30 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-black/40 transition-colors border border-white/20">
                Google Play
              </button>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            {/* Placeholder Phone or QR */}
            <div className="w-64 h-64 bg-white rounded-3xl flex items-center justify-center text-slate-900 font-bold shadow-2xl">
              QR CODE
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
