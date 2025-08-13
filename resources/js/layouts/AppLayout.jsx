import React from 'react';
import { Head, Link } from "@inertiajs/react"; 

const AppLayout = ({ children, auth }) => {
    return (
        <>
            <Head title="Product Feedback Tool" />
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link href="/" className="navbar-brand">Product Feedback</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            {auth.user && (
                                <li className="nav-item">
                                    <Link href="/feedback" className="nav-link">Feedback</Link>
                                </li>
                            )}
                        </ul>
                        <ul className="navbar-nav">
                            {auth.user ? (
                                <li className="nav-item">
                                    <Link href="/logout" method="post" as="button" className="nav-link btn btn-link">Logout</Link>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link href="/login" className="nav-link">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/register" className="nav-link">Register</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                {children}
            </div>
        </>
    );
};

export default AppLayout;