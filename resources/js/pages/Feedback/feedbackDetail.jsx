
import api from '../../axios';
import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import AppLayout from '../../layouts/AppLayout';
import ProtectedRoute from '../../components/protectedRoute';

const FeedbackDetail = ({ feedback: initialFeedback, id }) => {
    const [feedback, setFeedback] = useState(initialFeedback);
    const [loading, setLoading] = useState(!initialFeedback);
    const [error, setError] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [commentErrors, setCommentErrors] = useState({});
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const { auth } = usePage().props;
    const logedinUserName = auth?.user?.name;

    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentionList, setShowMentionList] = useState(false);
    const [mentionPosition, setMentionPosition] = useState(0);
    const [users, setUsers] = useState([]);
    const [selectedUserIndex, setSelectedUserIndex] = useState(0);

    const MentionRenderer = ({ children }) => {
    return <strong>{children}</strong>;
};

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

        if (!initialFeedback) {
            const fetchFeedback = async () => {
                try {
                    const response = await api.get(`/feedbacks/${id}`);

                    setFeedback(response.data);
                    setLoading(false);
                } catch (error) {
                    setError('Error fetching feedback');
                    setLoading(false);
                    console.error('Error fetching feedback:', error);
                }
            };
            fetchFeedback();
        }
    }, []);

    const handleCommentChange = (e) => {
        const value = e.target.value;
        setCommentContent(value);

        // Detect @ mention
        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPosition);
        const atSymbolIndex = textBeforeCursor.lastIndexOf('@');

        if (atSymbolIndex >= 0) {
            const query = textBeforeCursor.substring(atSymbolIndex + 1);
            setMentionQuery(query);
            setMentionPosition(atSymbolIndex);
            setShowMentionList(true);
            setSelectedUserIndex(0);
        } else {
            setShowMentionList(false);
        }
    };

    const handleUserSelect = (user) => {
        const beforeMention = commentContent.substring(0, mentionPosition);
        const afterMention = commentContent.substring(mentionPosition + mentionQuery.length + 1);

        // Insert the mention with bold markdown
        setCommentContent(`${beforeMention}**@${user.name}** ${afterMention}`);
        setShowMentionList(false);
        setMentionQuery('');
    };

    const handleKeyDown = (e) => {
        if (!showMentionList) return;

        // Arrow down
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedUserIndex(prev =>
                prev < filteredUsers.length - 1 ? prev + 1 : prev
            );
        }
        // Arrow up
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedUserIndex(prev => (prev > 0 ? prev - 1 : 0));
        }
        // Enter
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredUsers[selectedUserIndex]) {
                handleUserSelect(filteredUsers[selectedUserIndex]);
            }
        }
        // Escape
        else if (e.key === 'Escape') {
            e.preventDefault();
            setShowMentionList(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase()) &&
        user.name !== logedinUserName // Exclude current user
    );

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingComment(true);
        setCommentErrors({});

        try {
            const response = await api.post(`/feedbacks/${feedback.id}/comments`, {
                content: commentContent
            });

            setFeedback(prev => ({
                ...prev,
                comments: [
                    ...prev.comments,
                    {
                        ...response.data,
                        user: auth.user
                    }
                ]
            }));

            setCommentContent('');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setCommentErrors(error.response.data.errors || {});
            } else {
                console.error('Error submitting comment:', error);
                setCommentErrors({ general: ['Failed to submit comment. Please try again.'] });
            }
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <ProtectedRoute>
                <AppLayout auth={auth}>
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </AppLayout>
            </ProtectedRoute>
        );
    }

    return (

        <ProtectedRoute>
            <AppLayout auth={auth}>

                <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                    <Head title={feedback.title} />

                    <div className="max-w-3xl mx-auto">
                        <div className="mb-6">
                            <button
                                onClick={() => router.visit('/feedback')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to Feedback
                            </button>
                        </div>



                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex items-center justify-between flex-wrap">
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                        {feedback.title}
                                    </h1>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${feedback.category.name === 'Bug Report' ? 'bg-red-100 text-red-800' : feedback.category.name === 'Feature Request' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {feedback.category.name}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                    </svg>
                                    <span className="mr-4">Posted by {feedback.user.name}</span>
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    <span>
                                        {new Date(feedback.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="prose max-w-none">
                                        <ReactMarkdown>{feedback.description}</ReactMarkdown>


                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Comments ({feedback.comments.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {feedback.comments.length === 0 ? (
                                    <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                                        No comments yet. Be the first to share your thoughts!
                                    </div>
                                ) : (
                                    feedback.comments.map(comment => (
                                        <div key={comment.id} className="px-4 py-5 sm:px-6">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                                                        {/* <span className="text-indigo-600 font-medium">
                                                    {comment.user.name.charAt(0).toUpperCase()}
                                                </span> */}

                                                        <span className="text-indigo-600 font-medium">
                                                            {comment.user && comment.user.name
                                                                ? comment.user.name.charAt(0).toUpperCase()
                                                                : "?"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="flex items-center justify-between">


                                                        <p className="text-sm font-medium text-gray-900">
                                                            {comment.user && comment.user.name ? comment.user.name : "Unknown"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-700">
                                                        <div className="prose prose-sm max-w-none">
                                                            {/* <ReactMarkdown>{comment.content}</ReactMarkdown> */}
                                                            <ReactMarkdown
                                                                components={{
                                                                    strong: MentionRenderer
                                                                }}
                                                            >
                                                                {comment.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Comment Form */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Add a Comment
                                </h3>
                            </div>
                            <div className="px-4 py-5 sm:p-6">
                                {commentErrors.general && (
                                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">
                                                    {commentErrors.general[0]}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <form onSubmit={handleCommentSubmit}>
                                    <div>
                                        <label htmlFor="comment" className="sr-only">Comment</label>
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            rows={5}
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${commentErrors.content ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                                            placeholder="Share your thoughts..."
                                            value={commentContent}
                                            onChange={handleCommentChange}
                                            onKeyDown={handleKeyDown}
                                        />

                                        {showMentionList && filteredUsers.length > 0 && (
                                            <div className="absolute z-10 mt-1 w-64 bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {filteredUsers.map((user, index) => (
                                                    <div
                                                        key={user.id}
                                                        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${index === selectedUserIndex ? 'bg-indigo-100' : ''}`}
                                                        onClick={() => handleUserSelect(user)}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-200 flex items-center justify-center">
                                                                <span className="text-indigo-700 text-xs font-medium">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="ml-3">
                                                                <span className="font-medium text-gray-900 block truncate">
                                                                    {user.name}
                                                                </span>
                                                                <span className="text-gray-500 text-xs block truncate">
                                                                    {user.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {commentErrors.content && (
                                            <p className="mt-2 text-sm text-red-600">{commentErrors.content[0]}</p>
                                        )}
                                        <div className="mt-2 text-sm text-gray-500">
                                            Supports <a href="https://commonmark.org/help/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">Markdown</a> formatting
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingComment || !commentContent.trim()}
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmittingComment || !commentContent.trim() ? 'opacity-75 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmittingComment ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Posting...
                                                </>
                                            ) : 'Post Comment'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>

            </AppLayout>
        </ProtectedRoute>
    );
};

export default FeedbackDetail;