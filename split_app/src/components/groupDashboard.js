import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Multiselect from 'multiselect-react-dropdown';
import Card from 'react-bootstrap/Card'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import { MdListAlt } from 'react-icons/md';
import moment from 'moment'


function GroupDashboard(props) {
    console.log(props.group)
    const [allgroups, setAllGroups] = useState([]);
    const [openedGroup, setOpenGroup] = useState('');
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
    const [GroupExpenses, setGroupExpenses] = useState("");
    const [UserAndId, setUserAndIds] = useState([]);
    let userData = JSON.parse(localStorage.getItem('loginData'));

   
    const getAllGroups = () => {
        console.log('getAllGroups')
        let userData = JSON.parse(localStorage.getItem('loginData'));
        console.log(userData)
        // console.log('getLoginUser: '+userData._id)
        if(userData && userData._id!=undefined && userData._id!=null){
            axios.get(`/api/getAllGroups/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                setAllGroups(data)
            }).catch(e => {
                console.log("e");
            });
        }
    } 

    const getUsersList = () => {
        console.log('getUsersList')
        let userData = JSON.parse(localStorage.getItem('loginData'));
        if(userData && userData.email != undefined && userData._id != null){
            console.log(userData._id)
            axios.get(`/api/getUsers/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                let userAndId = [];
                data.map((user)=>{
                    userAndId[user._id] = user.name;
                })
                setUserAndIds(userAndId)
                let loginUserData = data.filter((user)=> user._id == userData._id)
                console.log(loginUserData)
                setSelectPaidUser(userData._id)
                setSelectedValue(loginUserData)
                setUserList(data)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const getExpenseCategory = ()=>{
        console.log('getExpenseCategory')
        axios.get(`/api/getExpenseCategory`)
            .then(res => {
                const data = res.data;
                console.log(data)
                setExpenseCategories(data)
            }).catch(e => {
                console.log("e");
            });
    }

    const getGroupExpenses = (grpId)=>{
        console.log('getGroupExpenses')
        axios.get(`/api/getGroupExpenses/`+grpId)
        .then(res => {
            const data = res.data;
            console.log(data)
            data.forEach( (expens)=>{
               expens.createdAt = moment(expens.createdAt).format("MMM DD");              
            });
            setGroupExpenses(data)
        }).catch(e => {
            console.log("e");
        });
    }

    const openModel = (grpId) => {
        setGrpId(grpId)
        setIsOpen(true)
    }

    const saveExpense= (grpId)=>{
        console.log('grpId: '+grpId)
        console.log('selectedExpenseCat: '+selectedExpenseCat)
        console.log(selectedExpenseCat)
        console.log('selectPaidUser: '+selectPaidUser)
        console.log(selectPaidUser)
        console.log('selectSplitIn: '+selectSplitIn)
        console.log(selectSplitIn)
        console.log('ExpenseDescri: '+ExpenseDescri)
        console.log('ExpenseAmount: '+ExpenseAmount)
        let userData = JSON.parse(localStorage.getItem('loginData'));
        let expenseData = {groupId: grpId,
            expenseCategory: selectedExpenseCat,
            expenseDescription: ExpenseDescri,
            expenseAmount: ExpenseAmount,
            paid_by:selectPaidUser,
            split_betn: selectSplitIn,
            per_person:selectSplitIn.length,
            created_by: userData._id
        }
        if(userData && grpId && grpId!=null){
            axios.post(`/api/addGroupExpense`,expenseData)
            .then(res => {
                const data = res.data;
                console.log(data)
                setIsOpen(false)
                getGroupExpenses(grpId)
            }).catch(e => {
                console.log("e");
            });
        }
        // setIsOpen(false)
    }

    const showModal = (id) => {
        setIsOpen(true);
        console.log('openModel '+id)
      };
      
      const hideModal = () => {
        setIsOpen(false);
      };

    
    const onSelectExpenseCat = (selectedList, selectedItem)=> {
        setSelectedExpenseCat(selectedItem._id)
        console.log(selectedItem._id)
    }

    const onSelectPaidUser = (selectedList, selectedItem)=> {
        setSelectPaidUser(selectedItem._id)
        console.log(selectedItem._id)
    }

    const onSelectSplitIn = (selectedList, selectedItem)=> {
        setSelectSplitIn(selectedList)
        console.log(selectedList)
    }

    useEffect(() => {
        getAllGroups()
        getExpenseCategory()
        getUsersList()
        getGroupExpenses(props.group._id)
    }, []);


return (
    <div className="container pb-4 mb-4">
        <div className='m-4 group_header'>
            <h5>{props.group.group_name}</h5>
            <p>Created by: {props.group.created_by}</p>
            {/* <p>Grp members: {props.group.members.length}</p>
            <p>Grp req Pending: {props.group.request_pending.length}</p> */}
        </div>
        <Button  variant="success" className="add_expense_sticky_button rounded-pill" onClick={()=>openModel(props.group._id)}><MdListAlt size="22" className="mx-1 mb-1" />Add Expense</Button>
        <p className='hr3'></p>
        <>
        {GroupExpenses.length>0?GroupExpenses.map((expense, idx) => (
            <Row>
                <Col xs={1}>{expense.createdAt}</Col>
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
        )):null}
        </>
       <Modal show={isOpen} onHide={hideModal}>
            <Modal.Header>
            <Modal.Title>Add Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className='mb-3'>
                        <Multiselect
                        options={expenseCategories} // Options to display in the dropdown
                        selectedValues={selectedValue} // Preselected value to persist in dropdown
                        onSelect={onSelectExpenseCat} // Function will trigger on select event
                        onRemove={onSelectExpenseCat} // Function will trigger on remove event
                        displayValue="key"
                        groupBy="group"
                        singleSelect
                        />
                    </Row>
                    <Row className='mb-3'>
                        <Form.Control placeholder="Enter a Description" onChange={(e)=>setExpenseDescri(e.target.value)} />
                    </Row>
                    <Row className='mb-3'>
                        <Form.Control placeholder="Amount in ₹" onChange={(e)=>setExpenseAmount(e.target.value)} />
                    </Row>
                    <Row>Paid by</Row>
                    <Row>
                        <Multiselect
                        options={userLists} // Options to display in the dropdown
                        selectedValues={selectedValue} // Preselected value to persist in dropdown
                        onSelect={onSelectPaidUser} // Function will trigger on select event
                        onRemove={onSelectPaidUser} // Function will trigger on remove event
                        displayValue="name"
                        singleSelect
                        />
                    </Row>
                    <Row>and split in</Row>
                    <Row>
                        <Multiselect
                        options={userLists} // Options to display in the dropdown
                        selectedValues={selectedValue} // Preselected value to persist in dropdown
                        onSelect={onSelectSplitIn} // Function will trigger on select event
                        onRemove={onSelectSplitIn} // Function will trigger on remove event
                        displayValue="name"
                        />
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=>hideModal()} >Cancel</Button>
            <Button onClick={(e)=>saveExpense(grpId)} variant="danger">Save</Button>
            </Modal.Footer>
        </Modal>
    </div>
  );
}

export default GroupDashboard;