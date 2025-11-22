import React from 'react';
import { X, Trash2, Share2, Download, Archive } from 'lucide-react';

const SelectionToolbar = ({ selectedCount, onClearSelection, onDelete, onShare, onDownload }) => {
    return (
        <div className="fixed top-16 left-0 right-0 md:left-64 bg-blue-600 text-white z-40 h-16 flex items-center px-4 shadow-lg animate-in slide-in-from-top duration-200">
            <button
                onClick={onClearSelection}
                className="p-2 hover:bg-blue-700 rounded-full transition-colors"
            >
                <X size={24} />
            </button>

            <span className="ml-4 text-lg font-medium">{selectedCount} selected</span>

            <div className="flex-1"></div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onShare}
                    className="p-2 hover:bg-blue-700 rounded-full transition-colors"
                    title="Share"
                >
                    <Share2 size={20} />
                </button>

                <button
                    onClick={onDownload}
                    className="p-2 hover:bg-blue-700 rounded-full transition-colors"
                    title="Download"
                >
                    <Download size={20} />
                </button>

                <button
                    onClick={onDelete}
                    className="p-2 hover:bg-blue-700 rounded-full transition-colors"
                    title="Move to trash"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default SelectionToolbar;
