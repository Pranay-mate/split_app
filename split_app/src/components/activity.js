import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import moment from 'moment';
import { MdListAlt } from 'react-icons/md';

function Activity() {
    // State variables
    const [allGroupExpenses, setAllGroupExpenses] = useState([]);
    const [userAndIds, setUserAndIds] = useState([]);
    const [groupAndIds, setGroupAndIds] = useState([]);
    const [groupExpenseDivision, setGroupExpenseDivision] = useState([]);
    const [allPayments, setAllPayments] = useState([]);
    const userData = JSON.parse(localStorage.getItem('loginData'));

    // Function to fetch all group expenses
    const getAllGroupExpenses = () => {
        if (userData && userData._id) {
            axios.get(`/api/getAllGroupExpenses/${userData._id}`)
                .then(res => setAllGroupExpenses(res.data))
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        console.log(error.response.data.message);
                        // Handle 400 status error
                    } else {
                        console.error(error);
                    }
                });
        }
    };

    // Function to fetch user list
    const getUsersList = () => {
        if (userData && userData._id) {
            axios.get(`/api/getUsers/${userData._id}`)
                .then(res => {
                    const data = res.data;
                    let usersAndIds = {};
                    data.forEach(user => usersAndIds[user._id] = user.name);
                    setUserAndIds(usersAndIds);
                })
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        console.log(error.response.data.message);
                        // Handle 400 status error
                    } else {
                        console.error(error);
                    }
                });
        }
    };

    // Function to fetch all groups
    const getAllGroups = () => {
        if (userData && userData._id) {
            axios.get(`/api/getAllGroups/${userData._id}`)
                .then(res => {
                    const data = res.data;
                    let groupsAndIds = {};
                    data.forEach(group => groupsAndIds[group._id] = group.group_name);
                    setGroupAndIds(groupsAndIds);
                })
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        console.log(error.response.data.message);
                        // Handle 400 status error
                    } else {
                        console.error(error);
                    }
                });
        }
    };

    // Function to fetch all group expense divisions
    const getAllGroupExpenseDivision = () => {
        if (userData && userData._id) {
            axios.get(`/api/getAllGroupExpenseDivision/${userData._id}`)
                .then(res => setGroupExpenseDivision(res.data))
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        console.log(error.response.data.message);
                        // Handle 400 status error
                    } else {
                        console.error(error);
                    }
                });
        }
    };

    // Function to fetch all payments
    const getAllPayments = () => {
        if (userData && userData._id) {
            axios.get(`/api/getAllPayments/${userData._id}`)
                .then(res => setAllPayments(res.data))
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        console.log(error.response.data.message);
                        // Handle 400 status error
                    } else {
                        console.error(error);
                    }
                });
        }
    };

    // Function to settle up expense request
    const settleUpExpenseReq = (groupId, sender, receiver, amount) => {
        axios.post(`/api/settleUpExpenseReq/`, { groupId: groupId, sender: sender, receiver: receiver, amount: amount })
            .then(res => {
                console.log(res.data);
                getAllGroupExpenses();
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    console.log(error.response.data.message);
                    // Handle 400 status error
                } else {
                    console.error(error);
                }
            });
    };

    // Function to confirm received payment
    const receivedPayment = (expenseId, groupId, sender, receiver, amount) => {
        axios.post(`/api/receivedPayment`, { expenseId: expenseId, groupId: groupId, sender: sender, receiver: receiver, amount: amount })
            .then(res => {
                console.log(res.data);
                getAllGroupExpenses();
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    console.log(error.response.data.message);
                    // Handle 400 status error
                } else {
                    console.error(error);
                }
            });
    };

    useEffect(() => {
        getAllGroupExpenses();
        getUsersList();
        getAllGroups();
        getAllGroupExpenseDivision();
        getAllPayments();
    }, []);

    return (
        <Container>
            <Accordion defaultActiveKey="0" flush className="my-4">
                {allGroupExpenses.length > 0 ? allGroupExpenses.map((groupExpense, idx) => (
                    <Accordion.Item key={idx} eventKey={idx}>
                        <Accordion.Header>{groupAndIds[groupExpense[0].groupId]}</Accordion.Header>
                        <Accordion.Body>
                            <div>
                                {groupExpenseDivision[groupExpense[0].groupId] !== undefined ? groupExpenseDivision[groupExpense[0].groupId].map((expenseData, i) => (
                                    <Row key={i} className="my-4 mx-2">
                                        <Col xs={2} className="my-auto">
                                            <div className={`avatar-${i}`} style={{ width: "40px", height: "40px", borderRadius: "2em" }}></div>
                                        </Col>
                                        <Col xs={8} className="my-auto">
                                            {userAndIds[expenseData.sender]} owes ₹{parseInt(expenseData.amount).toFixed(2)} to {userAndIds[expenseData.receiver]}
                                        </Col>
                                        <Col xs={2} style={{ textAlign: "end" }} className="my-auto">
                                            {expenseData.status === 'Pay' && expenseData.sender === userData._id ? (
                                                <Button variant="success" onClick={() => settleUpExpenseReq(groupExpense[0].groupId, expenseData.sender, expenseData.receiver, parseInt(expenseData.amount))}>Paid</Button>
                                            ) : expenseData.status === 'Pay' && expenseData.receiver === userData._id ? (
                                                <Button variant="success">Not Received</Button>
                                            ) : expenseData.status === 'Pending' && expenseData.receiver === userData._id ? (
                                                <Button variant="success" onClick={() => receivedPayment(expenseData.id, groupExpense[0].groupId, expenseData.sender, expenseData.receiver, parseInt(expenseData.amount))}>Confirm payment</Button>
                                            ) : expenseData.status === 'Pending' ? (
                                                <Button style={{ cursor: "auto" }} variant="outline-success">Pending</Button>
                                            ) : expenseData.status === 'Settled' ? (
                                                <Button style={{ cursor: "auto" }} variant="outline-success">Settled</Button>
                                            ) : (
                                                <Button style={{ cursor: "auto" }} variant="outline-success">Not involved</Button>
                                            )}
                                        </Col>
                                    </Row>
                                )) : (
                                    <>
                                        <div className="my-2 text-center mx-4">
                                            <Button variant="outline-success">All Settled</Button>
                                        </div>
                                        {allPayments[groupExpense[0].groupId] !== undefined ? allPayments[groupExpense[0].groupId].map((payment, i) => (
                                            <Row key={i} className="my-4 mx-2">
                                                <Col xs={2} className="my-auto">
                                                    <div className={`avatar-${i}`} style={{ width: "40px", height: "40px", borderRadius: "2em" }}></div>
                                                </Col>
                                                <Col xs={8} className="my-auto">
                                                    {userAndIds[payment.userId]} paid ₹{payment.amount} to {userAndIds[payment.paid_to]}
                                                </Col>
                                                <Col xs={2} style={{ textAlign: "end" }} className="my-auto">
                                                    {payment.isConfirmed ? (
                                                        <Button variant="outline-success">Payment Successful</Button>
                                                    ) : (
                                                        <Button>Payment pending</Button>
                                                    )}
                                                </Col>
                                            </Row>
                                        )) : null}
                                    </>
                                )}
                                <p className="hr3"></p>
                                <div>
                                    {groupExpense.map((expense, i) => (
                                        <Row key={i}>
                                            <Col xs={1}>{moment(expense.createdAt).format("MMM DD")}</Col>
                                            <Col xs={2}><MdListAlt style={{ backgroundColor: "white", color: "green" }} size='50' /></Col>
                                            <Col>
                                                <Row><h6>{expense.expenseDescription}</h6></Row>
                                                <Row><p>{userAndIds[expense.paid_by]} paid ₹{expense.expenseAmount}</p></Row>
                                            </Col>
                                            <Col xs={2} style={{ textAlign: "end" }}>
                                                {expense.paid_by === userData._id ? (
                                                    <>
                                                        <p>you lent<br />₹{parseInt(expense.expenseAmount - (expense.expenseAmount / expense.per_person)).toFixed(2)}</p>
                                                    </>
                                                ) : expense.split_betn.includes(userData._id) ? (
                                                    <>
                                                        <p>you borrowed<br />₹{parseInt(expense.expenseAmount / expense.per_person).toFixed(2)}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>not involved</p>
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                )) : null}
            </Accordion>
        </Container>
    );
}

export default Activity;
