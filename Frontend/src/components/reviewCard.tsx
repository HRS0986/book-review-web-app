import { BookReview } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Edit, Star, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";

const ReviewCard: React.FC<{ review: BookReview, onDelete: (id: string) => void, onEdit: (review: BookReview) => void}> = ({ review, onDelete, onEdit }) => {

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleDelete = () => {
        onDelete(review.id!);
        setIsConfirmModalOpen(false);
    };

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{review.book_title}</CardTitle>
                <div className="flex space-x-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(review)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Review</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsConfirmModalOpen(true)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Review</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center mb-2">
            <span className="mr-2 flex items-center">
              {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
              ))}
            </span>
                    <span className="text-sm text-gray-500">by {review.author}</span>
                </div>
                <p>{review.review}</p>
                <p className="text-sm text-gray-500 mt-2">
                    Added on: {new Date(review.addedDate).toLocaleDateString()}
                </p>
            </CardContent>
            <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this review?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default ReviewCard;