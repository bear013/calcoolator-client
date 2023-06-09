import config from './config/config'
import React from "react";
import { useState } from 'react';
import './App.css';
import Calculator from './pages/Calculator'
import History from "./pages/History";
import LogIn from "./pages/LogIn";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import Sidenav from './components/Sidenav';

const WebserviceProtocol = config.WebserviceProtocol
const WebserviceHost = config.WebserviceHost
const WebservicePort = config.WebservicePort

function App() {
	const [userToken, setUserToken] = useState('');
	const [userCredits, setUserCredits] = useState(0);
	
	function updateBalance(newBalance){
		setUserCredits(newBalance);
	}
	
	function tryLogin(username,password) {
		try {
			fetch(`${WebserviceProtocol}://${WebserviceHost}:${WebservicePort}/auth/v2/login/`,
			{
				method:'POST',
				headers: {
					'content-type': 'application/json',	
				},
				body: JSON.stringify({"username":username,"password":password})
			})
			.then(response => response.json())
			.then(resp => {
				var data = resp.data
				setUserToken(data.token);
				setUserCredits(data.balance);
				alert(`Welcome,${username}!`);
			}).catch(error => {
				console.log(error);
			})
		} catch (e){
			console.log(e);
		}
	}


  return (
    <div className="App">
      <Sidenav credits={userCredits}/>
      <main>
        <Routes>
          <Route path="/" element={<LogIn tryLogin={tryLogin}/>}/>
          <Route path="/calculator" element={<Calculator token={userToken} updateBalance={updateBalance}/>} />
		  <Route path="/history" element={<History token={userToken} />} />
		  <Route path="/login" element={<LogIn tryLogin={tryLogin}/>}  />
        </Routes>
      </main>		
    </div>
  );

}

export default App;
