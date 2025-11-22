import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';

// Layouts & Pages
import MainLayout from './layouts/MainLayout';
import PhotosPage from './pages/PhotosPage';
import UploadModal from './components/UploadModal';
import ExplorePage from './pages/ExplorePage';
import SharingPage from './pages/SharingPage';
import LibraryPage from './pages/LibraryPage';
import TrashPage from './pages/TrashPage';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    }

    if (!user) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-google-bgDark text-center p-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full mb-6 flex items-center justify-center text-white font-bold text-2xl">F</div>
                <h1 className="text-2xl mb-8 dark:text-white font-google">Family Moments</h1>
                <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-blue-600 text-white px-8 py-3 rounded-full mb-4 font-medium hover:bg-blue-700 transition-colors">Sign in with Google</button>
                <button onClick={() => signInAnonymously(auth)} className="text-blue-600 hover:underline">Guest Login</button>
            </div>
        );
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: <MainLayout user={user} onUploadClick={() => setIsUploadOpen(true)} />,
            children: [
                {
                    index: true,
                    element: <PhotosPage user={user} />,
                },
                {
                    path: "explore",
                    element: <ExplorePage />,
                },
                {
                    path: "sharing",
                    element: <SharingPage />,
                },
                {
                    path: "library",
                    element: <LibraryPage />,
                },
                {
                    path: "trash",
                    element: <TrashPage user={user} />,
                },
                {
                    path: "*",
                    element: <Navigate to="/" replace />,
                }
            ]
        }
    ]);

    return (
        <>
            <RouterProvider router={router} />
            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                user={user}
            />
        </>
    );
}

export default App;