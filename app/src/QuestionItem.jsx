function QuestionItem({ question, isSolved, onToggleSolved, onDelete }) {
    const getDifficultyColor = (difficulty) => {
        if (difficulty === 'Easy') return 'bg-green-900/50 text-green-300 border-green-700';
        if (difficulty === 'Medium') return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
        if (difficulty === 'Hard') return 'bg-red-900/50 text-red-300 border-red-700';
        return 'bg-gray-700 text-gray-300 border-gray-600';
    };

    return (
        <div
            className={`p-5 rounded-lg border transition-all duration-200 ${isSolved
                    ? 'bg-green-900/10 border-green-700/30'
                    : 'bg-gray-800/50 border-gray-700 hover:border-orange-500/50 hover:bg-gray-800'
                }`}
        >
            <div className="flex items-start gap-4">
                <input
                    type="checkbox"
                    checked={isSolved}
                    onChange={() => onToggleSolved(question._id)}
                    className="mt-1.5 w-5 h-5 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className={`text-base font-semibold ${isSolved ? 'text-green-300 line-through' : 'text-white'}`}>
                            {question.title}
                        </h4>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${getDifficultyColor(question.questionId?.difficulty)}`}>
                                {question.questionId?.difficulty || 'N/A'}
                            </span>

                            {onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1.5 rounded transition-colors"
                                    title="Delete question"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-3">
                        {question.questionId?.name}
                    </p>

                    {question.questionId?.problemUrl && (
                        <a
                            href={question.questionId.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Solve Problem
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuestionItem;
