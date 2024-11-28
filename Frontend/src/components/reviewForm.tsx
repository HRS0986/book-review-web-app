import React, { useState } from "react";
import { BookReview } from "@/types";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";

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
        date_added: review?.addedDate || new Date()
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
            newErrors.book_title = 'Book title is required.';
        }

        if (!formData.author) {
            newErrors.author = 'Author name is required.';
        }

        if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
            newErrors.rating = 'Please provide a rating between 1 and 5.';
        }

        if (!formData.review) {
            newErrors.review = 'Review cannot be empty.';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return; // Exit if validation fails
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
                    onChange={(e) => setFormData({ ...formData, book_title: e.target.value })}
                />

                {errors.book_title && <p className="text-red-500 text-sm">{errors.book_title}</p>}
            </div>

            <div>
                <Input
                    placeholder="Author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
                {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
            </div>

            <div>
                <Select
                    value={formData.rating.toString()}
                    onValueChange={(value: string) => setFormData({ ...formData, rating: parseInt(value) })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                                {rating} Star{rating !== 1 ? 's' : ''}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
            </div>

            <div>
                <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Your Review"
                    value={formData.review}
                    rows={5}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                />
                {errors.review && <p className="text-red-500 text-sm">{errors.review}</p>}
            </div>

            <div className="w-full gap-2 flex justify-end">
                <Button type="button" variant="outline" onClick={onCloseModal}>
                    Cancel
                </Button>
                <Button type="submit">Save Review</Button>
            </div>
        </form>
    );
};

export default ReviewForm;
