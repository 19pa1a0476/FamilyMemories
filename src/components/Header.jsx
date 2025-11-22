import React, { useState, useRef, useEffect } from 'react';
import { Search, Upload, HelpCircle, Settings, Menu, LogOut, User } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header = ({ onMenuClick, user, onUploadClick, toggleTheme }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setShowProfileMenu(false);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-google-bgDark z-50 flex items-center px-4 justify-between border-b border-transparent dark:border-gray-800">
            <div className="flex items-center gap-4 w-64">
                <button onClick={onMenuClick} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">F</div>
                    <span className="text-xl text-gray-600 dark:text-gray-200 font-normal tracking-tight">Photos</span>
                </div>
            </div>

            <div className="flex-1 max-w-2xl px-4 hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search your photos"
                        className="block w-full pl-10 pr-3 py-3 border-none rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-0 focus:bg-white dark:focus:bg-gray-700 shadow-sm transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 justify-end w-64">
                <button onClick={onUploadClick} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <Upload size={18} />
                    <span className="hidden sm:inline">Upload</span>
                </button>

                <div className="hidden sm:flex items-center gap-2">
                    <button onClick={() => alert("Help coming soon!")} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <HelpCircle size={24} />
                    </button>
                    <button onClick={() => alert("Settings coming soon!")} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <Settings size={24} />
                    </button>
                </div>

                <div className="ml-2 relative" ref={menuRef}>
                    {user ? (
                        <>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center text-sm font-medium ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700 focus:outline-none"
                            >
                                {user.displayName?.[0] || 'U'}
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-google-grayDark rounded-xl shadow-lg py-2 border dark:border-gray-700 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                    <div className="px-4 py-3 border-b dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName || 'User'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <button onClick={() => alert("Profile settings coming soon")} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                            <User size={16} />
                                            Manage Account
                                        </button>
                                        <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                            <LogOut size={16} />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
