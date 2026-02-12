
import Link from 'next/link';

export default function UtilityBar() {
    return (
        <div className="bg-slate-900 text-white text-xs py-2 px-4 selection:bg-blue-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                {/* Left: Promos */}
                <div className="flex items-center gap-4 animate-fade-in">
                    <span className="font-medium text-blue-300">New Year, New Me!</span>
                    <span className="text-slate-400 hidden sm:inline">|</span>
                    <span className="text-slate-300 truncate">Up to 30% off health packages using code <span className="font-bold text-white">GLOWUP</span></span>
                </div>

                {/* Right: Links */}
                <div className="flex items-center gap-6 text-slate-300 font-medium">
                    <Link href="/download-app" className="hover:text-white transition-colors">Download App</Link>
                    <Link href="/labs/join" className="hover:text-white transition-colors">Sell on MiLabs</Link>
                    <Link href="/help" className="hover:text-white transition-colors">Help</Link>
                </div>
            </div>
        </div>
    );
}
