import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import useQuestionStore from './store/questionStore';
import Navbar from './components/Navbar';
import SolvedView from './components/SolvedView';
import QuestionItem from './QuestionItem';
import AddQuestionModal from './components/AddQuestionModal';
import Modal from './components/Modal';

function Dashboard({ user, onLogout }) {
    const { questions, setQuestions, addTopic, addSubTopic, deleteQuestion } = useQuestionStore();
    const [solvedQuestions, setSolvedQuestions] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const [currentView, setCurrentView] = useState('workspace'); // 'workspace' or 'solved'
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [showAddTopicModal, setShowAddTopicModal] = useState(false);
    const [showAddSubTopicModal, setShowAddSubTopicModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedSubTopic, setSelectedSubTopic] = useState('');
    const [newTopicName, setNewTopicName] = useState('');
    const [newSubTopicName, setNewSubTopicName] = useState('');

    // Fetch questions from JSON file
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('/data/sheet.json');
                const data = await response.json();
                setQuestions(data.data.questions || []);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [setQuestions]);

    // Load solved questions from Firestore or localStorage
    useEffect(() => {
        const loadSolvedQuestions = async () => {
            if (!user) {
                return;
            }

            // Guest user - use localStorage
            if (user.isGuest) {
                const saved = localStorage.getItem('solvedQuestions');
                if (saved) {
                    setSolvedQuestions(JSON.parse(saved));
                }
                return;
            }

            // Google user - use Firestore
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setSolvedQuestions(userDoc.data().solved || {});
                }
            } catch (error) {
                console.error('Error loading solved questions:', error);
            }
        };

        loadSolvedQuestions();
    }, [user]);

    // Toggle solved status
    const toggleSolved = async (questionId) => {
        const newSolvedStatus = { ...solvedQuestions };

        if (newSolvedStatus[questionId]) {
            delete newSolvedStatus[questionId];
        } else {
            newSolvedStatus[questionId] = true;
        }

        setSolvedQuestions(newSolvedStatus);

        // Save to localStorage for guest users
        if (user.isGuest) {
            localStorage.setItem('solvedQuestions', JSON.stringify(newSolvedStatus));
            return;
        }

        // Save to Firestore for Google users
        try {
            await setDoc(doc(db, 'users', user.uid), {
                solved: newSolvedStatus
            });
        } catch (error) {
            console.error('Error saving to Firestore:', error);
        }
    };

    // Filter questions by search query
    const filteredQuestions = questions.filter(q =>
        q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.questionId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subTopic?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group questions by topic and subtopic
    const groupedQuestions = filteredQuestions.reduce((acc, question) => {
        const topic = question.topic || 'Other';
        const subTopic = question.subTopic || 'General';

        if (!acc[topic]) {
            acc[topic] = {};
        }
        if (!acc[topic][subTopic]) {
            acc[topic][subTopic] = [];
        }
        acc[topic][subTopic].push(question);

        return acc;
    }, {});

    // Toggle topic expansion
    const toggleTopic = (topic) => {
        setExpandedTopics(prev => ({
            ...prev,
            [topic]: !prev[topic]
        }));
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            // Sign out from Firebase if Google user
            if (!user.isGuest && user.uid) {
                await signOut(auth);
            }
            // Call parent logout handler
            if (onLogout) {
                onLogout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Handle add topic
    const handleAddTopic = () => {
        if (newTopicName.trim()) {
            addTopic(newTopicName.trim());
            setNewTopicName('');
            setShowAddTopicModal(false);
        }
    };

    // Handle add subtopic
    const handleAddSubTopic = () => {
        if (newSubTopicName.trim() && selectedTopic) {
            addSubTopic(selectedTopic, newSubTopicName.trim());
            setNewSubTopicName('');
            setShowAddSubTopicModal(false);
        }
    };

    // Open add question modal
    const openAddQuestionModal = (topic, subTopic) => {
        setSelectedTopic(topic);
        setSelectedSubTopic(subTopic);
        setShowAddQuestionModal(true);
    };

    // Open add subtopic modal
    const openAddSubTopicModal = (topic) => {
        setSelectedTopic(topic);
        setShowAddSubTopicModal(true);
    };

    // Calculate progress
    const totalQuestions = questions.length;
    const solvedCount = Object.keys(solvedQuestions).length;
    const progressPercentage = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navbar */}
            <Navbar
                user={user}
                onLogout={handleLogout}
                currentView={currentView}
                onViewChange={setCurrentView}
                solvedCount={solvedCount}
                totalCount={totalQuestions}
            />

            {/* Render current view */}
            {currentView === 'solved' ? (
                <SolvedView
                    questions={questions}
                    solvedQuestions={solvedQuestions}
                    onToggleSolved={toggleSolved}
                />
            ) : (
                <>
                    {/* Workspace Header */}
                    <div className="bg-gray-900 border-b border-gray-800">
                        <div className="max-w-7xl mx-auto px-4 py-6">
                            <h1 className="text-3xl font-bold text-white mb-2">My Workspace</h1>
                            <p className="text-gray-400">Keep a track of all your questions here</p>

                            {/* Search and filters */}
                            <div className="mt-6 flex flex-wrap gap-3">
                                {/* Search */}
                                <div className="flex-1 min-w-[300px]">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search question"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>

                                {/* Add Topic Button */}
                                <button
                                    onClick={() => setShowAddTopicModal(true)}
                                    className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors shadow-lg"
                                >
                                    + Add Topic
                                </button>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-400">Overall Progress</span>
                                    <span className="text-orange-500 font-semibold">{solvedCount} / {totalQuestions} ({progressPercentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2">
                                    <div
                                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <main className="max-w-7xl mx-auto px-4 py-6">
                        {Object.keys(groupedQuestions).length === 0 ? (
                            <div className="text-center text-gray-400 py-12">
                                <p className="text-lg mb-4">
                                    {searchQuery ? 'No questions found matching your search.' : 'No questions found.'}
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => setShowAddTopicModal(true)}
                                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Add Your First Topic
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Loop through topics */}
                                {Object.entries(groupedQuestions).map(([topic, subTopics]) => (
                                    <div key={topic} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                                        {/* Topic header */}
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                                            <button
                                                onClick={() => toggleTopic(topic)}
                                                className="flex-1 flex items-center justify-between hover:bg-gray-750 transition-colors"
                                            >
                                                <h2 className="text-xl font-semibold text-white">{topic}</h2>
                                                <svg
                                                    className={`w-6 h-6 text-gray-400 transition-transform ${expandedTopics[topic] ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => openAddSubTopicModal(topic)}
                                                className="ml-4 px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors border border-gray-700"
                                            >
                                                + Sub-topic
                                            </button>
                                        </div>

                                        {/* Topic content */}
                                        {expandedTopics[topic] && (
                                            <div className="px-6 pb-6">
                                                {/* Loop through subtopics */}
                                                {Object.entries(subTopics).map(([subTopic, questionsList]) => (
                                                    <div key={subTopic} className="mt-4">
                                                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                                                            <h3 className="text-lg font-medium text-gray-300">{subTopic}</h3>
                                                            <button
                                                                onClick={() => openAddQuestionModal(topic, subTopic)}
                                                                className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors border border-gray-700"
                                                            >
                                                                + Question
                                                            </button>
                                                        </div>

                                                        {/* Questions list */}
                                                        <div className="space-y-2">
                                                            {questionsList.map((question) => (
                                                                <QuestionItem
                                                                    key={question._id}
                                                                    question={question}
                                                                    isSolved={!!solvedQuestions[question._id]}
                                                                    onToggleSolved={toggleSolved}
                                                                    onDelete={() => deleteQuestion(question._id)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </>
            )}

            {/* Modals */}
            <AddQuestionModal
                isOpen={showAddQuestionModal}
                onClose={() => setShowAddQuestionModal(false)}
                topic={selectedTopic}
                subTopic={selectedSubTopic}
            />

            {/* Add Topic Modal */}
            <Modal
                isOpen={showAddTopicModal}
                onClose={() => setShowAddTopicModal(false)}
                title="Add New Topic"
            >
                <div className="space-y-4">
                    <input
                        type="text"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        placeholder="Enter topic name"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowAddTopicModal(false)}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddTopic}
                            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            Add Topic
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add SubTopic Modal */}
            <Modal
                isOpen={showAddSubTopicModal}
                onClose={() => setShowAddSubTopicModal(false)}
                title={`Add Sub-topic to "${selectedTopic}"`}
            >
                <div className="space-y-4">
                    <input
                        type="text"
                        value={newSubTopicName}
                        onChange={(e) => setNewSubTopicName(e.target.value)}
                        placeholder="Enter sub-topic name"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowAddSubTopicModal(false)}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddSubTopic}
                            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            Add Sub-topic
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Dashboard;
