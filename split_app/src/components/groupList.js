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
import {AiOutlineUsergroupAdd} from 'react-icons/ai'
import Loader from './loader'

function GroupsList() {
    const [allgroups, setAllGroups] = useState([]);
    const [openedGroup, setOpenGroup] = useState([]);
    
    const [options, setOptions] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedGroupValue, setSelectedGroupValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenGroupModal, setGroupModalOpen] = useState(false);
    const [groupSelected, setGroupSelected] = useState(false);
    const [grpId, setGrpId] = useState("");
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [userLists, setUserList] = useState([]);
    const [selectedExpenseCat, setSelectedExpenseCat] = useState([]);
    const [selectPaidUser, setSelectPaidUser] = useState("");
    const [selectSplitIn, setSelectSplitIn] = useState([]);

    const [ExpenseDescri, setExpenseDescri] = useState("");
    const [ExpenseAmount, setExpenseAmount] = useState("");
    const [groupsRequests, setGroupsRequests] = useState([]);


    const [createGroup, setCreateGroup] = useState(false);
    const [selectedList, setSelectedList] = useState([]);
    const [groupName, setGroupName] = useState('');

    const [groupExpenseDivision, setAllGroupExpenseDivsion] = useState([]);
    const [UserAndId, setUserAndIds] = useState([]);
    const [displayLoader, setDisplayLoader] = useState(true);


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
        let userData = JSON.parse(localStorage.getItem('loginData'));
        console.log(userData)
        // console.log('getLoginUser: '+userData._id)
        if(userData && userData._id!=undefined && userData._id!=null){
            axios.get(`/api/getAllGroups/`+userData._id)
            .then(res => {
                const data = res.data;
        console.log('getAllGroups')
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
        getAllGroupExpenseDivsion();
        setTimeout(()=>{setDisplayLoader(false)},2000)
    }, []);

    const getUsersList = () => {
        // let alreadyMemberOrRequestedUser = props.group.members.map((m)=> m._id)
        // alreadyMemberOrRequestedUser = [...alreadyMemberOrRequestedUser, ...props.group.request_pending.map((m)=> m._id)];
         
        console.log('getUsersList')
        axios.get(`/api/getUsers/`)
        .then(res => {
            let data = res.data;
            console.log('getUsers')
            console.log(data)
            // data = data.filter((user)=> !alreadyMemberOrRequestedUser.includes(user._id))
            console.log('afterFilter')
            console.log(data)
            setUserList(data)
        }).catch(e => {
            console.log(e);
            // handleResponse(e.message, 'danger');
        });
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
    
    const getAllGroupExpenseDivsion = ()=>{
        if(userData && userData._id!=undefined && userData._id!=null){
            axios.get(`/api/getAllGroupExpenseDivsion/`+userData._id)
            .then(res => {
                const data = res.data;
        console.log('getAllGroupExpenseDivsion')
        console.log(data)
                
                let UserExpense = {};
                for (let [grpId, arrData] of Object.entries(data)) {
                    console.log(`${grpId}: ${arrData}`);
                    let arr = [{"lent":0},{"borrowed":0}]
                    arrData.forEach(element => {
                        if(element.sender== userData._id){
                            arr[1].borrowed+= element.amount
                        }else if(element.receiver == userData._id){
                            arr[0].lent+= element.amount
                        }
                    });
                    UserExpense[grpId] = arr
                }
                console.log(UserExpense)
                setAllGroupExpenseDivsion(UserExpense)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const showModal = (id) => {
        setIsOpen(true);
        console.log('openModel '+id)
      };
      
      const hideModal = () => {
        setIsOpen(false);
      };

      const showGroupModal = () => {
        setGroupModalOpen(true);
        console.log('openGroupModel ')
      };

      const hideGroupModal = () => {
        setGroupModalOpen(false);
      };

    
    const onSelectExpenseCat = (selectedList, selectedItem)=> {
        setSelectedExpenseCat(selectedItem._id)
        console.log(selectedItem._id)
    }

    const [groupSelectionChange, setGroupSelectionChange] = useState(0);

    const onSelectGroup = (selectedList, selectedItem) => {
        setSelectedGroup(selectedItem._id);
        setUserList(selectedItem.members);
        setGroupSelected(true);
        setGroupSelectionChange(groupSelectionChange + 1); // Increment the group selection change
    };

    const onSelectPaidUser = (selectedList, selectedItem) => {
        setSelectPaidUser(selectedItem._id);
        console.log(selectedItem._id);
    };

    const onSelectSplitIn = (selectedList, selectedItem) => {
        setSelectSplitIn(selectedList);
        console.log(selectedList);
    };

    useEffect(() => {
        // Reset selected users whenever group selection changes
        setSelectPaidUser("");
        setSelectSplitIn([]);
        console.log('selectPaidUser')
        console.log(selectPaidUser)
    }, [groupSelectionChange]);

    const addGroup = () => {
        console.log('restrictttttttttted');
        let userData = JSON.parse(localStorage.getItem('loginData'));
        if (userData && userData.email != undefined && userData.email != null) {
            axios.post(`/api/addGroup`, {'group_name': groupName, 'created_by': userData.email, 'requests': selectedList})
            .then(res => {
                const data = res.data;
                console.log(data);
                setGroupModalOpen(false);
                getAllGroups();
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    console.log(error.response.data.statusText); // Log the error message
                    // Display the error message to the user or handle it accordingly
                } else {
                    console.error(error); // Log other errors
                }
            });
        }
    };
    

    const onSelect = (selectedList, selectedItem)=> {
        setSelectedList(selectedList)
        console.log(selectedList)
    }
    
    const onRemove = (selectedList, removedItem)=> {
        console.log(selectedList)
        setSelectedList(selectedList)
    }

    const openCreateGroupModel = () =>{
        getUsersList()
        setGroupModalOpen(true)
    }

return (
    <div className="pb-4">
        {!displayLoader?
        <>
        {groupsRequests.length>0&&openedGroup.length===0?groupsRequests.map((group, idx) => (
            <Row xs={1} className="m-4">
                <Card className='' id={group._id} style={{border:"1px solid white"}} >
                    <Card.Body>
                        <Row>
                            <Col xs="3" className="my-auto">
                            {/* <i class={cardData.Campaign_icon} style={{fontSize:'4em'}}></i> */}
                                <div className={'avatar-'+idx} style={{"width":"40px","height":"40px", borderRadius:"2em"}}></div>
                            </Col>
                            <Col xs className="my-auto">
                                <Row><h6>{group.group_name}</h6></Row>
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
        <div className="m-4 pb-4">
        {allgroups.length>0?allgroups.map((group, idx) => (
            <Row xs={1} className="my-2">
                <Card className='' id={group._id}  onClick={(e)=>openGroup(group._id)}>
                    <Card.Body>
                        <Row>
                            <Col xs="2" className="my-auto text-center">
                            {/* <i class={cardData.Campaign_icon} style={{fontSize:'4em'}}></i> */}
                                <div className={'avatar-'+idx} style={{"width":"40px","height":"40px", borderRadius:"2em"}}></div>
                            </Col>
                            <Col xs="5" className="my-auto">
                                <Row><h6>{group.group_name}</h6></Row>
                            </Col>
                            <Col xs="5" className="my-auto" style={{"textAlign":"end"}}>
                                {groupExpenseDivision[group._id] !== undefined?groupExpenseDivision[group._id].map((expenseData,i)=>(
                                    <>
                                    {expenseData.lent!==undefined && expenseData.lent>0
                                    ?<><p className='mb-0'>you lent</p>
                                        <p>₹{parseInt(expenseData.lent).toFixed(2)}</p>
                                    </>
                                    :null}

                                    {expenseData.borrowed!==undefined && expenseData.borrowed>0?
                                    <><p className='mb-0'>you borrowed </p>
                                    <p>₹{parseInt(expenseData.borrowed).toFixed(2)}</p>
                                    </>
                                    :null
                                    }
                                    </>
                                ))
                                :
                                <p className=''>Settled up</p>
                                }
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>  
        )): null}
        <div className='text-center'>
            <Button variant='outline-secondary' onClick={()=> openCreateGroupModel()}><AiOutlineUsergroupAdd size={22} className='mb-1' />Create New Group</Button>
        </div>
        {/* <Modal show={isOpen} onHide={hideModal} style={{color:"black"}}>
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
                    {
                        groupSelected ? (
                            <>
                                <Row className='mx-1'>
                                    Paid by
                                </Row>
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
                                <Row className='mx-1'>
                                    and split in
                                </Row>
                                <Row>
                                    <Multiselect
                                    options={userLists} // Options to display in the dropdown
                                    selectedValues={selectedValue} // Preselected value to persist in dropdown
                                    onSelect={onSelectSplitIn} // Function will trigger on select event
                                    onRemove={onSelectSplitIn} // Function will trigger on remove event
                                    displayValue="name"
                                    />
                                </Row>
                            </>
                        ) : null
                    }
                    
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=>hideModal()} >Cancel</Button>
            <Button onClick={(e)=>saveExpense()} variant="danger">Save</Button>
            </Modal.Footer>
        </Modal> */}
        {/* Add Group Modal */}
        <Modal show={isOpenGroupModal} onHide={hideGroupModal}>
            <Modal.Header>
            <Modal.Title>Create New Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Control type="text" placeholder="Group Name" id="group-name" onChange={(e)=>setGroupName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Multiselect
                        options={userLists} // Options to display in the dropdown
                        selectedValues={selectedGroupValue} // Preselected value to persist in dropdown
                        onSelect={onSelect} // Function will trigger on select event
                        onRemove={onRemove} // Function will trigger on remove event
                        displayValue={"email"} // Property name to display in the dropdown options
                        placeholder="Select Members"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>hideGroupModal()} >Cancel</Button>
                <Button type='submit' onClick={()=>addGroup()}>Submit</Button>
            </Modal.Footer>
        </Modal>

       </div>
       :
       <div>
        <div className='group_view_header'>
            <IoArrowBackOutline className="groupBackIcon m-2" onClick={()=>setOpenGroup([])} size="2.5em" />
        </div>
        <GroupDashboard group={openedGroup[0]}></GroupDashboard>
       </div>
        }
        {/* <Button  variant="success" className="add_expense_sticky_button rounded-pill" onClick={()=>openModel()}><MdListAlt size="22" className="mx-1 mb-1" />Add Expense</Button> */}
        </>
        :<Loader></Loader>}
    </div>
  );
}

export default GroupsList;