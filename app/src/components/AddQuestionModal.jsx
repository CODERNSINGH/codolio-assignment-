import { useState } from 'react';
import Modal from './Modal';
import useQuestionStore from '../store/questionStore';

function AddQuestionModal({ isOpen, onClose, topic, subTopic }) {
    const addQuestion = useQuestionStore((state) => state.addQuestion);

    const [formData, setFormData] = useState({
        title: '',
        name: '',
        difficulty: 'Easy',
        problemUrl: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addQuestion(topic, subTopic, formData);
        setFormData({ title: '', name: '', difficulty: 'Easy', problemUrl: '' });
        onClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Question">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Question Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Two Sum"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Question Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Two Sum Problem"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Difficulty
                    </label>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Problem URL
                    </label>
                    <input
                        type="url"
                        name="problemUrl"
                        value={formData.problemUrl}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="https://leetcode.com/problems/..."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                    >
                        Add Question
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default AddQuestionModal;
