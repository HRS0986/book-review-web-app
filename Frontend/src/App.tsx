import React, { useEffect, useState } from 'react';
import { ArrowUpDown, NotebookPen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookReview } from "@/types";
import ReviewCard from "@/components/reviewCard.tsx";
import ReviewForm from "@/components/reviewForm.tsx";
import { addReview, deleteReview, getReviews, updateReview } from "@/services/reviewService.ts";
import { UserMessages } from "@/constants.ts";

const BookReviewApp: React.FC = () => {
    const [reviews, setReviews] = useState<BookReview[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<BookReview[]>([]);
    const [selectedReview, setSelectedReview] = useState<BookReview | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const onAddReview = (newReview: BookReview) => {
        addReview(newReview).then((_) => {
            getReviews().then((data) => {
                setReviews(data);
            })
        });
    };

    const onUpdateReview = (updatedReview: BookReview) => {
        updateReview(updatedReview).then((_) => {
            getReviews().then((data) => {
                setReviews(data);
            })
        });
    };

    const onDeleteReview = (id: string) => {
        deleteReview(+id).then((_) => {
            getReviews().then((data) => {
                setReviews(data);
            })
        });
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
    }, []);

    // Filtering and Sorting
    useEffect(() => {
        let result = [...reviews];

        if (searchTerm) {
            result = result.filter(review =>
                review.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        result.sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1;
            if (sortBy === 'date') {
                return multiplier * (new Date(a.date_added).getTime() - new Date(b.date_added).getTime());
            }
            return multiplier * (a.rating - b.rating);
        });

        setFilteredReviews(result);
    }, [reviews, searchTerm, sortBy, sortOrder]);

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32">
                <div className="header-toolbar sticky top-0 z-50 bg-white backdrop-blur-md rounded-md mb-5">
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 text-center">
                        {UserMessages.APP_TITLE}
                    </h1>

                    {/* Toolbar */}
                    <div className="bg-gray-100 rounded-b-md p-4 md:p-5 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="w-full md:flex-grow relative">
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
                                        <X className="w-4 h-4"/>
                                    </button>
                                )}
                            </div>

                            {/* Sorting and Add Review Controls */}
                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 justify-between items-center">
                                <div className="flex gap-2 w-full">
                                    <Select
                                        value={sortBy}
                                        onValueChange={(value: 'date' | 'rating') => setSortBy(value)}
                                    >
                                        <SelectTrigger className="w-full sm:w-[150px] bg-white">
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
                                        className="w-auto sm:w-[150px]"
                                    >
                                        <ArrowUpDown className="h-4 w-4 mr-2"/>
                                        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                    </Button>
                                </div>

                                {/* Add Review Popup*/}
                                <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="w-full sm:w-auto mt-2 sm:mt-0"
                                            onClick={() => {
                                                setSelectedReview(null);
                                                setIsFormModalOpen(true);
                                            }}
                                        >
                                            <NotebookPen className="h-3 w-3 mr-2" />
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
                                            onSubmit={selectedReview ? onUpdateReview : onAddReview}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {filteredReviews.map(review => (
                        <ReviewCard
                            onEdit={onEditReview}
                            onDelete={onDeleteReview}
                            key={review.id}
                            review={review}
                        />
                    ))}

                    {filteredReviews.length === 0 && (
                        <p className="text-center text-gray-500 text-lg">
                            No reviews found
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookReviewApp;