import React from "react";
import { useState } from 'react';
import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Sidenav from './components/Sidenav';

import History from "./pages/History";
import LogIn from "./pages/LogIn";

function NumberButton(props) {	
  return (
    <div className="numberbutton" onClick={() => props.handleClick(props.numberValue)}> 
	    {props.numberValue}
	</div> 
  );
}

function DummyButton(props) {
  return (
    <div className="numberbutton"> 
	    
	</div> 
  );
}

function Operation(props) {
  return (
    <div className="numberbutton" onClick={() => props.handleClick(props.opText)}> 
	    {props.textLabel}
	</div> 
  );
}

function NumberButtons(props) {
  return (
    <div className="numberbuttons"> 
		<div className="numberbuttonrow">
		<NumberButton handleClick={props.handleClick} numberValue="7" />
		<NumberButton handleClick={props.handleClick} numberValue="8" />
		<NumberButton handleClick={props.handleClick} numberValue="9" />
		</div>
		<div className="numberbuttonrow">
		<NumberButton handleClick={props.handleClick} numberValue="4" />
		<NumberButton handleClick={props.handleClick} numberValue="5" />
		<NumberButton handleClick={props.handleClick} numberValue="6" />
		</div>
		<div className="numberbuttonrow">
		<NumberButton handleClick={props.handleClick} numberValue="1" />
		<NumberButton handleClick={props.handleClick} numberValue="2" />
		<NumberButton handleClick={props.handleClick} numberValue="3" />
		</div>
		<div className="numberbuttonrow">
		<NumberButton handleClick={props.handleClick} numberValue="." />
		<NumberButton handleClick={props.handleClick} numberValue="0" />		
		<EqualButton handleClick={props.handleEqual} />
		</div>
	</div> 
  );
}




function Operations(props) {
  return (
    <div className="operations">
		<Operation textLabel="+" opText='addition' handleClick={props.handleClick}/>
		<Operation textLabel="-" opText='subtraction' handleClick={props.handleClick}/>
		<Operation textLabel="x" opText='multiplication' handleClick={props.handleClick}/>
		<Operation textLabel="/" opText='division' handleClick={props.handleClick}/>
	</div>
  );
}

function EqualButton(props) {
  return (
    <div className="numberbutton" onClick={props.handleClick}>
		=
	</div>
  );
}

function PreResultBox(props) {	
  return (
    <div className="resultbox">
		<div className="preresultbox">
			{props.value}
		</div>
		<div className="currentoperation">
			{props.operation}
		</div>	
	</div>

  );
}

function ResultBox(props) {	
  return (
    <div className="resultbox">
		{props.value}
	</div>
  );
}

function CalculatorControls(props) {
  return (
    <div className="calculatorcontrols">
		<NumberButtons handleClick={props.handleClick} handleEqual={props.handleEqual}/>
		<Operations handleClick={props.handleClick} />
	</div>
  );
}

function Calculator(props) {
	const [resultValue, setResultValue] = useState('');
	const [preResultValue, setPreResultValue] = useState('');
	const [currentOperation, setCurrentOperation] = useState('');
	
	var opArray = {'addition':'+','subtraction':'-','multiplication':'x','division':'/'}
	
	function handleEqual() {
		if (preResultValue != '' && currentOperation != '' && resultValue != '') {
		try {
			console.log(currentOperation)
			fetch('http://localhost:8099/calculator/v1/operations/' + currentOperation,
			{
				method:'POST',
				headers: {
					'content-type': 'application/json',	
					'x-access-token' : props.token
				},
				body: JSON.stringify({"firstOperand":preResultValue,"secondOperand":resultValue})
			})
            .then(response => response.json())
            .then(data => {
				console.log(data); 
				setCurrentOperation('');
				setPreResultValue('');
				props.updateBalance(String(data.balance));
				setResultValue(String(data.value));
			}).catch(error => {
                console.log(error);
            })
		} catch (e){
			console.log(e);
		}
		}
	}
	
	function handleClick(value) {
		if (value == '0' || value == '1' || value == '2' || value == '3' || value == '4' || value == '5' || value == '6' || value == '7' || value == '8' || value == '9') {
			setResultValue(resultValue + value);
		}
		if (value == '.') {
			if (!resultValue.includes('.')){
				setResultValue(resultValue + value);
			}
		}
		if (value == 'addition' || value == 'subtraction' || value == 'multiplication' || value == 'division' || value == 'square_root'){
			handleEqual();
			if (preResultValue == '' && resultValue != '' ) {
				setPreResultValue(resultValue);
				setResultValue('');
				setCurrentOperation(value);
			}
			if (resultValue == '' && preResultValue != '' ) {
				setCurrentOperation(value);
			}
		}
	}
	
  return (
    <div className="calculator">
		<CalculatorControls handleClick={handleClick} handleEqual={handleEqual}/>
		<PreResultBox value={preResultValue} operation={opArray[currentOperation] } />
		<ResultBox value={resultValue}/>
	</div>
  );
}


  
function App() {
	const [userToken, setUserToken] = useState('');
	const [userCredits, setUserCredits] = useState(0);
	
	function updateBalance(newBalance){
		setUserCredits(newBalance);
	}
	
	function tryLogin(username,password) {
		try {
			fetch('http://localhost:8099/auth/v2/login/',
			{
				method:'POST',
				headers: {
					'content-type': 'application/json',	
				},
				body: JSON.stringify({"username":username,"password":password})
			})
			.then(response => response.json())
			.then(data => {
				console.log(data); 
				setUserToken(data.token);
				setUserCredits(data.balance);
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
