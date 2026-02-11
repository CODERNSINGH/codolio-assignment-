import { create } from 'zustand';

// Zustand store for managing questions, topics, and subtopics
const useQuestionStore = create((set) => ({
    // State
    questions: [],
    loading: false,
    error: null,

    // Set questions from API or local data
    setQuestions: (questions) => set({ questions }),

    // Add new topic
    addTopic: (topicName) => set((state) => {
        const newQuestion = {
            _id: `temp-${Date.now()}`,
            topic: topicName,
            subTopic: 'General',
            title: 'New Question',
            questionId: {
                _id: `q-${Date.now()}`,
                name: 'New Question',
                difficulty: 'Easy',
                problemUrl: '',
            },
        };
        return { questions: [...state.questions, newQuestion] };
    }),

    // Add new subtopic under a topic
    addSubTopic: (topic, subTopicName) => set((state) => {
        const newQuestion = {
            _id: `temp-${Date.now()}`,
            topic,
            subTopic: subTopicName,
            title: 'New Question',
            questionId: {
                _id: `q-${Date.now()}`,
                name: 'New Question',
                difficulty: 'Easy',
                problemUrl: '',
            },
        };
        return { questions: [...state.questions, newQuestion] };
    }),

    // Add new question
    addQuestion: (topic, subTopic, questionData) => set((state) => {
        const newQuestion = {
            _id: `temp-${Date.now()}`,
            topic,
            subTopic: subTopic || 'General',
            title: questionData.title,
            questionId: {
                _id: `q-${Date.now()}`,
                name: questionData.name,
                difficulty: questionData.difficulty || 'Easy',
                problemUrl: questionData.problemUrl || '',
            },
        };
        return { questions: [...state.questions, newQuestion] };
    }),

    // Update question
    updateQuestion: (questionId, updates) => set((state) => ({
        questions: state.questions.map((q) =>
            q._id === questionId ? { ...q, ...updates } : q
        ),
    })),

    // Delete question
    deleteQuestion: (questionId) => set((state) => ({
        questions: state.questions.filter((q) => q._id !== questionId),
    })),

    // Reorder questions (for drag and drop)
    reorderQuestions: (newOrder) => set({ questions: newOrder }),

    // Set loading state
    setLoading: (loading) => set({ loading }),

    // Set error
    setError: (error) => set({ error }),
}));

export default useQuestionStore;
