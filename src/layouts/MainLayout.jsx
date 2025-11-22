import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = ({ user, onUploadClick }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-google-bgDark">
            <Header user={user} onUploadClick={onUploadClick} />
            <Sidebar />

            <main className="pt-16 md:pl-64 min-h-screen transition-all duration-300">
                <div className="p-4">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav could go here if we want to stick to the plan strictly, 
          but for now Sidebar handles desktop and we can add a BottomNav component later for mobile */}
        </div>
    );
};

export default MainLayout;
