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

function AddGroup() {

    const [createGroup, setCreateGroup] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedList, setSelectedList] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [options, setOptions] = useState([]);

    const getUsersList = () => {
        console.log('getData')
        let userData = JSON.parse(localStorage.getItem('loginData'));
        if(userData && userData.email != undefined && userData._id != null){
            axios.get(`/api/getUsers/`+userData._id)
            .then(res => {
                let data = res.data;
                console.log(data)
                data = data.filter((user)=> user._id != userData._id)
                setOptions(data)
            }).catch(e => {
                console.log("e");
            });
        }
    }

    useEffect(() => {
        getUsersList();
    }, []);


    const addGroup = () => {
        console.log('restrictttttttttted')
        let userData = JSON.parse(localStorage.getItem('loginData'));
        if(userData && userData.email != undefined && userData.email != null){
            axios.post(`/api/addGroup`,{'group_name':groupName,'created_by':userData.email,'requests':selectedList})
            .then(res => {
                const data = res.data;
                console.log(data)
                document.getElementById('GroupsLink').click();
            }).catch(e => {
                console.log("e");
            });
        }
    }

    const onSelect = (selectedList, selectedItem)=> {
        setSelectedList(selectedList)
        console.log(selectedList)
    }
    
    const onRemove = (selectedList, removedItem)=> {
        console.log(selectedList)
        setSelectedList(selectedList)
    }

  return (
    <div className="container m-4">
        <Container>
            <h2>Create Group</h2>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Group name</Form.Label>
                    <Form.Control type="text" placeholder="Group Name" id="group-name" onChange={(e)=>setGroupName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Multiselect
                    options={options} // Options to display in the dropdown
                    selectedValues={selectedValue} // Preselected value to persist in dropdown
                    onSelect={onSelect} // Function will trigger on select event
                    onRemove={onRemove} // Function will trigger on remove event
                    displayValue={"email"} // Property name to display in the dropdown options
                    />
                </Form.Group>
                <Button type='submit' onClick={()=>addGroup()}>Submit</Button>
            </Form>
        </Container>
    </div>
  );
}

export default AddGroup;