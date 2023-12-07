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

    const handleDownload = async (imageUrl) => {
        const image = await fetch(imageUrl);

        const nameSplit = imageUrl.split("/");
        const duplicateName = nameSplit.pop();

        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)
        const link = document.createElement('a')
        link.href = imageURL;
        link.download = "" + duplicateName + "";
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the API
                const apiUrl = `http://172.17.15.253:8080/getcheckpoints/${Empid}`;

                const response = await axios.get(apiUrl);
                const data = response.data;
                console.log(data, "data");
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
                            {ratings && ratings.length > 0 ? (
                                ratings
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
                                                        <DownloadIcon onClick={() => handleDownload(data.imageUrl)}></DownloadIcon>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </div>
            </div>
            <Modal open={previewModalOpen} onClose={handlePreviewModalClose}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Card style={{ display: 'flex', flexDirection: 'column', backgroundColor:'#e9ecef' }}>
                        <Button style={{ textAlign: 'left', fontSize:'26px', justifyContent:'end', color:'black' }} onClick={handlePreviewModalClose}>X</Button>
                            <CardContent>
                                <img src={previewImageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            </CardContent>
                        </Card>
                    </div>
                </Modal>
        </div>
    );
}
