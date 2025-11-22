import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Memories = ({ photos }) => {
    const [stories, setStories] = useState([]);
    const [activeStory, setActiveStory] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        if (!photos || photos.length === 0) return;

        // Mock logic to generate stories based on photos
        // In a real app, this would be more sophisticated (e.g., clustering by date/location)
        const generatedStories = [
            {
                id: 'recent',
                title: 'Recent Highlights',
                cover: photos[0]?.image,
                slides: photos.slice(0, 5)
            },
            {
                id: 'random',
                title: 'Flashback',
                cover: photos[Math.floor(Math.random() * photos.length)]?.image,
                slides: photos.slice().sort(() => 0.5 - Math.random()).slice(0, 5)
            }
        ].filter(s => s.cover); // Only keep stories with covers

        setStories(generatedStories);
    }, [photos]);

    const openStory = (story) => {
        setActiveStory(story);
        setCurrentSlideIndex(0);
    };

    const closeStory = () => {
        setActiveStory(null);
        setCurrentSlideIndex(0);
    };

    const nextSlide = (e) => {
        e?.stopPropagation();
        if (currentSlideIndex < activeStory.slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            closeStory();
        }
    };

    const prevSlide = (e) => {
        e?.stopPropagation();
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    // Auto-advance slides
    useEffect(() => {
        let interval;
        if (activeStory) {
            interval = setInterval(() => {
                nextSlide();
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [activeStory, currentSlideIndex]);

    if (stories.length === 0) return null;

    return (
        <>
            {/* Stories Bar */}
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-4 scrollbar-hide">
                {stories.map(story => (
                    <button
                        key={story.id}
                        onClick={() => openStory(story)}
                        className="flex flex-col items-center gap-2 min-w-[80px] group"
                    >
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-full border-2 border-white dark:border-google-bgDark overflow-hidden">
                                <img src={story.cover} alt={story.title} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{story.title}</span>
                    </button>
                ))}
            </div>

            {/* Full Screen Viewer */}
            {activeStory && (
                <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
                    {/* Progress Bar */}
                    <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                        {activeStory.slides.map((_, idx) => (
                            <div key={idx} className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-white transition-all duration-200 ease-linear ${idx < currentSlideIndex ? 'w-full' :
                                            idx === currentSlideIndex ? 'w-full animate-progress' : 'w-0'
                                        }`}
                                    style={{ animationDuration: '5s' }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <button onClick={closeStory} className="absolute top-8 right-4 text-white z-20 p-2">
                        <X size={24} />
                    </button>

                    <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={prevSlide}></div>
                    <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={nextSlide}></div>

                    {/* Content */}
                    <div className="w-full h-full max-w-md mx-auto relative flex flex-col">
                        <div className="flex-1 relative">
                            <img
                                src={activeStory.slides[currentSlideIndex].image}
                                alt="story"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                                <p className="font-medium">{activeStory.slides[currentSlideIndex].uploader}</p>
                                <p className="text-sm opacity-80">
                                    {activeStory.slides[currentSlideIndex].timestamp?.toDate().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Memories;
