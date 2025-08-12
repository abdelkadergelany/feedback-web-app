import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { Pagination } from '@/Components/Pagination'; // Assuming you have a Pagination component
import { Feedback } from '@/types'; // Define your types

interface Feedback {
    id: number;
    title: string;
    description: string;
    category: {
        name: string;
    };
    user: {
        name: string;
    };
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
}

export default function FeedbackIndex() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await router.get(`/feedbacks`, {
                    page: currentPage + 1
                }, {
                    preserveState: true,
                    replace: false,
                    only: ['feedbacks']
                });

                const data = response.props.feedbacks as PaginatedResponse<Feedback>;
                setFeedbacks(data.data);
                setPageCount(data.last_page);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [currentPage]);

    const handlePageClick = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Product Feedback</h2>
                <Link 
                    href={route('feedbacks.create')} 
                    className="btn btn-primary"
                >
                    Add Feedback
                </Link>
            </div>
            
            <div className="space-y-4">
                {feedbacks.map((feedback) => (
                    <Link 
                        key={feedback.id}
                        href={route('feedbacks.show', feedback.id)}
                        className="block p-4 border rounded hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">{feedback.title}</h3>
                            <span className="text-sm text-gray-500">{feedback.category.name}</span>
                        </div>
                        <p className="mt-2 text-gray-600">
                            {feedback.description.substring(0, 100)}...
                        </p>
                        <div className="mt-2 text-sm text-gray-400">
                            Submitted by {feedback.user.name}
                        </div>
                    </Link>
                ))}
            </div>

            {pageCount > 1 && (
                <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    className="mt-6"
                />
            )}
        </div>
    );
}