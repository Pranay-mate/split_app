import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import GroupDashboard from './groupDashboard';
import { IoArrowBackOutline } from 'react-icons/io5';
import { MdListAlt, MdOutlineCancel } from 'react-icons/md';
import { BiCheckCircle } from 'react-icons/bi'
import Accordion from 'react-bootstrap/Accordion';
import moment from 'moment'

function Activity() {
    const [allgroups, setAllGroups] = useState([]);
    const [openedGroup, setOpenGroup] = useState([]);

    const [selectedValue, setSelectedValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [grpId, setGrpId] = useState("");
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [userLists, setUserList] = useState([]);
    const [selectedExpenseCat, setSelectedExpenseCat] = useState([]);
    const [selectPaidUser, setSelectPaidUser] = useState("");
    const [selectSplitIn, setSelectSplitIn] = useState([]);

    const [ExpenseDescri, setExpenseDescri] = useState("");
    const [ExpenseAmount, setExpenseAmount] = useState("");
    const [groupsRequests, setGroupsRequests] = useState([]);
    const [allGroupExpenses, setAllGroupExpenses] = useState([]);
    const [UserAndId, setUserAndIds] = useState([]);
    const [GroupAndIds, setGroupAndIds] = useState([]);
    const [groupExpenseDivision, setAllGroupExpenseDivsion] = useState([]);
    const [allPayments, setAllPayments] = useState([]);

    let userData = JSON.parse(localStorage.getItem('loginData'));

    const getAllGroupExpenses = ()=>{
        console.log('getAllGroupExpenses')
        if(userData && userData._id!=undefined && userData._id!=null){
            axios.get(`http://localhost:5000/getAllGroupExpenses/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                setAllGroupExpenses(data)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const getAllGroupExpenseDivsion = ()=>{
        console.log('getAllGroupExpenseDivsion')
        if(userData && userData._id!=undefined && userData._id!=null){
            axios.get(`http://localhost:5000/getAllGroupExpenseDivsion/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                setAllGroupExpenseDivsion(data)
            }).catch(e => {
                console.log("e");
            });
        }
    }


    useEffect(() => {
        getAllGroupExpenses();
        getUsersList();
        getAllGroups()
        getAllGroupExpenseDivsion()
        getAllPayments()
    }, []);


    const getUsersList = () => {
        console.log('getUsersList')
        if(userData && userData.email != undefined && userData._id != null){
            console.log(userData._id)
            axios.get(`http://localhost:5000/getUsers/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                let userAndId = [];
                data.map((user)=>{
                    userAndId[user._id] = user.name;
                })
                setUserAndIds(userAndId)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const getAllGroups = () => {
        console.log('getAllGroups')
        let userData = JSON.parse(localStorage.getItem('loginData'));
        console.log(userData)
        // console.log('getLoginUser: '+userData._id)
        if(userData && userData._id!=undefined && userData._id!=null){
            axios.get(`http://localhost:5000/getAllGroups/`+userData._id)
            .then(res => {
                const data = res.data;
                let groupNameAndIds = [];
                data.map((group)=>{
                    groupNameAndIds[group._id] = group.group_name;
                })
                console.log(groupNameAndIds)
                setGroupAndIds(groupNameAndIds)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const settleUpExpenseReq = (grpId,sender,receiver,amount)=>{
        console.log(grpId,sender,receiver,amount)
        axios.post(`http://localhost:5000/settleUpExpenseReq/`,{'groupId':grpId,'sender':sender,'receiver':receiver,'amount':amount})
        .then(res => {
            const data = res.data;
            
            console.log(data)
            getAllGroupExpenses();
            // setGroupAndIds(groupNameAndIds)
        }).catch(e => {
            console.log("e");
        });
    }
    
    const receivedPayment = (expenseId,grpId,sender,receiver,amount)=>{
        console.log(grpId,sender,receiver,amount)
        axios.post(`http://localhost:5000/receivedPayment`,{'expenseId':expenseId,'groupId':grpId,'sender':sender,'receiver':receiver,'amount':amount})
        .then(res => {
            const data = res.data;
            console.log(data)
            getAllGroupExpenses();

            // setGroupAndIds(groupNameAndIds)
        }).catch(e => {
            console.log("e");
        });
    }

    const getAllPayments = () => {
        console.log('getUsersList')
        if(userData && userData.email != undefined && userData._id != null){
            console.log(userData._id)
            axios.get(`http://localhost:5000/getAllPayments/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                setAllPayments(data)
            }).catch(e => {
                console.log("e");
            });
        }
    }
return (
    <div className="container ">
        <Accordion defaultActiveKey="0" flush className='my-4'>
        {allGroupExpenses.length>0?allGroupExpenses.map((groupExpense, idx) => (
            <Accordion.Item eventKey={idx}>
            <Accordion.Header>
                {GroupAndIds[groupExpense[0].groupId]}
                
            </Accordion.Header>
            <Accordion.Body>
                <div>
                
                {groupExpenseDivision[groupExpense[0].groupId] !== undefined?groupExpenseDivision[groupExpense[0].groupId].map((expenseData,i)=>(
                    <>
                    <Row className="my-4 mx-2">
                        <Col xs={2} className="my-auto">
                            <div className={'avatar-'+i} style={{"width":"40px","height":"40px", borderRadius:"2em"}}></div>
                        </Col>
                        <Col xs={8} className="my-auto">
                            
                        {UserAndId[expenseData.sender]} owes ₹{parseInt(expenseData.amount).toFixed(2)} to {UserAndId[expenseData.receiver]}
                        </Col>
                        <Col xs={2} style={{"textAlign":"end"}} className="my-auto">
                        {expenseData.status==='Pay' && expenseData.sender === userData._id?
                        <Button variant="success" onClick={()=>settleUpExpenseReq(groupExpense[0].groupId,expenseData.sender,expenseData.receiver,parseInt(expenseData.amount))}>Paid</Button>
                        :expenseData.status==='Pay' && expenseData.receiver === userData._id?
                        <Button variant="success">Not Received</Button>
                        :expenseData.status==='Pending' && expenseData.receiver === userData._id?
                        <Button variant="success" onClick={()=>receivedPayment(expenseData.id,groupExpense[0].groupId,expenseData.sender,expenseData.receiver,parseInt(expenseData.amount))}>Confirm payment</Button>
                        :expenseData.status==='Pending' ?
                        <Button style={{'cursor':"auto"}} variant="outline-success">Pending</Button>
                        :expenseData.status==='Settled'?
                        <Button style={{'cursor':"auto"}} variant="outline-success">Settled</Button>
                        :<Button style={{'cursor':"auto"}} variant="outline-success">Not involved</Button>
                        }
                        </Col>
                    </Row>
                    </>
                ))
                
                :
                <>
                <div className="my-2 text-center mx-4"><Button variant="outline-success">All Settled</Button></div>
                    {allPayments[groupExpense[0].groupId] !== undefined?allPayments[groupExpense[0].groupId].map((payment,i)=>(
                        <Row className="my-4 mx-2">
                            <Col xs={2} className="my-auto">
                                <div className={'avatar-'+i} style={{"width":"40px","height":"40px", borderRadius:"2em"}}></div>
                            </Col>
                            <Col xs={8} className="my-auto">
                                {UserAndId[payment.userId]} paid ₹{payment.amount} to {UserAndId[payment.paid_to]}  
                            </Col>
                            <Col xs={2} style={{"textAlign":"end"}} className="my-auto">
                                {payment.isConfirmed?<Button variant="outline-success">Payment Successful</Button>:<Button>Payment pending</Button>}
                            </Col>
                        </Row>
                    )):null}
                </>
                }
                <p className='hr3'></p>
                <div>
                {groupExpense.map((expense)=>(
                    <Row>
                        <Col xs={1}>{ moment(expense.createdAt).format("MMM DD")}</Col>
                        <Col xs={2}><MdListAlt style={{backgroundColor:"white",color: "green"}} size='50'  /></Col>
                        <Col>
                            <Row><h6>{expense.expenseDescription}</h6></Row>
                            <Row><p>{UserAndId[expense.paid_by]} paid ₹{expense.expenseAmount}</p></Row>
                        </Col>
                        <Col xs={2} style={{"textAlign":"end"}}>
                            {(expense.paid_by === userData._id)?  
                            <>
                            <p>you lent<br></br>₹{parseInt(expense.expenseAmount-(expense.expenseAmount/expense.per_person)).toFixed(2)}</p>
                            </>
                            :(expense.split_betn.includes(userData._id))?  
                            <>
                            <p>you borrowed<br></br>₹{parseInt(expense.expenseAmount/expense.per_person).toFixed(2)}</p>
                            </>
                            :
                            <>
                            <p>not involved</p>
                            </>
                            }
                        </Col>
                    </Row>
                ))}
                </div>
                </div>
            </Accordion.Body>
            </Accordion.Item>
        )): null}
        </Accordion>
    </div>
  );
}

export default Activity;