import { BookReview } from "@/types";
import axios from 'axios';


/* axios instance with base URL */
const api = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const addReview = async (newReview: BookReview) => {
    try {
        const response = await api.post('/reviews', newReview);
        return response.data;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};

export const getReviews = async () => {
    try {
        const response = await api.get('/reviews');
        const reviews = [];
        for (const review of response.data) {
            console.log(review.date_added)
            reviews.push({
                ...review,
                date_added: new Date(review.date_added),
            })
        }
        console.log(reviews)
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

export const getReview = async (id: number) => {
    try {
        const response = await api.get(`/reviews/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching review with id ${id}:`, error);
        throw error;
    }
};

export const updateReview = async (updatedReview: BookReview) => {
    try {
        const response = await api.put(`/reviews/${updatedReview.id}`, updatedReview);
        return response.data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

export const deleteReview = async (id: number) => {
    try {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting review with id ${id}:`, error);
        throw error;
    }
};