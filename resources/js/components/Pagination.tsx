import { Link } from '@inertiajs/react';

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    onPageChange: (selectedItem: { selected: number }) => void;
    className?: string;
}

export function Pagination({ 
    currentPage, 
    pageCount, 
    onPageChange,
    className = ''
}: PaginationProps) {
    return (
        <div className={`flex justify-center ${className}`}>
            <nav className="flex space-x-1">
                {Array.from({ length: pageCount }).map((_, index) => (
                    <Link
                        key={index}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange({ selected: index });
                        }}
                        className={`px-3 py-1 rounded ${
                            currentPage === index 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        {index + 1}
                    </Link>
                ))}
            </nav>
        </div>
    );
}