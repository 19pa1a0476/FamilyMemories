import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, appId } from '../firebase';
import { Trash2, RotateCcw } from 'lucide-react';

const TrashPage = ({ user }) => {
    const [trashedPhotos, setTrashedPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'family_photos'),
            (snap) => {
                const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                    .filter(p => p.isTrashed)
                    .sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
                setTrashedPhotos(list);
                setLoading(false);
            }
        );
        return () => unsub();
    }, [user]);

    const handleRestore = async (id) => {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'family_photos', id), { isTrashed: false });
    };

    const handleDeletePermanently = async (id) => {
        if (confirm("Delete permanently? This action cannot be undone.")) {
            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'family_photos', id));
        }
    };

    const handleEmptyTrash = async () => {
        if (confirm("Empty trash? All items will be permanently deleted.")) {
            await Promise.all(trashedPhotos.map(p => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'family_photos', p.id))));
        }
    };

    if (loading) return <div className="flex justify-center pt-20">Loading...</div>;

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-6 px-4">
                <h1 className="text-2xl font-google text-gray-800 dark:text-white">Trash</h1>
                {trashedPhotos.length > 0 && (
                    <button
                        onClick={handleEmptyTrash}
                        className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Empty Trash
                    </button>
                )}
            </div>

            {trashedPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Trash2 size={48} className="mb-4 opacity-50" />
                    <p>Trash is empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4">
                    {trashedPhotos.map(photo => (
                        <div key={photo.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img src={photo.image} alt="trashed" className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleRestore(photo.id)}
                                    className="p-2 bg-white/90 rounded-full hover:bg-white text-blue-600"
                                    title="Restore"
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    onClick={() => handleDeletePermanently(photo.id)}
                                    className="p-2 bg-white/90 rounded-full hover:bg-white text-red-600"
                                    title="Delete Permanently"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <p className="text-center text-xs text-gray-400 mt-8">Items in trash will be permanently deleted after 60 days (mock).</p>
        </div>
    );
};

export default TrashPage;
