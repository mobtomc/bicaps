import React, { useEffect, useState } from 'react';
import "./Loader.css"

const Loader = (props) => {
    // Hide the loader after 5 seconds
    useEffect(() => {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            if (loader) {
                loader.style.display = 'none';
            }
        }, 5000);
    }, []);



    return (
        <>
            <div id="loader" className="flex fixed top-0 left-0 w-full h-full flex-col items-center justify-center bg-opacity-70 bg-black z-50">
                <div>Routing You to Home/Dashboard</div>
                <div class="loadingio-spinner-double-ring-iek48lpludb"><div class="ldio-36917wdd4wz">
                    <div></div>
                    <div></div>
                    <div><div></div></div>
                    <div><div></div></div>
                </div></div>
            </div>
        </>
    );
};

export default Loader;