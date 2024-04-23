import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { IoAddOutline } from 'react-icons/io5';
import { Link, Outlet } from 'react-router-dom';

function Menu() {
    return (
        <>
            {/* Navigation bar */}
            <Navbar bg="dark" variant="dark" fixed="bottom" className='border-top'>
                <Nav className="mx-auto p-0">
                    {/* Groups link */}
                    <Nav.Link className="mx-2" activeStyle={{ color: 'red' }}>
                        <Link to="/" exact id="GroupsLink">Groups</Link>
                    </Nav.Link>
                    {/* Activity link */}
                    <Nav.Link className="mx-2">
                        <Link exact to="/activity">Activity</Link>
                    </Nav.Link>
                    {/* Payment link */}
                    <Nav.Link className="mx-2">
                        <Link exact to="/payments">Payment</Link>
                    </Nav.Link>
                    {/* Account link */}
                    <Nav.Link className="mx-2">
                        <Link exact to="/account">Account</Link>
                    </Nav.Link>
                </Nav>
            </Navbar>
            {/* Outlet for nested routes */}
            <Outlet />
        </>
    );
}

export default Menu;
