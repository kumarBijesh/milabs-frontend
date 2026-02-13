'use client';

import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const res = await fetch('/api/users/profile');
                    if (res.ok) {
                        const data = await res.json();
                        setFormData({
                            name: data.name || user.name || '',
                            email: data.email || user.email || '',
                            phone: data.phone || '',
                            address: data.address || '',
                            pincode: data.pincode || ''
                        });
                    }
                } catch (error) {
                    console.error("Failed to load profile", error);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update profile');

            toast.success('Profile updated successfully');
            // updateProfile(formData); // If hook supports it
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Log Out</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 bg-slate-200">
                                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-lg">
                                <User className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'User Name'}</h2>
                        <p className="text-slate-500 text-sm">Patient ID: #{user?.id?.substring(0, 8) || 'MIL-XXXX'}</p>
                        <div className="mt-4 flex justify-center space-x-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                            </span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">MiLabs Premium</h3>
                        <p className="text-blue-100 text-sm mb-4">You are on the free plan. Upgrade to get unlimited report storage and priority support.</p>
                        <Button size="sm" className="bg-white text-blue-600 hover:bg-slate-100 w-full border-0">Upgrade Now</Button>
                    </div>
                </div>

                <div className="col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-500" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <Input
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                icon={Mail}
                                disabled
                                className="opacity-70"
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                icon={Phone}
                                placeholder="+91 99999 99999"
                            />
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        icon={MapPin}
                                        placeholder="Enter your address"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <Input
                                        label="Zip Code"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="Zip Code"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleSubmit} isLoading={isLoading}>Save Changes</Button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Notification Preferences</h3>
                        <div className="space-y-4">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked />
                                <span className="text-slate-700 dark:text-slate-300">Email notifications for reports</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked />
                                <span className="text-slate-700 dark:text-slate-300">SMS alerts for appointments</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                <span className="text-slate-700 dark:text-slate-300">Marketing & Deals</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
