import React from 'react';
import PhotoCard from './PhotoCard';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, appId } from '../firebase';

const PhotoGrid = ({ groupedPhotos, selectedIds, isSelectionMode, onToggleSelect, onOpen }) => {

    const handleLike = async (id) => {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'family_photos', id), { likes: increment(1) });
    };

    return (
        <div className="space-y-8 pb-20">
            {Object.entries(groupedPhotos).map(([date, photos]) => (
                <div key={date}>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 mt-6 ml-1">{date}</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-4">
                        {photos.map(p => (
                            <PhotoCard
                                key={p.id}
                                photo={p}
                                isSelected={selectedIds.has(p.id)}
                                isSelectionMode={isSelectionMode}
                                onToggleSelect={onToggleSelect}
                                onOpen={onOpen}
                                onLike={handleLike}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PhotoGrid;
