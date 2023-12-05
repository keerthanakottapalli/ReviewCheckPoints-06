import React, { useState, useEffect } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody, Tab,
    Tabs, Button, Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import {

    Card,
    CardContent,
    Modal,
    IconButton,
    CloseIcon
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

export default function EmployeeReviews() {
    const navigate = useNavigate();

    const [ratings, setRatings] = useState([]);
    const [employeeName, setEmployeeName] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const { Empid } = useParams();

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const tabLabels = [...new Set(ratings.map((data) => data.Value))];

    const handleClose = () => {
        navigate('/EmployeeMainView');
    };


    const handlePreview = (imageUrl) => {
        setPreviewImageUrl(imageUrl);
        setPreviewModalOpen(true);
    };

    const handlePreviewModalClose = () => {
        setPreviewModalOpen(false);
        setPreviewImageUrl('');
    };

    const downloadImage = (imageUrl, filename) => {
        saveAs(imageUrl, filename);
      };
  

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the API
                const apiUrl = `http://172.17.15.253:8080/getcheckpoints/${Empid}`;

                const response = await axios.get(apiUrl);
                const data = response.data;
                setRatings(data.employee.ratings);
                setEmployeeName(data.employee.Empname);

            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [Empid]);

    const Empname = employeeName;

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar className="navBar-style">
                    <div className="userInfo">
                        <Typography variant="h6" className="welcome-text">
                            Welcome
                        </Typography>
                        <h3 className="username-style">{Empname}</h3>
                    </div>
                    <Button color="inherit" onClick={handleClose} className='buttonwrapper'>
                        <span className='gobackeform'>
                            &#8629;
                        </span>
                        <b>GoBack</b>
                    </Button>
                </Toolbar>
            </AppBar>
            <br /><br /><br /><br />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '80%', margin: '0 auto' }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    {tabLabels.map((label, index) => (
                        <Tab label={label} key={index} style={{ fontWeight: 'bold', fontSize: '18px' }} />
                    ))}
                </Tabs>
            </div>
            <div style={{ maxWidth: '80%', margin: '0 auto', backgroundColor: '#f5f5f5' }}>
                <div style={{ height: '500px', overflowY: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontSize: '18px' }}><b>Review Point</b></TableCell>
                                <TableCell style={{ fontSize: '18px' }}><b>Self-Review</b></TableCell>
                                <TableCell style={{ fontSize: '18px' }}><b>Upload</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ratings
                                .filter((data) => data.Value === tabLabels[selectedTab])
                                .map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{data.Review_Points}</TableCell>
                                        <TableCell>
                                            {data.Self_Review === "1" ? (
                                                <button className="yes-button">Yes</button>
                                            ) : (
                                                <button className="no-button">No</button>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {data.imageUrl && (
                                                <>
                                                    <PreviewIcon onClick={() => handlePreview(data.imageUrl)}></PreviewIcon>
                                                    <DownloadIcon onClick={() => downloadImage(data.imageUrl, 'custom_filename.jpg')}></DownloadIcon>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Modal open={previewModalOpen} onClose={handlePreviewModalClose}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Card>
                        <CardContent>
                            <img src={previewImageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </CardContent>
                    </Card>
                </div>
            </Modal>
        </div>
    );
}
