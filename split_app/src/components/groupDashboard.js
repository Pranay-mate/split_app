import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useState, useEffect,useRef } from 'react';
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from './loader';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

function GroupDashboard(props) {
    console.log(props.group)
    const [allgroups, setAllGroups] = useState([]);
    const [openedGroup, setOpenGroup] = useState('');
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedMemberValue, setSelectedMemberValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isMemberModalOpen, setMemberModalOpen] = useState(false);
    const [grpId, setGrpId] = useState("");
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [userLists, setUserList] = useState([]);
    const [memberLists, setMemberLists] = useState([]);
    const [selectedMemberLists, setSelectedMemberLists] = useState([]);
    const [selectedExpenseCat, setSelectedExpenseCat] = useState([]);
    const [selectPaidUser, setSelectPaidUser] = useState("");
    const [selectSplitIn, setSelectSplitIn] = useState([]);

    const [ExpenseDescri, setExpenseDescri] = useState("");
    const [ExpenseAmount, setExpenseAmount] = useState("");
    const [GroupExpenses, setGroupExpenses] = useState("");
    const [UserAndId, setUserAndIds] = useState([]);
    const [expenseCategoryIdAndIcon, setExpenseCategoryIdAndIcon] = useState([]);
    const [displayLoader, setDisplayLoader] = useState(true);
    let userData = JSON.parse(localStorage.getItem('loginData'));
    const [showToolTip, setShowToolTip] = useState(false);
    const target = useRef(null);

   
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
                let membersValue = data.filter((user)=> !props.group.members.includes(user._id) && user.email!== userData.email)
                setMemberLists(membersValue)
                setUserList(data)
            }).catch(e => {
                console.log("e");
            });
        }
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
        console.log(grpId)
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
        }else{
            console.log('check fields')
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

      const showMembersModal = () => {
        setMemberModalOpen(true);
        console.log('showMembersModal')
      };
    
      const hideMemberModal = () =>{
        setMemberModalOpen(false)
      }

    
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

    const onSelectMembers = (selectedList, selectedItem)=> {
        setSelectedMemberLists(selectedList)
        console.log(selectedList)
    }

    useEffect(() => {
        getAllGroups()
        getExpenseCategory()
        getUsersList()
        getGroupExpenses(props.group._id)
        setTimeout(()=>{setDisplayLoader(false)},2000)
    }, []);

    const getExpenseCategory = ()=>{
        console.log('getExpenseCategory')
        axios.get(`/api/getExpenseCategory`)
            .then(res => {
                const data = res.data;
                console.log(data)
                setExpenseCategories(data)
                let CategoryIdAndIcon = [];
                data.map((category)=>{
                    CategoryIdAndIcon[category._id] = category.icon;
                })
                setExpenseCategoryIdAndIcon(CategoryIdAndIcon)
            }).catch(e => {
                console.log("e");
            });
    }

    const addMembers = (grpId)=>{
        console.log(grpId)
        console.log(selectedMemberLists)
        if(selectedMemberLists.length>0){
            axios.post(`/api/addMembers/`+grpId,selectedMemberLists)
            .then(res => {
                const data = res.data;
                console.log(data)
                
            }).catch(e => {
                console.log("e");
            });
        }else{
            console.log('Please add members')
        }
    }
    


return (
    <div className="container py-4 my-4">
        {!displayLoader?
        <>
        <div className='m-4 mb-1 group_header'>
            <Row className="my-1">
                <Col>
                    <h5>{props.group.group_name}
                        <a className='mx-1' ref={target} onClick={() => setShowToolTip(!showToolTip)} style={{color:"grey"}}>
                            <FontAwesomeIcon icon="fas fa-info-circle" />
                        </a>
                    </h5>
                </Col>
                {props.group.created_by === userData.email?
                    <Col style={{textAlign:'right'}}>
                        <Button variant="outline-secondary" onClick={()=>showMembersModal()}>Add member</Button>
                    </Col>
                :null}
            </Row>
            <Row>
                <p>Created by: {props.group.created_by}</p>
            </Row>
            
            <Overlay target={target.current} show={showToolTip} placement="right">
                <Tooltip id="overlay-example">
                    <Container>
                        {props.group.members.length>0?
                        <Row>
                            Members:
                            {props.group.members.map((member)=>(
                            <p className='m-0'>{UserAndId[member]}</p>
                            ))}
                        </Row>
                        :null}
                        {props.group.request_pending.length>0?
                        <Row>
                            Pending Request:
                            {props.group.request_pending.map((member)=>(
                            <p className='m-0'>{UserAndId[member]}</p>
                            ))}
                        </Row>
                        :null}

                    </Container>
                </Tooltip>
            </Overlay>
        </div>
        <Button  variant="success" className="add_expense_sticky_button within_group_btn rounded-pill" onClick={()=>openModel(props.group._id)}><MdListAlt size="22" className="mx-1 mb-1" />Add Expense</Button>
        <p className='hr3'></p>
        <>
        {GroupExpenses.length>0?GroupExpenses.map((expense, idx) => (
            <Row className='my-4'>
                <Col xs={2} className="my-auto text-center">{ moment(expense.createdAt).format("MMM DD")}</Col>
                <Col xs={2} className="my-auto text-center"><FontAwesomeIcon icon={expenseCategoryIdAndIcon[expense.expenseCategory]}  size="2x" /></Col>
                <Col xs={5} className="my-auto">
                    <Row><h6 className="mb-0 text-capitalize mid_small">{expense.expenseDescription}</h6></Row>
                    <Row><p className="mb-0 text_small">{UserAndId[expense.paid_by]} paid ₹{expense.expenseAmount}</p></Row>
                </Col>
                <Col xs={3} className="my-auto pl-0" style={{"textAlign":"end"}}>

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
                    <Row className='mb-3 mx-1'>
                        <Form.Control placeholder="Enter a Description" onChange={(e)=>setExpenseDescri(e.target.value)} />
                    </Row>
                    <Row className='mb-3  mx-1'>
                        <Form.Control placeholder="Amount in ₹" onChange={(e)=>setExpenseAmount(e.target.value)} />
                    </Row>
                    <Row>Paid by</Row>
                    <Row  className='mb-3'>
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
        <Modal show={isMemberModalOpen} onHide={hideMemberModal}>
            <Modal.Header>
                <Modal.Title>Add Members</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Multiselect
                        options={memberLists} // Options to display in the dropdown
                        selectedValues={selectedMemberValue} // Preselected value to persist in dropdown
                        onSelect={onSelectMembers} // Function will trigger on select event
                        onRemove={onSelectMembers} // Function will trigger on remove event
                        displayValue="name"
                        />
                    </Row>
                    
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=>hideMemberModal()} >Cancel</Button>
            <Button onClick={(e)=>addMembers(props.group._id)} variant="danger">Save</Button>
            </Modal.Footer>
        </Modal>
        </>
        :<Loader></Loader>}
    </div>
  );
}

export default GroupDashboard;