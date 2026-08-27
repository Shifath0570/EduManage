"use client"

import { useSession } from '@/app/lib/auth-client';
import React from 'react';

const admin = () => {
    const { data: session, isPending, error } = useSession();

    if (isPending) {
        return <div>Loading session...</div>;
    }

    if (!session?.user) {
        return <div>Access Denied / Not Authenticated</div>;
    }

    const user = session.user;
    console.log("User:", user);
    return (
        <div>
            <h2>this is admin</h2>
        </div>
    );
};

export default admin;


