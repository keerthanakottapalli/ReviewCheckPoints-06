import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import axios from 'axios';
import { BASE_URLCHECK } from './config';


export default function AdminData() {
    const [tabValue, setTabValue] = useState(0);
    const [tabData, setTabData] = useState({});
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const apiUrl = `${BASE_URLCHECK}/admin/emp_checkreviewpoint_data`;
    
        axios.get(apiUrl)
          .then((response) => {
            console.log('API Response:', response.data); // Log the API response for debugging
    
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

    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        const apiUrl = `${BASE_URLCHECK}/admin/emp_checkreviewpoint_insrt`;
    
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
          
