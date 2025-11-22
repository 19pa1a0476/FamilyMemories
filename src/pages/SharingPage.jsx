import React from 'react';
import { Users, Plus } from 'lucide-react';

const SharingPage = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-google text-gray-800 dark:text-white">Sharing</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium text-sm">
                    <Plus size={18} />
                    Create Shared Album
                </button>
            </div>

            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-48 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 flex items-center justify-center">
                    <Users size={48} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-2">Share your memories</h2>
                <p className="text-gray-500 max-w-md">
                    Create shared albums to collect photos and videos from friends and family.
                </p>
            </div>
        </div>
    );
};

export default SharingPage;
