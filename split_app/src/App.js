import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import GroupDashboard from "./components/groupDashboard";
import Menu from './components/menu'
import './App.css'
import AddGroup from './components/addGroup';
import GroupsList from './components/groupList';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Activity from './components/activity'
import Payments from './components/payments';
import Image from 'react-bootstrap/Image'


export default function App() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
      : null
  );

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: 'email',
      });
    }
    
    gapi.load('client:auth2', start);
}, []);

const handleFailure = (result) => {
  console.log(result);
};

  const handleLogin = async (googleData) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await res.json();
    console.log('logindata:'+data)
    console.log(data)
    setLoginData(data);
    document.getElementById('GroupsLink').click();
    localStorage.setItem('loginData', JSON.stringify(data));
    //  _userData = JSON.parse(localStorage.getItem('loginData'));
  };
  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setLoginData(null);
  };

  return (
    <>
    <div className="App">
      {loginData ? null : (
        <Container>
          <Row className='mx-auto mt-4'  style={{textAlign: 'center'}}>
            <Col xs={12}>
              <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Log in with Google"
              onSuccess={handleLogin}
              onFailure={handleFailure}
              cookiePolicy={'single_host_origin'}
              className="align-self-center"
              ></GoogleLogin>
              </Col>
          </Row>
        </Container>
      )}

    </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />}>
          <Route index element={<>{loginData ?<GroupsList />:null}</>} />
          <Route path='activity' element={<>{loginData ?<Activity />:null}</>} />
          <Route path='addGroup' element={<>{loginData ?<AddGroup />:null}</>} />
          <Route path='payments' element={<>{loginData ?<Payments />:null}</>} />
          <Route path="account" element={
            <>
            {loginData ? (
              <>
                <div className='container'>
                  <Card className='text-center mt-4'>
                    <Row className='mx-auto'>
                      <Image src={loginData.picture} roundedCircle alt="Picture" style={{"width":"150px","height":"125px"}} ></Image>
                    </Row>
                    <h3>{loginData.name}</h3>
                    <h3>{loginData.email}</h3>
                    <Button className='btn-sm mx-auto' onClick={handleLogout}>Logout</Button>
                  </Card>
                </div>
              </>
            ) : null}
            </>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}
