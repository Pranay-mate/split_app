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
import Image from 'react-bootstrap/Image'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from './loader'
import GroupsList from './groupList';


function Payments() {
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
    const [UserAndPic, setUserAndPics] = useState([]);
    const [GroupAndIds, setGroupAndIds] = useState([]);
    const [groupExpenseDivision, setAllGroupExpenseDivsion] = useState([]);
    const [allPayments, setAllPayments] = useState([]);
    let userData = JSON.parse(localStorage.getItem('loginData'));
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [expenseCategoryIdAndIcon, setExpenseCategoryIdAndIcon] = useState([]);
    const [displayLoader, setDisplayLoader] = useState(true);

    const getAllGroupExpenses = ()=>{
        console.log('getAllGroupExpenses')
        if(userData && userData._id!=undefined && userData._id!=null){
            axios.get(`/api/getAllGroupExpenses/`+userData._id)
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
            axios.get(`/api/getAllGroupExpenseDivsion/`+userData._id)
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
        getExpenseCategory()
        setTimeout(()=>{setDisplayLoader(false)},2000)
    }, []);


    const getUsersList = () => {
        console.log('getUsersList')
        if(userData && userData.email != undefined && userData._id != null){
            console.log(userData._id)
            axios.get(`/api/getUsers/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                let userAndId = [];
                let userAndPic = [];
                data.map((user)=>{
                    userAndId[user._id] = user.name;
                    userAndPic[user._id] = user.picture;

                })
                setUserAndIds(userAndId)
                setUserAndPics(userAndPic)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const getAllPayments = () => {
        console.log('getUsersList')
        if(userData && userData.email != undefined && userData._id != null){
            console.log(userData._id)
            axios.get(`/api/getAllPayments/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                setAllPayments(data)
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
            axios.get(`/api/getAllGroups/`+userData._id)
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
        axios.post(`/api/settleUpExpenseReq/`,{'groupId':grpId,'sender':sender,'receiver':receiver,'amount':amount})
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
        axios.post(`/api/receivedPayment`,{'expenseId':expenseId,'groupId':grpId,'sender':sender,'receiver':receiver,'amount':amount})
        .then(res => {
            const data = res.data;
            console.log(data)
            getAllGroupExpenses();

            // setGroupAndIds(groupNameAndIds)
        }).catch(e => {
            console.log("e");
        });
    }

    const getExpenseCategory = ()=>{
        console.log('getExpenseCategory')
        axios.get(`/api/getExpenseCategory`)
            .then(res => {
                const data = res.data;
                console.log(data)
                let CategoryIdAndIcon = [];
                data.map((category)=>{
                    CategoryIdAndIcon[category._id] = category.icon;
                })
                setExpenseCategoryIdAndIcon(CategoryIdAndIcon)
            }).catch(e => {
                console.log("e");
            });
    }


    const changeActiveAccordion = (id) =>{
        if(activeAccordion === id){
            setActiveAccordion(-1)
        }else{
            setActiveAccordion(id)
        }
    }

return (
    <div className="container ">
        {!displayLoader?
        <Accordion defaultActiveKey="0"  activeKey={activeAccordion} flush className='my-4'>
        {allGroupExpenses.length>0?allGroupExpenses.map((groupExpense, idx) => (
            <Accordion.Item eventKey={idx} onClick={()=>changeActiveAccordion(idx)}>
            <Accordion.Header>
                {GroupAndIds[groupExpense[0].groupId]}
                
            </Accordion.Header>
            <Accordion.Body>
                <div>
                {allPayments[groupExpense[0].groupId] !== undefined?allPayments[groupExpense[0].groupId].map((payment,i)=>(
                        <Row className="my-4">
                            <Col xs={2} className="mx-auto text-center">
                                {/* <div className={'avatar-'+i} style={{"width":"40px","height":"40px", borderRadius:"2em"}}></div> */}
                                <Image src={UserAndPic[payment.userId]} roundedCircle alt="Picture" style={{"width":"40px","height":"40px"}} ></Image>
                            </Col>
                            <Col xs={7}  className="mb-0 text_small">
                                {UserAndId[payment.userId]} paid ₹{payment.amount} to {UserAndId[payment.paid_to]}  
                            </Col>
                            <Col xs={3} style={{"textAlign":"end"}} className="my-auto pl-0">
                                {payment.isConfirmed?<p>Successful</p>:<p>Pending</p>}
                            </Col>
                        </Row>
                )):null}
                <p className='hr3'></p>
                <div>
                {groupExpense.map((expense)=>(
                    <Row className="my-2">
                        <Col xs={2} className="my-auto text-center">{ moment(expense.createdAt).format("MMM DD")}</Col>
                        <Col xs={2} className="my-auto text-center"><FontAwesomeIcon icon={expenseCategoryIdAndIcon[expense.expenseCategory]}  size="2x" /></Col>
                        {/* <Col xs={2}><MdListAlt style={{backgroundColor:"white",color: "green"}} size='50'  /></Col> */}
                        <Col xs={5} className="my-auto">
                            <Row><h6 className="mb-0 text-capitalize mid_small">{expense.expenseDescription}</h6></Row>
                            <Row><p className="mb-0 text_small">{UserAndId[expense.paid_by]} paid ₹{expense.expenseAmount}</p></Row>
                        </Col>
                        <Col xs={3} className="my-auto" style={{"textAlign":"end"}}>
                            {(expense.paid_by === userData._id)?  
                            <div className="my-auto"><p className='vv_small mb-0'>you lent</p>
                                <p className='mb-0'>₹{parseInt(expense.expenseAmount-(expense.expenseAmount/expense.per_person)).toFixed(2)}</p>
                            </div>
                            :(expense.split_betn.includes(userData._id))?  
                            <div className="my-auto"><p className='vv_small mb-0 px-0'>you borrowed</p>
                                <p className='mb-0'>₹{parseInt(expense.expenseAmount/expense.per_person).toFixed(2)}</p>
                            </div>
                            :
                            <>
                            <p className='vv_small mb-0'>not involved</p>
                            </>
                            }
                        </Col>
                    </Row>
                ))}
                </div>
                </div>
            </Accordion.Body>
            </Accordion.Item>
        )): <GroupsList></GroupsList>}
        </Accordion>
        :<Loader></Loader>}
    </div>
  );
}

export default Payments;