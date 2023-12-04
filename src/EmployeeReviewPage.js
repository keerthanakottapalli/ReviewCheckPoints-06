import React, { useState } from 'react';
import { TextField, Button, FormControlLabel, Checkbox, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import './EmployeeReviewPage.css';

export default function EmployeeReviewPage() {
    const [formData, setFormData] = useState({
        reviewPoints: '',
        selfReview: false,
        reviewer: false,
        comments: '',
    });

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: e.target.type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Table className="review-table">
                <TableHead>
                    <TableRow>
                        <TableCell>Review Points</TableCell>
                        <TableCell>Self-Review</TableCell>
                        <TableCell>Comments</TableCell>
                        <TableCell>Reviewer</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <TextField
                                fullWidth
                                name="reviewPoints"
                                value={formData.reviewPoints}
                                onChange={handleChange}
                            />
                        </TableCell>
                        <TableCell>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="selfReview"
                                        checked={formData.selfReview}
                                        onChange={handleChange}
                                    />
                                }
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                fullWidth
                                name="comments"
                                multiline
                                rows={4}
                                value={formData.comments}
                                onChange={handleChange}
                            />
                        </TableCell>
                        <TableCell>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="reviewer"
                                        checked={formData.reviewer}
                                        onChange={handleChange}
                                    />
                                }
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </form>
    );
}
