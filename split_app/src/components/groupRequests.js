import { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';

function GroupRequests() {
    const [groupsRequests, setGroupsRequests] = useState([]);

    const getRequestedGroup = () => {
        const userData = JSON.parse(localStorage.getItem('loginData'));
        if (userData && userData._id) {
            axios.get(`/api/getRequestedGroup/${userData._id}`)
                .then(res => {
                    setGroupsRequests(res.data);
                })
                .catch(error => {
                    console.error("Error fetching group requests:", error);
                });
        }
    }

    const acceptGrpReq = (grpId) => {
        const userData = JSON.parse(localStorage.getItem('loginData'));
        if (grpId && userData) {
            axios.get(`/api/acceptGrpReq/${userData._id}/${grpId}`)
                .then(res => {
                    setGroupsRequests(res.data);
                })
                .catch(error => {
                    console.error("Error accepting group request:", error);
                });
        }
    }

    useEffect(() => {
        getRequestedGroup();
    }, []);

    return (
        <div className="">
            {groupsRequests.length > 0 && groupsRequests.map((group) => (
                <Row key={group._id} className="m-4">
                    <Card className='' id={group._id} style={{ border: "2.5px solid blue" }}>
                        <Card.Body>
                            <Row>
                                <Col xs="3" className="my-auto">
                                    {group.group_name}
                                </Col>
                                <Col xs className="my-auto">
                                    <Row><h6>{group.group_name}</h6></Row>
                                    <Row><p>{group.group_name}</p></Row>
                                </Col>
                                <Col xs="3" className="my-auto">
                                    <Button onClick={() => acceptGrpReq(group._id)}>Accept Group</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Row>
            ))}
        </div>
    );
}

export default GroupRequests;
