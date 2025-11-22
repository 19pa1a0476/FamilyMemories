import React from 'react';
import { Heart, CheckCircle } from 'lucide-react';

const PhotoCard = ({ photo, isSelected, isSelectionMode, onToggleSelect, onOpen, onLike }) => {

    const handleClick = (e) => {
        console.log('PhotoCard clicked', photo.id, 'SelectionMode:', isSelectionMode);
        if (isSelectionMode) {
            onToggleSelect(photo.id);
        } else {
            console.log('Opening photo:', photo);
            onOpen(photo);
        }
    };

    const handleCheckClick = (e) => {
        e.stopPropagation();
        onToggleSelect(photo.id);
    };

    return (
        <div
            onClick={handleClick}
            className={`relative group aspect-square bg-gray-100 dark:bg-gray-800 cursor-pointer overflow-hidden rounded-md transition-all duration-200 ${isSelected ? 'p-4' : ''}`}
        >
            {/* Selection Ring Effect */}
            <div className={`w-full h-full overflow-hidden rounded-sm transition-all ${isSelected ? 'scale-90 rounded-lg ring-2 ring-blue-500' : ''}`}>
                <img
                    src={photo.image}
                    alt="memory"
                    className="w-full h-full object-cover pointer-events-none select-none"
                    loading="lazy"
                />
            </div>

            {/* Selection Checkbox (Visible on hover or if selected) */}
            <div className={`absolute top-2 left-2 z-10 ${isSelected || isSelectionMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <button onClick={handleCheckClick} className="focus:outline-none">
                    {isSelected ? (
                        <CheckCircle className="text-blue-500 fill-white" size={24} />
                    ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/80 bg-black/20 hover:bg-black/40 transition-colors"></div>
                    )}
                </button>
            </div>

            {/* Like Button & Overlay (Hidden in selection mode) */}
            {!isSelectionMode && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2">
                    <div className="flex justify-between items-center text-white">
                        <span className="text-xs font-medium truncate">{photo.uploader}</span>
                        <button onClick={(e) => { e.stopPropagation(); onLike(photo.id); }} className="p-1 hover:bg-white/20 rounded-full">
                            <Heart size={16} className={photo.likes > 0 ? "fill-rose-500 text-rose-500" : "text-white"} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoCard;