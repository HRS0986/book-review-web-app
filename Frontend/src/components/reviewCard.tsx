import { BookReview } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Edit, Star, Trash, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";

const ReviewCard: React.FC<{
    review: BookReview,
    onDelete: (id: string) => void,
    onEdit: (review: BookReview) => void
}> = ({review, onDelete, onEdit}) => {

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleDelete = () => {
        onDelete(review.id!);
        setIsConfirmModalOpen(false);
    };

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
                    <p>{review.review}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Added on: {new Date(review.date_added).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-5 w-1/6 justify-end items-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(review)}
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
        </Card>
    );
};

export default ReviewCard;