import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, appId } from '../firebase';
import PhotoGrid from '../components/PhotoGrid';
import ImageViewer from '../components/ImageViewer';
import SelectionToolbar from '../components/SelectionToolbar';

const PhotosPage = ({ user }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [viewingPhoto, setViewingPhoto] = useState(null);

    useEffect(() => {
        if (!user) return;
        const unsubData = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'family_photos'),
            (snap) => {
                const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                    .filter(p => !p.isTrashed) // Filter out trashed photos
                    .sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
                setPhotos(list);
                setLoading(false);
            }
        );
        return () => unsubData();
    }, [user]);

    const groupedPhotos = useMemo(() => {
        const g = {};
        photos.forEach(p => {
            const date = p.timestamp ? new Date(p.timestamp.toMillis()).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent';
            if (!g[date]) g[date] = [];
            g[date].push(p);
        });
        return g;
    }, [photos]);

    const toggleSelection = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const clearSelection = () => {
        setSelectedIds(new Set());
    };

    const handleBatchDelete = async () => {
        if (!confirm(`Move ${selectedIds.size} photo(s) to trash?`)) return;
        try {
            await Promise.all([...selectedIds].map(id =>
                updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'family_photos', id), { isTrashed: true })
            ));
            setSelectedIds(new Set());
        } catch (e) {
            console.error("Error deleting photos:", e);
            alert("Error deleting photos");
        }
    };

    const handleBatchShare = async () => {
        const selectedPhotos = photos.filter(p => selectedIds.has(p.id));
        if (selectedPhotos.length === 0) return;

        if (navigator.share && selectedPhotos.length === 1) {
            try {
                const blob = await (await fetch(selectedPhotos[0].image)).blob();
                const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
                await navigator.share({ files: [file] });
            } catch (err) {
                console.log("Share failed:", err);
            }
        } else {
            alert(`Sharing ${selectedPhotos.length} photos. This feature will open a share dialog in the full implementation.`);
        }
    };

    const handleBatchDownload = async () => {
        const selectedPhotos = photos.filter(p => selectedIds.has(p.id));
        selectedPhotos.forEach((photo, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = photo.image;
                link.download = `photo-${photo.id}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, index * 100);
        });
    };

    if (loading) return <div className="flex justify-center pt-20">Loading...</div>;

    return (
        <>
            {selectedIds.size > 0 && (
                <SelectionToolbar
                    selectedCount={selectedIds.size}
                    onClearSelection={clearSelection}
                    onDelete={handleBatchDelete}
                    onShare={handleBatchShare}
                    onDownload={handleBatchDownload}
                />
            )}

            <div className={selectedIds.size > 0 ? 'mt-16' : ''}>
                <PhotoGrid
                    groupedPhotos={groupedPhotos}
                    selectedIds={selectedIds}
                    isSelectionMode={selectedIds.size > 0}
                    onToggleSelect={toggleSelection}
                    onOpen={setViewingPhoto}
                />
            </div>

            {viewingPhoto && (
                console.log('Rendering ImageViewer for:', viewingPhoto),
                <ImageViewer
                    photo={viewingPhoto}
                    currentUser={user}
                    onClose={() => setViewingPhoto(null)}
                    onNext={() => {
                        const idx = photos.findIndex(p => p.id === viewingPhoto.id);
                        if (idx < photos.length - 1) setViewingPhoto(photos[idx + 1]);
                    }}
                    onPrev={() => {
                        const idx = photos.findIndex(p => p.id === viewingPhoto.id);
                        if (idx > 0) setViewingPhoto(photos[idx - 1]);
                    }}
                    hasNext={photos.findIndex(p => p.id === viewingPhoto.id) < photos.length - 1}
                    hasPrev={photos.findIndex(p => p.id === viewingPhoto.id) > 0}
                    onDelete={async (id) => {
                        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'family_photos', id), { isTrashed: true });
                        setViewingPhoto(null);
                    }}
                />
            )}
        </>
    );
};

export default PhotosPage;
