import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { IoAddOutline } from 'react-icons/io5';


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Outlet
  } from "react-router-dom";
function Menu() {
    return (
      <>
        <Navbar bg="dark" variant="dark" fixed="bottom" className='border-top' >
            <Nav className="mx-auto p-0">
              <Nav.Link className="mx-2" activeStyle={{ color: 'red' }}>
                  <Link to="/" exact id="GroupsLink" >Groups</Link>
              </Nav.Link>
              <Nav.Link className="mx-2">
                  <Link exact to="/activity">Activity</Link>
              </Nav.Link>
              <Nav.Link  className="mx-2">
                  <Link exact to="/payments">Payment</Link>
              </Nav.Link>
              <Nav.Link className="mx-2">
                  <Link exact to="/account">Account</Link>
              </Nav.Link>
            </Nav>
        </Navbar>
        <Outlet></Outlet>
      </>
    );
  }
  

export default Menu;