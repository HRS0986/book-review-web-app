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
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils.ts";


const BookReviewApp: React.FC = () => {
    const [reviews, setReviews] = useState<BookReview[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<BookReview[]>([]);
    const [selectedReview, setSelectedReview] = useState<BookReview | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isLoading, setIsLoading] = useState(true);

    const onAddReview = (newReview: BookReview) => {
        addReview(newReview).then((_) => {
            toast({
                title: "Success",
                description: UserMessages.REVIEW_ADDED,
                className: cn(
                    'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-green-700'
                ),
            })
            getReviews().then((data) => {
                setReviews(data);
            })
        }).catch(_ => {
            toast({
                title: "Failed",
                description: UserMessages.ERROR_ADDING_REVIEW,
                className: cn(
                    'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-red-700'
                ),
            })
        });
    };

    const onUpdateReview = (updatedReview: BookReview) => {
        updateReview(updatedReview).then((_) => {
            toast({
                title: "Success",
                description: UserMessages.REVIEW_UPDATED,
                className: cn(
                    'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-green-700'
                ),
            })
            getReviews().then((data) => {
                setReviews(data);
            })
        }).catch(_ => {
            toast({
                title: "Failed",
                description: UserMessages.ERROR_UPDATING_REVIEW,
                className: cn(
                    'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-red-700'
                ),
            })
        });
    };

    const onDeleteReview = (id: string) => {
        deleteReview(+id).then((_) => {
            toast({
                title: "Success",
                description: UserMessages.REVIEW_DELETED,
                className: cn(
                    'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-green-700'
                ),
            })
            getReviews().then((data) => {
                setReviews(data);
            })
        }).catch(_ => {
            toast({
                title: "Failed",
                description: UserMessages.ERROR_DELETING_REVIEW,
                className: cn(
                    'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-red-700'
                ),
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
            setIsLoading(false);
        }).catch(_ => {
            toast({
                title: "Error",
                description: UserMessages.ERROR_FETCHING_REVIEWS,
                className: cn(
                    'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-red-700'
                ),
            })
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
                            <div
                                className="w-full md:w-auto flex flex-col sm:flex-row gap-2 justify-between items-center">
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
                                            <NotebookPen className="h-3 w-3 mr-2"/>
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

                    {filteredReviews.length === 0 && !isLoading && (
                        <p className="text-center text-gray-500 text-lg">
                            {UserMessages.NO_REVIEWS}
                        </p>
                    )}

                    {filteredReviews.length === 0 && isLoading && (
                        <div role="status" className="w-full flex justify-center">
                            <svg aria-hidden="true"
                                 className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookReviewApp;