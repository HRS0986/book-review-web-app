import React from "react";

const StarRating: React.FC<{
    value: number;
    onChange: (rating: number) => void;
    error?: string;
}> = ({ value, onChange, error }) => {
    return (
        <div>
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <svg
                        key={rating}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 cursor-pointer ${
                            rating <= value
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                        }`}
                        viewBox="0 0 24 24"
                        fill={rating <= value ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        onClick={() => onChange(rating)}
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default StarRating;