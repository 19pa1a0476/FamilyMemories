import React from 'react';
import { NavLink } from 'react-router-dom';
import { Image, Search, Share2, Library, Trash2, Cloud } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: Image, label: 'Photos', path: '/' },
        { icon: Search, label: 'Explore', path: '/explore' },
        { icon: Share2, label: 'Sharing', path: '/sharing' },
        { icon: Library, label: 'Library', path: '/library' },
        { icon: Trash2, label: 'Trash', path: '/trash' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 pt-16 pb-4 px-2 bg-white dark:bg-google-bgDark z-40">
            <nav className="flex-1 space-y-1 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-3 rounded-r-full text-sm font-medium transition-colors
              ${isActive
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-6 py-4 mt-auto">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm mb-2">
                    <Cloud size={18} />
                    <span>Storage</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                    <div className="bg-blue-500 h-1.5 rounded-full w-1/3"></div>
                </div>
                <p className="text-xs text-gray-500">5GB of 15GB used</p>
            </div>
        </aside>
    );
};

export default Sidebar;
