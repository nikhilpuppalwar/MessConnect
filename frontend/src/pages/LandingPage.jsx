import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import Navbar from '../components/layout/Navbar';
import { ChefHat, Search, CreditCard, Star } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <main className="flex-grow">
                <section className="relative px-4 py-24 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">

                    {/* Left Content */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight mb-6">
                            Discover Regional & <span className="text-primary">Authentic</span> Messes Near You
                        </h1>
                        <p className="text-lg sm:text-xl text-text-secondary mb-8 max-w-2xl mx-auto md:mx-0">
                            Connect locally for daily meals, easily manage your subscriptions, and track attendance via QR codes.
                            Say goodbye to daily payment hastles.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Button size="lg" onClick={() => navigate('/signup')}>Get Started as a Student</Button>
                            <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>List your Mess</Button>
                        </div>
                    </div>

                    {/* Right Graphic/Placeholder */}
                    <div className="flex-1 w-full relative">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
                            <img
                                src="https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=1000&auto=format&fit=crop"
                                alt="Local Indian Thali"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg animate-bounce duration-[3000ms]">
                            <div className="flex items-center gap-3">
                                <span className="bg-orange-100 p-2 rounded-full text-primary"><Star size={20} fill="currentColor" /></span>
                                <div>
                                    <p className="text-sm font-bold">Top Rated</p>
                                    <p className="text-xs text-text-secondary">4.8 Average Setup</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Section */}
                <section className="bg-white py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-text-primary mb-4">How MessConnect Works</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto">A seamless loop mapping students to great food while owners easily manage patrons.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <Card hoverable className="text-center p-6 border-none shadow-sm bg-gray-50">
                                <CardBody className="flex flex-col items-center">
                                    <div className="h-16 w-16 bg-orange-100 text-primary rounded-full flex items-center justify-center mb-6">
                                        <Search size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">1. Discover & Explore</h3>
                                    <p className="text-text-secondary text-sm">Browse messes by location, dietary preferences, and student reviews. Read through specific daily menus.</p>
                                </CardBody>
                            </Card>

                            <Card hoverable className="text-center p-6 border-none shadow-sm bg-gray-50">
                                <CardBody className="flex flex-col items-center">
                                    <div className="h-16 w-16 bg-orange-100 text-primary rounded-full flex items-center justify-center mb-6">
                                        <CreditCard size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">2. Subscribe Seamlessly</h3>
                                    <p className="text-text-secondary text-sm">Pick your customized meal plan (Breakfast, Lunch, Dinner). Pay digitally and automatically activate your pass.</p>
                                </CardBody>
                            </Card>

                            <Card hoverable className="text-center p-6 border-none shadow-sm bg-gray-50">
                                <CardBody className="flex flex-col items-center">
                                    <div className="h-16 w-16 bg-orange-100 text-primary rounded-full flex items-center justify-center mb-6">
                                        <ChefHat size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">3. Scan & Eat</h3>
                                    <p className="text-text-secondary text-sm">Simply present your unique QR barcode at the mess. Owners scan your code to record attendance cleanly.</p>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            {/* Basic Footer */}
            <footer className="bg-surface py-8 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center text-text-secondary text-sm flex justify-between items-center">
                    <p>© 2026 MessConnect Platform. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span className="hover:text-primary cursor-pointer">Privacy</span>
                        <span className="hover:text-primary cursor-pointer">Terms</span>
                        <span className="hover:text-primary cursor-pointer">Contact Setup</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
