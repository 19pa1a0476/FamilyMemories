import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, appId } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SearchPage = ({ user }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        // We fetch all photos to derive categories. In a real app, we'd use aggregation or a separate collection.
        const unsub = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'family_photos'),
            (snap) => {
                const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setPhotos(list);
                setLoading(false);
            }
        );
        return () => unsub();
    }, [user]);

    const people = Array.from(new Set(photos.map(p => p.uploader))).map(name => {
        const latest = photos.find(p => p.uploader === name)?.image;
        return { name, image: latest };
    });

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="pb-20">
            <h2 className="text-lg font-medium mb-4 dark:text-white">People</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {people.map(person => (
                    <div
                        key={person.name}
                        onClick={() => navigate(`/?person=${person.name}`)} // We'll need to handle this query param in PhotosPage
                        className="cursor-pointer group"
                    >
                        <div className="aspect-square rounded-2xl overflow-hidden mb-2 border dark:border-gray-700 relative">
                            <img src={person.image} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <span className="font-medium text-sm dark:text-gray-200">{person.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
