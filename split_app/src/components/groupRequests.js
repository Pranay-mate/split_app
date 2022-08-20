import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

function GroupRequests() {
    const [groupsRequests, setGroupsRequests] = useState([]);

    const getRequestedGroup = () => {
        console.log('getRequestedGroup')
        let userData = JSON.parse(localStorage.getItem('loginData'));
        console.log(userData)
        // console.log('getLoginUser: '+userData._id)
        if(userData && userData._id!=undefined && userData._id!=null){
            axios.get(`/api/getRequestedGroup/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                setGroupsRequests(data)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const acceptGrpReq = (grpId) => {
        console.log('acceptGrpReq')
        let userData = JSON.parse(localStorage.getItem('loginData'));
        // console.log('getLoginUser: '+userData._id)
        if(grpId && grpId!==undefined && grpId!==null && userData){
            axios.get(`/api/acceptGrpReq/`+userData._id+`/`+grpId)
            .then(res => {
                const data = res.data;
                console.log(data)
                setGroupsRequests(data)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    useEffect(() => {
        getRequestedGroup();
    }, []);


return (
    <div className="">
        {groupsRequests.length>0?groupsRequests.map((group, idx) => (
            <Row xs={1} className="m-4">
                <Card className='' id={group._id} style={{border:"2.5px solid blue"}} >
                    <Card.Body>
                        <Row>
                            <Col xs="3" className="my-auto">
                            {/* <i class={cardData.Campaign_icon} style={{fontSize:'4em'}}></i> */}
                            {group.group_name}
                            </Col>
                            <Col xs className="my-auto">
                                <Row><h6>{group.group_name}</h6></Row>
                                <Row><p>{group.group_name}</p></Row>
                            </Col>
                            <Col xs="3" className="my-auto">
                                <Button onClick={()=>acceptGrpReq(group._id)}>Accept Group</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>
        )): null}
    </div>
  );
}

export default GroupRequests;