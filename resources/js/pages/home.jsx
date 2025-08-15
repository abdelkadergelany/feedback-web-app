import React from 'react';
import { useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import { Head, Link } from "@inertiajs/react";
import { router } from '@inertiajs/react';
import { useAuth } from './context/auth';

const Home = ({ auth }) => {

    const { user, loading } = useAuth();

    useEffect(() => {
        if (user && user.name) {
            router.visit('/feedback');
        }
    }, [user]);

    return (
        <AppLayout auth={auth}>
            <Head title="Welcome" />
            
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                {/* Decorative elements */}
                <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full">
                    <div className="relative h-full max-w-7xl mx-auto">
                        <svg
                            className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
                            width={404}
                            height={784}
                            fill="none"
                            viewBox="0 0 404 784"
                        >
                            <defs>
                                <pattern
                                    id="svg-pattern-squares-1"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-indigo-200" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={784} fill="url(#svg-pattern-squares-1)" />
                        </svg>
                        <svg
                            className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
                            width={404}
                            height={784}
                            fill="none"
                            viewBox="0 0 404 784"
                        >
                            <defs>
                                <pattern
                                    id="svg-pattern-squares-2"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-indigo-200" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={784} fill="url(#svg-pattern-squares-2)" />
                        </svg>
                    </div>
                </div>

                <div className="relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
                    <div className="relative max-w-7xl mx-auto">
                        <div className="text-center">
                            
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                {auth.user ? (
                                    "Submit and view product feedback to help improve our products."
                                ) : (
                                    "Join our community to share your feedback and help shape our products."
                                )}
                            </p>
                            <div className="mt-8 flex justify-center">
                                {auth.user ? (
                                    <div className="space-y-3 sm:space-y-0 sm:space-x-3">
                                        <Link
                                            href="/feedback"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors"
                                        >
                                            View Feedback
                                        </Link>
                                        <Link
                                            href="/feedback/create"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors"
                                        >
                                            Submit Feedback
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-0 sm:space-x-3">
                                        <Link
                                            href="/login"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors"
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          
        </AppLayout>
    );
};

export default Home;