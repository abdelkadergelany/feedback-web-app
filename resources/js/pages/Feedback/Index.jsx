import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const Index = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get(`/api/feedbacks?page=${currentPage + 1}`);
                setFeedbacks(response.data.data);
                setPageCount(response.data.last_page);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [currentPage]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Feedback</h2>
                <Link to="/feedback/create" className="btn btn-primary">Add Feedback</Link>
            </div>
            
            <div className="list-group">
                {feedbacks.map(feedback => (
                    <Link 
                        key={feedback.id} 
                        to={`/feedback/${feedback.id}`}
                        className="list-group-item list-group-item-action"
                    >
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{feedback.title}</h5>
                            <small className="text-muted">{feedback.category.name}</small>
                        </div>
                        <p className="mb-1">{feedback.description.substring(0, 100)}...</p>
                        <small className="text-muted">Submitted by {feedback.user.name}</small>
                    </Link>
                ))}
            </div>

            {pageCount > 1 && (
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination justify-content-center mt-4'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    activeClassName={'active'}
                />
            )}
        </div>
    );
};

export default Index;