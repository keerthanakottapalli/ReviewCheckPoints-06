import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, FormControlLabel, TextField, Button } from '@mui/material';
import axios from 'axios';

const EmployeeReviewPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [tabData, setTabData] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const apiUrl = 'http://172.17.15.253:8080/getcheckpoints';

    axios.get(apiUrl)
      .then((response) => {
        console.log('API Response:', response.data); 
        setFormData({ ...response.data });
        setTabData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCheckboxChange = (category, index, fieldName) => {
    // Create a copy of the current form data
    const updatedFormData = { ...formData };
    
    // Toggle the value of the checkbox
    updatedFormData[category][fieldName][index] = !updatedFormData[category][fieldName][index];
    
    // Update the form data state
    setFormData(updatedFormData);
  };

  const handleCommentChange = (category, index, value) => {
    // Create a copy of the current form data
    const updatedFormData = { ...formData };
    
    // Update the comment value
    updatedFormData[category]['comments'][index] = value;
    
    // Update the form data state
    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiUrl = 'http://172.17.15.253:8080/insertOrUpdateData';

    axios.post(apiUrl, formData)
      .then((response) => {
        console.log('Data sent successfully', response);
      })
      .catch((error) => {
        console.error('Error sending data', error);
      });
  };

  const generateTableRows = () => {
    const category = Object.keys(tabData)[tabValue];
    
    if (category) {
  return formData[category]['Review Points'].map((point, index) => (
    <TableRow key={index}>
      <TableCell>{point}</TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Checkbox
              name="selfReview"
              checked={formData[category]['Self-Review'][index] || false}
              onChange={() => handleCheckboxChange(category, index, 'Self-Review')}
            />
          }
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Checkbox
              name="reviewer"
              checked={formData[category]['Reviewver'][index] || false}
              onChange={() => handleCheckboxChange(category, index, 'Reviewver')}
            />
          }
        />
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          multiline
          rows={4}
          name="comments"
          value={formData[category]['comments'][index] || ''}
          onChange={(e) => handleCommentChange(category, index, e.target.value)}
        />
      </TableCell>
    </TableRow>
  ));
} else {
  return null;
}

  };

  return (
    <div>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {Object.keys(tabData).map((tab, index) => (
          <Tab key={index} label={tab} />
        ))}
      </Tabs>
      {Object.keys(tabData).length > 0 && (
        <form onSubmit={handleSubmit}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Review Points</TableCell>
                <TableCell>Self-Review</TableCell>
                <TableCell>Reviewer</TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generateTableRows()}
            </TableBody>
          </Table>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      )}
    </div>
  );
};

export default EmployeeReviewPage;
