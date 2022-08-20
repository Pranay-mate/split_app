import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
// import AddGroup from './addGroup'
import AddGroup from './components/addGroup';
import GroupsList from './components/groupList'
import Menu from './components/menu'
import Button from 'react-bootstrap/esm/Button';


function Dashboard() {
  return (
    <div className="">
        <>
          <GroupsList></GroupsList>
          {/* <Button onClick={()=>setCreateGroup(true)}>Create Group</Button> */}
        </>
    </div>
  );
}

export default Dashboard;