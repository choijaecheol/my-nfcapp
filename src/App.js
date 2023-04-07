import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Board from './pages/Board';
import Test1 from './pages/Test1';
import Test2 from './pages/Test2';

function App() {
    return (
        <Router>
            <Navbar bg="primary" expand='sm' className="mb-3">
              <Container fluid>
                <Navbar.Brand href="/">NFT Market</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse>
                  <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">홈</Nav.Link>
                    <Nav.Link as={Link} to="/profile">profile</Nav.Link>
                    <Nav.Link as={Link} to="/board">board</Nav.Link>
                    <Nav.Link as={Link} to="/test1">test1</Nav.Link>
                    <Nav.Link as={Link} to="/test2">test2</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/board" element={<Board />} />
              <Route exact path="/test1" element={<Test1 />}  />
              <Route exact path="/test2" element={<Test2 />}  />
            </Routes>
            
        </Router>
    );
}

export default App;