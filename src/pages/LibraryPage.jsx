import React from 'react';
import { Folder, Heart, Trash2, Archive, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const LibraryPage = () => {
    const shortcuts = [
        { name: 'Favorites', icon: Heart, path: '/favorites', color: 'text-red-500' },
        { name: 'Utilities', icon: Settings, path: '/utilities', color: 'text-gray-600' },
        { name: 'Archive', icon: Archive, path: '/archive', color: 'text-blue-600' },
        { name: 'Trash', icon: Trash2, path: '/trash', color: 'text-gray-600' },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <h1 className="text-2xl font-google text-gray-800 dark:text-white mb-8">Library</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {shortcuts.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <item.icon size={32} className={`mb-3 ${item.color}`} />
                        <span className="font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                    </Link>
                ))}
            </div>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">Albums</h2>
                    <button className="text-blue-600 hover:underline text-sm font-medium">New Album</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Mock Albums */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-2 overflow-hidden">
                                <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500">
                                    <Folder size={40} />
                                </div>
                            </div>
                            <h3 className="font-medium text-gray-800 dark:text-white truncate">Untitled Album {i}</h3>
                            <p className="text-sm text-gray-500">0 items</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LibraryPage;
