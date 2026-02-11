import { useState } from 'react';

function Navbar({ user, onLogout, currentView, onViewChange, solvedCount, totalCount }) {
    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://codolio.com/codolio_assets/codolio.svg"
                                alt="Codolio"
                                className="h-8 w-8"
                            />
                            <span className="text-xl font-bold">
                                <span className="text-white">code</span>
                                <span className="text-orange-500">lio</span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => onViewChange('workspace')}
                                className={`text-sm font-medium transition-colors ${currentView === 'workspace'
                                        ? 'text-orange-500'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                My Workspace
                            </button>
                            <button
                                onClick={() => onViewChange('solved')}
                                className={`text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'solved'
                                        ? 'text-orange-500'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Solved
                                <span className="px-2 py-0.5 bg-gray-800 rounded text-xs">
                                    {solvedCount}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Progress:</span>
                            <span className="text-orange-500 font-semibold">
                                {solvedCount}/{totalCount}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">
                                    {user?.displayName || 'User'}
                                </p>
                                {user?.email && (
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                )}
                                {user?.isGuest && (
                                    <p className="text-xs text-gray-500">Guest Mode</p>
                                )}
                            </div>

                            {user?.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-gray-700"
                                />
                            )}

                            {user?.isGuest && (
                                <button
                                    onClick={onLogout}
                                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors"
                                >
                                    Sign In
                                </button>
                            )}

                            {!user?.isGuest && (
                                <button
                                    onClick={onLogout}
                                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:hidden flex items-center gap-4 pb-3">
                    <button
                        onClick={() => onViewChange('workspace')}
                        className={`text-sm font-medium transition-colors ${currentView === 'workspace'
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }`}
                    >
                        My Workspace
                    </button>
                    <button
                        onClick={() => onViewChange('solved')}
                        className={`text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'solved'
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }`}
                    >
                        Solved
                        <span className="px-2 py-0.5 bg-gray-800 rounded text-xs">
                            {solvedCount}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
