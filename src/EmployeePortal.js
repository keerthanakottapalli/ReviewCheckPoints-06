import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
    TextField,
    Input,
    Tab,
    Tabs,
    Button,
    CircularProgress
} from '@mui/material';
import {
    AppBar, Toolbar, Typography
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import axios from 'axios';
import './EmployeePortal.css'
import { Link, useNavigate } from 'react-router-dom';

export default function EmployeePortal() {
    const navigate = useNavigate();


    // Initialize Firebase with your configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDD6YZm2vcDGYrPoMJGN6WPWTluyzKahSk",
        authDomain: "clouddemo-2e42b.firebaseapp.com",
        projectId: "clouddemo-2e42b",
        storageBucket: "clouddemo-2e42b.appspot.com",
        messagingSenderId: "644022241974",
        appId: "1:644022241974:web:7ed1bf6cf3ca496763b417",
        measurementId: "G-25998DYZT5"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const storage = firebase.storage();

    const [adminData, setAdminData] = useState({});
    const [employeeData, setEmployeeData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [tabData, setTabData] = useState([]);
    const [rowFiles, setRowFiles] = useState(Array(100).fill(null));
    const [rowIndex, setRowIndex] = useState();
    const [selectedImageFile, setSelectedImageFile] = useState()
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setOpenDialog(false);
        navigate('/EmployeeMainView');
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const tabLabels = [...new Set(employeeData.map((data) => data.Value))];
    

    useEffect(() => {
        // Fetch admin data
        const adminApiUrl = 'http://172.17.15.253:8080/adminReviewGetData';

        axios
            .get(adminApiUrl)
            .then((response) => {
                const adminData = response.data;
                setAdminData(adminData);

                // Initialize employee data based on admin data
                const initialEmployeeData = Object.keys(adminData).reduce(
                    (result, key) => {
                        const reviewPoints = adminData[key]['Review Points'];

                        const employeePoints = reviewPoints.map((point, index) => ({
                            Value: key,
                            ReviewPoint: point,
                            SelfReview: false,
                            Reviewver: false,
                            Comments: '',
                            imageUrl: ''
                        }));

                        return [...result, ...employeePoints];
                    },
                    []
                );

                setEmployeeData(initialEmployeeData);
                console.log('Initial Employee Data:', initialEmployeeData);
            })
            .catch((error) => {
                console.error('Error fetching admin data', error);
            });
    }, []);

    useEffect(() => {
        const dataForTabs = tabLabels.map((label) => {
            return employeeData.filter((data) => data.Value === label);
        });
        setTabData(dataForTabs);
    }, [employeeData, tabLabels]);


    const handleButtonClick = (tabIndex, dataIndex, value) => {

        const updatedTabData = [...tabData];
        updatedTabData[tabIndex][dataIndex].SelfReview = value;
        setTabData(updatedTabData);
    };

    


    const handleFileChangeForRow = (e, rowIndex) => {
        setSelectedImageFile(e.target.files[0])
        console.log(selectedImageFile, "selectedFile", employeeData);


        const selectedFile = e.target.files[0];
        setRowIndex(rowIndex);

        setRowFiles((prevRowFiles) => {
            const newFiles = [...prevRowFiles];
            newFiles[rowIndex] = selectedFile;
            return newFiles;
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const parseJWT = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedData = JSON.parse(atob(base64));
            return decodedData;
        };

        const tokenData = parseJWT(token);
        const empId = tokenData.Empid;
        const empName1 = tokenData.Firstname;
        const empName2 = tokenData.Lastname;
        const fullName = empName1 + ' ' + empName2;

        try {

            const formattedData = {
                empid: empId,
                empname: fullName,
                ratings: employeeData
            };

            console.log('Formatted Data:', formattedData);
            const apiUrl = 'http://172.17.15.253:8080/insertReviewPoints';

            await axios.post(apiUrl, formattedData);

            setOpenDialog(true);

        } catch (error) {
            console.error('Error in handleSubmit:', error);
        }
    };



    const handleUploadForRow = async (imageFile, tabIndex, rowIndex) => {
        setLoading(true);
        console.log(imageFile, "118", rowFiles[rowIndex]);
        const token = localStorage.getItem('token');
        const parseJWT = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedData = JSON.parse(atob(base64));
            return decodedData;
        };

        const tokenData = parseJWT(token);
        const empId = tokenData.Empid;
        const empName1 = tokenData.Firstname;
        const empName2 = tokenData.Lastname;
        const fullName = empName1 + ' ' + empName2;
        const sequentialNumber = `Rid${rowIndex.toString().padStart(4, '0')}`;
        console.log(sequentialNumber, "sequentialNumber");
        try {
            if (imageFile) {
                const storageRef = storage.ref(`uploads/${imageFile.name}`);
                await storageRef.put(imageFile);
                const downloadURL = await storageRef.getDownloadURL();
    
                // Find the correct index within the employeeData array for the selected tab and row
                const selectedIndex = employeeData.findIndex(
                    (data) => data.Value === tabLabels[tabIndex] && data.ReviewPoint === tabData[tabIndex][rowIndex].ReviewPoint
                );
    
                if (selectedIndex !== -1) {
                    // Update the imageUrl for the found index
                    if (employeeData[selectedIndex].imageUrl === '') {
                        employeeData[selectedIndex].imageUrl = downloadURL;
                    }
                }
            } else {
                console.error('No file selected for upload');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };





    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const username = firstname + " " + lastname

    return (
        <>
            <AppBar position="fixed">
                <Toolbar className="navBar-style">

                    <div className="userInfo">
                        <Typography variant="h6" className="welcome-text">
                            Welcome
                        </Typography>

                        <h3 className="username-style">{username}</h3>
                    </div>
                    <Button color="inherit" onClick={handleClose} className='buttonwrapper'>
                        <span className='gobackeform'

                        >
                            &#8629;
                        </span>&nbsp;
                        <b>GoBack</b>
                    </Button>
                </Toolbar>
            </AppBar>
            <br /><br /><br /><br />
            <form onSubmit={handleSubmit} >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '80%', margin: '0 auto' }}>
                    <Tabs value={selectedTab} onChange={handleTabChange}>
                        {tabLabels.map((label, index) => (
                            <Tab label={label} key={index} style={{ fontWeight: 'bold', fontSize: '18px' }} />
                        ))}
                    </Tabs>
                </div>
                <br />
                <div style={{ maxWidth: '90%', margin: '0 auto', backgroundColor: '#f5f5f5' }}>
                    <div style={{ height: '500px', overflowY: 'auto', border: '1px solid #c7c7c7' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontSize: '20px' }}><b>Review Point</b></TableCell>
                                    <TableCell style={{ fontSize: '20px' }}><b>Self-Review</b></TableCell>
                                    <TableCell style={{ fontSize: '20px' }}><b>Upload Image</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employeeData
                                    .filter((data) => data.Value === tabLabels[selectedTab])
                                    .map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{data.ReviewPoint}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    type="button"
                                                    className={`yes-button ${data.SelfReview ? 'selected' : ''}`}
                                                    onClick={() => handleButtonClick(selectedTab, index, true)}
                                                >
                                                    Yes
                                                </Button>&nbsp;
                                                <Button
                                                    variant="outlined"
                                                    type="button"
                                                    className={`no-button ${!data.SelfReview ? 'selected' : ''}`}
                                                    onClick={() => handleButtonClick(selectedTab, index, false)}
                                                >
                                                    No
                                                </Button>

                                            </TableCell>
                                            <TableCell>
                                                <Input type="file" onChange={(e) => handleFileChangeForRow(e, index)} />
                                                <UploadFileIcon type="button" variant="outlined" onClick={() => handleUploadForRow(selectedImageFile, selectedTab, index)}>
                                                    Upload
                                                </UploadFileIcon>
                                                {loading && rowIndex === index && <CircularProgress size={30} />}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>

                        </Table>
                    </div>
                </div>
                <br />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{
                        position: 'fixed',
                        bottom: '0',
                        right: '180px',
                        marginBottom: '40px',
                    }}
                >
                    Submit
                </Button>

                <Dialog open={openDialog} onClose={handleClose}>
                    <DialogContent style={{ width: '420px' }}>
                        <img
                            src="https://badge-exam.miraclesoft.com/assets/ecert/Completed-test.svg"
                            alt="Your Image Alt Text"
                            style={{ maxWidth: '100%', maxHeight: '200px', marginLeft: '23%' }}
                        />
                        <DialogContentText style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', color: '#1dbb99' }}>
                            Successfully filled the form. Click OK to Login
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" style={{ color: 'black', backgroundColor: '#d8d6d6', fontWeight: 'bolder' }}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>

        </>
    );
}