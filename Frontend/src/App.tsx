import React, { useState, useEffect } from 'react';
import { ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookReview } from "@/types";
import ReviewCard from "@/components/reviewCard.tsx";
import ReviewForm from "@/components/reviewForm.tsx";

const BookReviewApp: React.FC = () => {
    const [reviews, setReviews] = useState<BookReview[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<BookReview[]>([]);
    const [selectedReview, setSelectedReview] = useState<BookReview | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // CRUD Operations
    const addReview = (newReview: BookReview) => {
        const reviewWithId = {...newReview, id: Date.now().toString()};
        setReviews([...reviews, reviewWithId]);
    };

    const updateReview = (updatedReview: BookReview) => {
        setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));
    };

    const deleteReview = (id: string) => {
        setReviews(reviews.filter(r => r.id !== id));
    };

    const onCloseModal = () => {
        setIsFormModalOpen(false);
    }

    const onEditReview = (review: BookReview) => {
        setSelectedReview(review);
        setIsFormModalOpen(true);
    }

    // Filtering and Sorting
    useEffect(() => {
        let result = [...reviews];

        // Search filter
        if (searchTerm) {
            result = result.filter(review =>
                review.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sorting
        result.sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1;
            if (sortBy === 'date') {
                return multiplier * (new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime());
            }
            return multiplier * (a.rating - b.rating);
        });

        setFilteredReviews(result);
    }, [reviews, searchTerm, sortBy, sortOrder]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Book Reviews</h1>

            {/* Toolbar */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-4 mb-4">
                <div className="md:w-1/2 w-full flex-grow relative">
                    <Input
                        placeholder="Search books or authors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>


                <div className="w-full sm:w-auto flex justify-between sm:justify-start sm:space-x-2">
                    <Select
                        value={sortBy}
                        onValueChange={(value: 'date' | 'rating') => setSortBy(value)}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Sort By"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Date Added</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="w-auto sm:w-[180px] ml-2 sm:ml-0"
                    >
                        <ArrowUpDown className="h-4 w-4 mr-2"/>
                        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </Button>
                </div>

                {/* Add Review */}
                <div className="w-full sm:w-auto">
                    <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    setSelectedReview(null);
                                    setIsFormModalOpen(true);
                                }}
                            >
                                Add Review
                            </Button>
                        </DialogTrigger>
                        <DialogContent onInteractOutside={(event) => event.preventDefault()}>
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedReview ? 'Edit Review' : 'Add New Review'}
                                </DialogTitle>
                            </DialogHeader>
                            <ReviewForm
                                onCloseModal={onCloseModal}
                                review={selectedReview || undefined}
                                onSubmit={selectedReview ? updateReview : addReview}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>


            {/* Reviews List */}
            <div>
                {filteredReviews.map(review => (
                    <ReviewCard onEdit={onEditReview} onDelete={deleteReview} key={review.id} review={review}/>
                ))}

                {filteredReviews.length === 0 && (
                    <p className="text-center text-gray-500">No reviews found</p>
                )}
            </div>
        </div>
    );
};

export default BookReviewApp;