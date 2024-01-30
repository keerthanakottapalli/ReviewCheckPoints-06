import React from 'react'
import { Button, Typography, Container, Card, CardContent } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom'
import code_review from './code_review.png'

export default function Main() {
    const navigate = useNavigate();

    const handleLogin = () => {
      navigate('/loginform'); 
    };
  
    const handleRegister = () => {
      navigate('/registration'); 
    };
  

    return (
        <div className="page-container" style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Container maxWidth="sm">
            <Typography variant="h5" component="h5" gutterBottom style={{ color: 'black', textAlign: 'center' }}>
              <b>WELCOME TO CODE REVIEW CHECK POINTS PORTAL!</b>
            </Typography>
            <Card className="card" style={{ minHeight: '400px', paddingTop: '20px' }}>
              <img style={{ height: '35vh' }} src={code_review} alt='not found' />
              <CardContent>
                <div className="button-container">
                  <Button variant="contained" color="primary" onClick={handleLogin} className="button" style={{ paddingLeft: '28px', paddingRight: '28px' }}>
                    <b>Login</b>
                  </Button>
                  <Button variant="contained" color="secondary" style={{ marginLeft: '20px' }} onClick={handleRegister} className="button">
                    <b>Register</b>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Container>
        </div>
      );
      
}
