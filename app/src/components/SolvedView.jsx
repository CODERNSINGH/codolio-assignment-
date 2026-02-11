// Solved questions view component
function SolvedView({ questions, solvedQuestions, onToggleSolved }) {
    // Filter only solved questions
    const solvedQuestionsList = questions.filter(q => solvedQuestions[q._id]);

    // Group solved questions by difficulty
    const groupedByDifficulty = solvedQuestionsList.reduce((acc, question) => {
        const difficulty = question.questionId?.difficulty || 'Unknown';
        if (!acc[difficulty]) {
            acc[difficulty] = [];
        }
        acc[difficulty].push(question);
        return acc;
    }, {});

    const getDifficultyColor = (difficulty) => {
        if (difficulty === 'Easy') return 'text-cyan-400';
        if (difficulty === 'Medium') return 'text-orange-400';
        if (difficulty === 'Hard') return 'text-red-400';
        return 'text-gray-400';
    };

    const getDifficultyBg = (difficulty) => {
        if (difficulty === 'Easy') return 'bg-cyan-900/20 border-cyan-700/50';
        if (difficulty === 'Medium') return 'bg-orange-900/20 border-orange-700/50';
        if (difficulty === 'Hard') return 'bg-red-900/20 border-red-700/50';
        return 'bg-gray-800 border-gray-700';
    };

    if (solvedQuestionsList.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Solved Questions Yet</h3>
                    <p className="text-gray-500">Start solving questions to see them here!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Solved Questions</h2>
                <p className="text-gray-400">
                    You've solved <span className="text-orange-500 font-semibold">{solvedQuestionsList.length}</span> questions
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {['Easy', 'Medium', 'Hard'].map((difficulty) => {
                    const count = groupedByDifficulty[difficulty]?.length || 0;
                    return (
                        <div key={difficulty} className={`p-4 rounded-lg border ${getDifficultyBg(difficulty)}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">{difficulty}</span>
                                <span className={`text-2xl font-bold ${getDifficultyColor(difficulty)}`}>
                                    {count}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Questions table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-900 border-b border-gray-700 text-sm font-medium text-gray-400">
                    <div className="col-span-1"></div>
                    <div className="col-span-6">Question Name</div>
                    <div className="col-span-2 text-center">Link</div>
                    <div className="col-span-3 text-center">Difficulty</div>
                </div>

                {/* Table rows */}
                <div className="divide-y divide-gray-700">
                    {solvedQuestionsList.map((question) => (
                        <div
                            key={question._id}
                            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-750 transition-colors"
                        >
                            {/* Checkbox */}
                            <div className="col-span-1 flex items-center">
                                <button
                                    onClick={() => onToggleSolved(question._id)}
                                    className="text-green-500 hover:text-green-400 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {/* Question name and tags */}
                            <div className="col-span-6">
                                <h4 className="text-gray-200 font-medium mb-1">
                                    {question.questionId?.name || question.title}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {question.topic && (
                                        <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                                            {question.topic}
                                        </span>
                                    )}
                                    {question.subTopic && question.subTopic !== 'General' && (
                                        <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                                            {question.subTopic}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Link */}
                            <div className="col-span-2 flex items-center justify-center">
                                {question.questionId?.problemUrl ? (
                                    <a
                                        href={question.questionId.problemUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-500 hover:text-orange-400 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                ) : (
                                    <span className="text-gray-600">-</span>
                                )}
                            </div>

                            {/* Difficulty */}
                            <div className="col-span-3 flex items-center justify-center">
                                <span className={`font-medium ${getDifficultyColor(question.questionId?.difficulty)}`}>
                                    {question.questionId?.difficulty || 'N/A'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SolvedView;
