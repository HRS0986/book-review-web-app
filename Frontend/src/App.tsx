import React, { useState, useEffect } from 'react';
import { ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookReview } from "@/types";
import ReviewCard from "@/components/reviewCard.tsx";
import ReviewForm from "@/components/reviewForm.tsx";
import { addReview, getReviews } from "@/services/reviewService.ts";

const BookReviewApp: React.FC = () => {
    const [reviews, setReviews] = useState<BookReview[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<BookReview[]>([]);
    const [selectedReview, setSelectedReview] = useState<BookReview | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // CRUD Operations
    const onAddReview = (newReview: BookReview) => {
        addReview(newReview).then((_) => {

        })
    };

    const updateReview = (updatedReview: BookReview) => {

    };

    const deleteReview = (id: string) => {

    };

    const onCloseModal = () => {
        setIsFormModalOpen(false);
    }

    const onEditReview = (review: BookReview) => {
        setSelectedReview(review);
        setIsFormModalOpen(true);
    }

    useEffect(() => {
        getReviews().then((data) => {
            setReviews(data);
        })
    }, [reviews]);

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
        <div className="container mx-auto p-4 px-60 pt-10">
            <h1 className="text-8xl font-bold mb-6 mx-auto w-fit pb-5">REVIEWS HUB</h1>

            {/* Toolbar */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-4 mb-4 bg-gray-100 rounded-md p-5">
                <div className="md:w-1/2 w-full flex-grow relative">
                    <Input
                        placeholder="Search books or authors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 bg-white"
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
                        <SelectTrigger className="w-full sm:w-[180px] bg-white">
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
                                onSubmit={selectedReview ? updateReview : onAddReview}
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