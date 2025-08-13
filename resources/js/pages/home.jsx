import React from 'react';
import AppLayout from '../layouts/AppLayout';

import { Link } from "@inertiajs/react"; 

const Home = ({ auth }) => {
    return (
        <AppLayout auth={auth}>
            <div className="text-center mt-5">
                <h1>Welcome to Product Feedback Tool</h1>
                <p className="lead">
                    {auth.user ? (
                        <>
                            Submit and view product feedback to help improve our products.
                            <br />
                            <Link href="/feedback" className="btn btn-primary mt-3">View Feedback</Link>
                        </>
                    ) : (
                        <>
                            Please <Link href="/login">login</Link> or <Link href="/register">register</Link> to submit feedback.
                        </>
                    )}
                </p>
            </div>
        </AppLayout>
    );
};

export default Home;