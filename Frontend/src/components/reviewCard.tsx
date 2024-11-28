import { BookReview } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Edit, Eye, Star, Trash, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import { getReview } from "@/services/reviewService.ts";

const ReviewCard: React.FC<{
    review: BookReview,
    onDelete: (id: string) => void,
    onEdit: (review: BookReview) => void
}> = ({review, onDelete, onEdit}) => {

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<BookReview | null>(review);

    const handleDelete = () => {
        onDelete(review.id!);
        setIsConfirmModalOpen(false);
    };

    const handleEdit = () => {
        getReview(+review.id!).then((data) => {
            console.log(data)
            onEdit(data);
        })
    }

    const handleView = () => {
        getReview(+review.id!).then((data) => {
            setSelectedReview(data);
            setIsViewModalOpen(true);
        })
    }

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row justify-between items-start">
                <div className="flex flex-col">
                    <CardTitle className="text-2xl">{review.book_title}</CardTitle>
                    <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500">by {review.author}</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className='flex items-center'>
                        <span>
                            Rating: &nbsp;
                        </span>
                        <span className="mr-2 flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current"/>
                          ))}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex">
                <div className="w-5/6">
                    <p>
                        {review.review.length > 150 ? review.review.substring(0, 150) + '...' : review.review}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Added on: {new Date(review.date_added).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-5 w-1/6 justify-end items-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleView}
                    >
                        <Eye className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEdit}
                    >
                        <Edit className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsConfirmModalOpen(true)}
                    >
                        <Trash2 className="h-4 w-4 text-red-500"/>
                    </Button>
                </div>
            </CardContent>
            <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this review?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
                            <X className="h-4 w-4"></X>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash className="h-4 w-4"></Trash>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedReview!.book_title}</DialogTitle>
                        <DialogDescription>
                            {selectedReview!.author}
                        </DialogDescription>
                    </DialogHeader>
                    <span className="mr-2 flex items-center">
                          {[...Array(selectedReview!.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current"/>
                          ))}
                    </span>
                    <p>
                        {selectedReview!.review}
                    </p>
                    <DialogFooter>
                        {selectedReview?.date_added && (
                            <p className="text-sm text-gray-500 mt-2">
                                Added on: {new Date(selectedReview!.date_added).toLocaleDateString()}
                            </p>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </Card>
    );
};

export default ReviewCard;