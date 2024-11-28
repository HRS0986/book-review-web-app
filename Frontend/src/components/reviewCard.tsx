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
import { UserMessages } from "@/constants.ts";
import { toast } from "@/hooks/use-toast.ts";
import { cn } from "@/lib/utils.ts";

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
        }).catch(_ => {
            toast({
                title: "Error",
                description: UserMessages.ERROR_FETCHING_REVIEW,
                className: cn(
                    'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-red-700'
                ),
            })
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
                <DialogContent className="w-[95%] max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">{UserMessages.CONFIRM_DELETE_REVIEW}</p>
                    <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmModalOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            <X className="mr-2 h-4 w-4"/>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="w-full sm:w-auto"
                        >
                            <Trash className="mr-2 h-4 w-4"/>
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