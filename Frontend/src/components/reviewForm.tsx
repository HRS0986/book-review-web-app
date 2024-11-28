import React, { useState } from "react";
import { BookReview } from "@/types";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Check, X } from "lucide-react";
import StarRating from "@/components/starRating.tsx";
import { UserMessages } from "@/constants.ts";

const ReviewForm: React.FC<{
    review?: BookReview;
    onSubmit: (review: BookReview) => void;
    onCloseModal: () => void;
}> = ({ review, onSubmit, onCloseModal }) => {
    const [formData, setFormData] = useState<BookReview>({
        book_title: review?.book_title || '',
        author: review?.author || '',
        rating: review?.rating || 0,
        review: review?.review || '',
        date_added: review?.date_added || new Date()
    });

    const [errors, setErrors] = useState({
        book_title: '',
        author: '',
        rating: '',
        review: '',
    });

    const validate = () => {
        const newErrors: typeof errors = {
            book_title: '',
            author: '',
            rating: '',
            review: '',
        };

        if (!formData.book_title) {
            newErrors.book_title = UserMessages.TITLE_REQUIRED;
        }

        if (!formData.author) {
            newErrors.author = UserMessages.AUTHOR_REQUIRED;
        }

        if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
            newErrors.rating = UserMessages.RATING_REQUIRED;
        }

        if (!formData.review) {
            newErrors.review = UserMessages.REVIEW_REQUIRED;
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit({
            ...formData,
            id: review?.id,
        });
        onCloseModal();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    placeholder="Book Title"
                    value={formData.book_title}
                    onChange={(e) => setFormData({...formData, book_title: e.target.value})}
                />

                {errors.book_title && <p className="text-red-500 text-sm">{errors.book_title}</p>}
            </div>

            <div>
                <Input
                    placeholder="Author"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                />
                {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium">Rating</label>
                <StarRating
                    value={formData.rating}
                    onChange={(rating) => setFormData({...formData, rating})}
                    error={errors.rating}
                />
            </div>

            <div>
                <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Your Review"
                    value={formData.review}
                    rows={5}
                    onChange={(e) => setFormData({...formData, review: e.target.value})}
                />
                {errors.review && <p className="text-red-500 text-sm">{errors.review}</p>}
            </div>

            <div className="w-full gap-2 flex justify-end">
                <Button type="button" variant="outline" onClick={onCloseModal}>
                    <X className="h-4 w-4"></X>
                    Cancel
                </Button>
                <Button type="submit">
                    <Check className="h-4 w-4"></Check>
                    Save Review
                </Button>
            </div>
        </form>
    );
};

export default ReviewForm;
