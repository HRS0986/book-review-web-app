import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface ToolbarProps {
    filters: { searchTerm: string; sortBy: string; sortOrder: string };
    onFiltersChange: (filters: any) => void;
    onAddReview: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ filters, onFiltersChange, onAddReview }) => {
    const { searchTerm, sortBy, sortOrder } = filters;

    return (
        <div className="flex mb-4 space-x-2">
            <Input
                placeholder="Search books or authors"
                value={searchTerm}
                onChange={e => onFiltersChange({ ...filters, searchTerm: e.target.value })}
                className="flex-grow"
            />

            <Select
                value={sortBy}
                onValueChange={(value: string) => onFiltersChange({ ...filters, sortBy: value })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date">Date Added</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
            </Select>

            <Button
                variant="outline"
                onClick={() =>
                    onFiltersChange({ ...filters, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })
                }
            >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>

            <Button onClick={onAddReview}>Add Review</Button>


        </div>
    );
};
