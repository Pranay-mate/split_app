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

function GroupsList() {
    const [allgroups, setAllGroups] = useState([]);
    const [openedGroup, setOpenGroup] = useState([]);

    const [selectedGroup, setSelectedGroup] = useState([]);
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
    let userData = JSON.parse(localStorage.getItem('loginData'));

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
                getRequestedGroup()
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const declineGrpReq = (grpId) => {
        console.log('declineGrpReq')
        let userData = JSON.parse(localStorage.getItem('loginData'));
        // console.log('getLoginUser: '+userData._id)
        if(grpId && grpId!==undefined && grpId!==null && userData){
            axios.get(`/api/declineGrpReq/`+userData._id+`/`+grpId)
            .then(res => {
                const data = res.data;
                console.log(data)
                getRequestedGroup()
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
                console.log(data)
                setAllGroups(data)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const openGroup = (grpId) => {
        let data = allgroups.filter((group)=>group._id === grpId)
        setOpenGroup(data)
    }

    const getAllGroupExpenses = ()=>{
        console.log('getAllGroupExpenses')
        if(userData && userData._id!=undefined && userData._id!=null){
            axios.get(`/api/getAllGroupExpenses/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
                // data.forEach( (expens)=>{
                // expens.createdAt = moment(expens.createdAt).format("MMM DD");              
                // });
                // setGroupExpenses(data)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    useEffect(() => {
        getAllGroups()
        getExpenseCategory()
        getUsersList()
        getRequestedGroup();
        getAllGroupExpenses();
    }, []);

    const getUsersList = () => {
        console.log('getUsersList')
        let userData = JSON.parse(localStorage.getItem('loginData'));
        if(userData && userData.email != undefined && userData._id != null){
            console.log(userData._id)
            axios.get(`/api/getUsers/`+userData._id)
            .then(res => {
                const data = res.data;
                console.log(data)
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

    const openModel = () => {
        setIsOpen(true)
    }

    const saveExpense= ()=>{
        console.log('grpId: '+selectedGroup)
        console.log('selectedExpenseCat: '+selectedExpenseCat)
        console.log(selectedExpenseCat)
        console.log('selectPaidUser: '+selectPaidUser)
        console.log(selectPaidUser)
        console.log('selectSplitIn: '+selectSplitIn)
        console.log(selectSplitIn)
        console.log('ExpenseDescri: '+ExpenseDescri)
        console.log('ExpenseAmount: '+ExpenseAmount)
        let userData = JSON.parse(localStorage.getItem('loginData'));
        let expenseData = {groupId: selectedGroup,
            expenseCategory: selectedExpenseCat,
            expenseDescription: ExpenseDescri,
            expenseAmount: ExpenseAmount,
            paid_by:selectPaidUser,
            split_betn: selectSplitIn,
            per_person:selectSplitIn.length,
            created_by: userData._id
        }
        if(userData && selectedGroup.length>0){
            axios.post(`/api/addGroupExpense`,expenseData)
            .then(res => {
                const data = res.data;
                console.log(data)
                setIsOpen(false)
            }).catch(e => {
                console.log("e");
            });
        }else{
            console.log('group not selected')
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

    const onSelectGroup = (selectedList, selectedItem)=>{
        setSelectedGroup(selectedItem._id);
        console.log(selectedItem._id)
    }
        
return (
    <div className="pb-4">
        {groupsRequests.length>0&&openedGroup.length===0?groupsRequests.map((group, idx) => (
            <Row xs={1} className="m-4">
                <Card className='' id={group._id} style={{border:"1px solid white"}} >
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
                            <Col xs="3" className="text-center my-auto">
                                <BiCheckCircle className='mx-4 icon' color='green' onClick={()=>acceptGrpReq(group._id)} size="40" />
                                <MdOutlineCancel className='mx-4 icon' color='red' onClick={()=>declineGrpReq(group._id)} size="40" />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>
        )): null}
        {openedGroup.length===0?
        <>
        {allgroups.length>0?allgroups.map((group, idx) => (
            <Row xs={1} className="m-4">
                <Card className='' id={group._id}  >
                    <Card.Body>
                        <Row>
                            <Col xs="3" className="my-auto" onClick={(e)=>openGroup(group._id)}>
                            {/* <i class={cardData.Campaign_icon} style={{fontSize:'4em'}}></i> */}
                            {group.group_name}
                            </Col>
                            <Col xs className="my-auto" onClick={(e)=>openGroup(group._id)}>
                                <Row><h6>{group.group_name}</h6></Row>
                                <Row><p>{group.group_name}</p></Row>
                            </Col>
                            <Col xs="3" className="text-center my-auto">
                                {/* <Button  variant="success" className="rounded-pill" onClick={()=>openModel()}><MdListAlt size="22" className="mb-1 mr-1" />Add Expense</Button> */}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>  
        )): "Create Group"}
        <Modal show={isOpen} onHide={hideModal}>
            <Modal.Header>
            <Modal.Title>Add Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className='mb-3'>
                        <Multiselect
                        options={allgroups} // Options to display in the dropdown
                        selectedValues={selectedValue} // Preselected value to persist in dropdown
                        onSelect={onSelectGroup} // Function will trigger on select event
                        onRemove={onSelectGroup} // Function will trigger on remove event
                        displayValue="group_name"
                        placeholder='Select group'
                        singleSelect
                        />
                    </Row>
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
            <Button onClick={(e)=>saveExpense()} variant="danger">Save</Button>
            </Modal.Footer>
        </Modal>
       </>
       :
       <>
       <div className='group_view_header' ></div>
       <IoArrowBackOutline className="groupBackIcon" onClick={()=>setOpenGroup([])} size="2.5em" />
       <GroupDashboard group={openedGroup[0]}></GroupDashboard>
       </>
        }
        <Button  variant="success" className="add_expense_sticky_button rounded-pill" onClick={()=>openModel()}><MdListAlt size="22" className="mx-1 mb-1" />Add Expense</Button>
    </div>
  );
}

export default GroupsList;