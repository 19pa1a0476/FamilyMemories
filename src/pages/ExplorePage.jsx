import React from 'react';
import { Search, MapPin, Users, Hash } from 'lucide-react';

const ExplorePage = () => {
    const categories = [
        { name: 'People', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { name: 'Places', icon: MapPin, color: 'bg-green-100 text-green-600' },
        { name: 'Things', icon: Hash, color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="mb-8">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search photos..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>

            <section className="mb-10">
                <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <button key={cat.name} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                            <div className={`p-3 rounded-full ${cat.color}`}>
                                <cat.icon size={24} />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Your Activity</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500">No recent activity to show.</p>
                </div>
            </section>
        </div>
    );
};

export default ExplorePage;
