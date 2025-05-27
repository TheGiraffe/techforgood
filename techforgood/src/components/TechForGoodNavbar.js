import { Navbar, NavbarBrand, Nav, NavLink, NavItem, NavbarText, NavbarToggler, Collapse } from 'reactstrap';
import { useState } from 'react';
import { useAuth } from '../features/firebase/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function TechForGoodNavbar({accountType, displayName}) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(true)
    const toggle = () => setCollapsed(!collapsed)
    return(
        <Navbar color="dark" dark expand="md" fixed="top">
            <NavbarBrand href="/" style={{ color: "#61ba88" }}>Tech For Good</NavbarBrand>
            <Collapse isOpen={!collapsed} navbar>
                <Nav navbar>
                    {user && (
                        <NavItem>
                            <NavLink href="/dashboard">
                                Dashboard
                            </NavLink>
                        </NavItem>
                    )}
                    <NavItem>
                        <NavLink href="/search">
                            Search for work
                        </NavLink>
                    </NavItem>
                        {!user && (
                        <NavItem>
                            <NavLink href="/signup">
                                Sign Up
                            </NavLink>
                        </NavItem>
                    )
                    }
                    <NavItem>
                        { user ? (
                            <NavLink style={{cursor: "pointer"}} onClick={logout}>Logout</NavLink>
                        ):(
                            <NavLink href="/login">Login</NavLink>
                        )} 
                    </NavItem>
                </Nav>
            </Collapse>
            { displayName && <NavbarText>Welcome Back, {displayName}</NavbarText>}
            <NavbarToggler onClick={toggle} />
        </Navbar>
    )
}