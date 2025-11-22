import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trash2, Download, Share2, ChevronLeft, ChevronRight, Info, Star } from 'lucide-react';
import { useDrag } from 'react-use-gesture';
import { motion, AnimatePresence } from 'framer-motion';

const ImageViewer = ({ photo, currentUser, onClose, onNext, onPrev, hasNext, hasPrev, onDelete }) => {
    const [direction, setDirection] = useState(0);
    const [showInfo, setShowInfo] = useState(false);
    const isOwner = currentUser && photo.userId === currentUser.uid;

    // 1. ANDROID BACK BUTTON HANDLING (Disabled to fix blinking issue)
    /*
    useEffect(() => {
        window.history.pushState({ modal: true }, '', window.location.href);
        const handlePopState = () => onClose();
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
            if (window.history.state?.modal) window.history.back();
        };
    }, []);
    */

    // 2. KEYBOARD NAVIGATION
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' && hasNext) onNext();
            if (e.key === 'ArrowLeft' && hasPrev) onPrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasNext, hasPrev, onNext, onPrev, onClose]);

    // 3. SWIPE GESTURES
    const bind = useDrag(({ swipe: [swipeX], tap }) => {
        if (tap) return;
        if (swipeX === -1 && hasNext) {
            setDirection(1);
            onNext();
        } else if (swipeX === 1 && hasPrev) {
            setDirection(-1);
            onPrev();
        }
    });

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = photo.image;
        link.download = `photo-${photo.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (navigator.share) {
            const blob = await (await fetch(photo.image)).blob();
            const file = new File([blob], "image.jpg", { type: "image/jpeg" });
            navigator.share({ files: [file] });
        } else {
            alert("Sharing not supported on this device");
        }
    };

    const variants = {
        enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 })
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent absolute top-0 left-0 right-0 z-20">
                <button onClick={onClose} className="p-2 text-white rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex gap-2">
                    <button className="p-2 text-white rounded-full hover:bg-white/10 transition-colors"><Star size={20} /></button>
                    <button onClick={handleShare} className="p-2 text-white rounded-full hover:bg-white/10 transition-colors"><Share2 size={20} /></button>
                    <button onClick={handleDownload} className="p-2 text-white rounded-full hover:bg-white/10 transition-colors"><Download size={20} /></button>
                    {isOwner && <button onClick={() => onDelete(photo.id)} className="p-2 text-white rounded-full hover:bg-white/10 transition-colors"><Trash2 size={20} /></button>}
                    <button onClick={() => setShowInfo(!showInfo)} className={`p-2 rounded-full hover:bg-white/10 transition-colors ${showInfo ? 'text-blue-400' : 'text-white'}`}><Info size={20} /></button>
                </div>
            </div>

            {/* Image Area */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden" {...bind()}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={photo.id}
                        src={photo.image}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="absolute max-w-full max-h-full object-contain touch-none"
                    />
                </AnimatePresence>

                {hasPrev && <button onClick={onPrev} className="hidden md:block absolute left-4 p-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition-colors"><ChevronLeft size={32} /></button>}
                {hasNext && <button onClick={onNext} className="hidden md:block absolute right-4 p-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition-colors"><ChevronRight size={32} /></button>}
            </div>

            {/* Info Panel (Side or Bottom Overlay) */}
            {showInfo && (
                <div className="absolute right-0 top-16 bottom-0 w-80 bg-white dark:bg-google-bgDark border-l dark:border-gray-700 p-6 z-30 animate-in slide-in-from-right duration-200 shadow-2xl overflow-y-auto">
                    <h3 className="text-lg font-medium mb-4 dark:text-white">Info</h3>
                    <div className="space-y-6">
                        {photo.caption && (
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-medium">Caption</label>
                                <p className="text-gray-800 dark:text-gray-200 mt-1">{photo.caption}</p>
                            </div>
                        )}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-medium">Uploaded By</label>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {photo.uploader[0]}
                                </div>
                                <span className="text-gray-800 dark:text-gray-200">{photo.uploader}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-medium">Date</label>
                            <p className="text-gray-800 dark:text-gray-200 mt-1">
                                {photo.timestamp ? new Date(photo.timestamp.toMillis()).toLocaleString() : 'Unknown'}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-medium">Details</label>
                            <p className="text-gray-800 dark:text-gray-200 mt-1 text-sm">12 MP • 3000 x 4000 • 3.2 MB</p>
                            <p className="text-gray-500 text-sm">Pixel 6 Pro</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageViewer;