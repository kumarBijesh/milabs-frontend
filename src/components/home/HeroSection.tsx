"use client";

import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '@/lib/constants';

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full min-h-[600px] md:min-h-[550px] bg-slate-100 dark:bg-slate-900 overflow-hidden">
            {heroSlides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <div className={`w-full h-full flex items-center ${slide.color}`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0 md:pb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full h-full">
                            <div className="text-white space-y-4 md:space-y-6 flex flex-col justify-center order-2 md:order-1">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                                        Limited Time Offer
                                    </span>
                                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                        {slide.title}
                                    </h1>
                                </div>
                                <p className="text-white/90 text-base md:text-xl max-w-md">
                                    {slide.subtitle}
                                </p>
                                <div>
                                    <a href={slide.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-colors gap-2 group text-sm md:text-base">
                                        {slide.cta}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>

                            {/* Image Part - Visible on Mobile now */}
                            <div className="h-48 md:h-80 w-full bg-white/10 rounded-2xl backdrop-blur-sm relative overflow-hidden group/image shadow-2xl order-1 md:order-2 flex items-center justify-center">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover opacity-90 group-hover/image:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroSlides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-white' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
