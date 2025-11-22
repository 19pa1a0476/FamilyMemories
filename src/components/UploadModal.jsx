import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../firebase';
import { X } from 'lucide-react';

// Simple compression helper
const compressImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                const max = 1200; // Increased quality slightly
                if (w > h) { if (w > max) { h *= max / w; w = max } } else { if (h > max) { w *= max / h; h = max } }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            }
        }
    });
};

const UploadModal = ({ isOpen, onClose, user }) => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        const files = e.target.files.files;
        const uploader = e.target.uploader.value;
        const caption = e.target.caption.value;

        if (!files.length || !uploader) return;
        setUploading(true);

        try {
            await Promise.all(Array.from(files).map(async f => {
                const b64 = await compressImage(f);
                await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'family_photos'), {
                    image: b64, caption, uploader, likes: 0, timestamp: serverTimestamp(), userId: user.uid
                });
            }));
            onClose();
        } catch (err) {
            console.error(err);
            alert("Upload Failed");
        }
        setUploading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-google-grayDark p-6 rounded-xl w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium dark:text-white">Upload Photos</h2>
                    <button onClick={onClose}><X className="dark:text-gray-300" /></button>
                </div>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                        <input name="files" type="file" multiple className="block w-full text-sm dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <input name="uploader" placeholder="Your Name" defaultValue={user.displayName} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input name="caption" placeholder="Caption (optional)" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;
