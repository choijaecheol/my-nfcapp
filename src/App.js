import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Board from './pages/Board';
import Test1 from './pages/Test1';
import Test2 from './pages/Test2';
import Test3 from './pages/Test3';
import Test4 from './pages/Test4';
import Test5 from './pages/Test5';
import { useWeb3React } from '@web3-react/core';
import { connectors } from './lib/connectors';
import { networkParams } from "./lib/networkParams";
import { toHex, truncateAddress } from "./utils";
import SelectWalletModal from "./pages/Modal";
import {
  useDisclosure
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

/*useWeb3React로 꺼내올 수 있는 값들을 살펴보자.

connector  : 현재 dapp에 연결된 월렛의 connector 값
library    : web3 provider 제공
chainId    : dapp에 연결된 account의 chainId
account    : dapp에 연결된 account address
active     : dapp 유저가 로그인 된 상태인지 체크
activate   : dapp 월렛 연결 기능 수행 함수
deactivate : dapp 월렛 연결 해제 수행 함수
*/
function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    library,
    chainId,
    account,
    activate,
    deactivate,
    active
  } = useWeb3React();

  console.log('h' + account);
  console.log('h' + library);
  console.log('h' + chainId);


  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account]
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature]
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, []);

    return (
      <>
        <Router>
            <Navbar bg="warning" expand='sm' className="mb-3">
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
                    <Nav.Link as={Link} to="/test3">test3</Nav.Link>
                    <Nav.Link as={Link} to="/test4">erc20</Nav.Link>
                    <Nav.Link as={Link} to="/test5">test5</Nav.Link>
                    <div>
                        {!active ? (
                          <button onClick={onOpen}>Connect Wallet</button>
                        ) : (
                          <>
                          <button onClick={disconnect}>Disconnect</button>
                          <label >{`Account: ${truncateAddress(account)}`}</label>&nbsp;&nbsp;&nbsp;&nbsp;
                          <label>{`Network ID: ${chainId ? chainId : "No Network"}`}</label>&nbsp;&nbsp;&nbsp;&nbsp;
                          </>
                        )}

                        <label>{`Connection Status: `}</label>
                        {active ? (
                          <CheckCircleIcon color="green" />
                        ) : (
                          <WarningIcon color="#cd5700" />
                        )}
                    </div>
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
              <Route exact path="/test3" element={<Test3 />}  />
              <Route exact path="/test4" element={<Test4 />}  />
              <Route exact path="/test5" element={<Test5 />}  />
            </Routes>
            
        </Router>
        <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
      </>
    );
}

export default App;