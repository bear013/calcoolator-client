import config from '../config/config'
import { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import styles from './calculator.module.css' ;
import BackspaceIcon from '@mui/icons-material/Backspace';

const WebserviceProtocol = config.WebserviceProtocol
const WebserviceHost = config.WebserviceHost
const WebservicePort = config.WebservicePort

function NumberButton(props) {	
  return (
    <Button variant="outlined" minWidth='0' className="numberbutton" onClick={() => props.handleClick(props.numberValue)}> 
	    {props.numberValue}
	</Button> 
  );
}

function Operation(props) {
  return (
    <Button variant="outlined" className="numberbutton" onClick={() => props.handleClick(props.opText)}> 
	    {props.textLabel}
	</Button> 
  );
}


function EqualButton(props) {
  return (
    <Button variant="outlined" className="numberbutton" onClick={props.handleClick}>
		=
	</Button>
  );
}

function EraseButton(props) {
  return (
    <Button variant="outlined" className="numberbutton" onClick={props.handleClick}>
		<BackspaceIcon />
	</Button>
  );
}

function NumberButtons(props) {
  return (
    <Grid container spacing={0} xs={12} className="numberbuttons"> 
		<Grid item xs={12} className="numberbuttonrow">
		<NumberButton handleClick={props.handleClick} numberValue="7" />
		<NumberButton handleClick={props.handleClick} numberValue="8" />
		<NumberButton handleClick={props.handleClick} numberValue="9" />
		<Operation textLabel="+" opText='addition' handleClick={props.handleClick}/>
		<Operation textLabel="-" opText='subtraction' handleClick={props.handleClick}/>
		</Grid>
		<Grid item xs={12} className="numberbuttonrow">
		<NumberButton handleClick={props.handleClick} numberValue="4" />
		<NumberButton handleClick={props.handleClick} numberValue="5" />
		<NumberButton handleClick={props.handleClick} numberValue="6" />
		<Operation textLabel="x" opText='multiplication' handleClick={props.handleClick}/>
		<Operation textLabel="/" opText='division' handleClick={props.handleClick}/>
		</Grid>
		<Grid item xs={12} className="numberbuttonrow">
		<NumberButton handleClick={props.handleClick} numberValue="1" />
		<NumberButton handleClick={props.handleClick} numberValue="2" />
		<NumberButton handleClick={props.handleClick} numberValue="3" />
		<Operation textLabel="√" opText='square_root' handleClick={props.handleClick}/>
		<Operation textLabel="Ran" opText='random_string' handleClick={props.handleClick}/>
		</Grid>
		<Grid item xs={12} className="numberbuttonrow">
		<NumberButton handleClick={props.handleClick} numberValue="." />
		<NumberButton handleClick={props.handleClick} numberValue="0" />
		<EqualButton handleClick={props.handleEqual} />
		<EraseButton handleClick={props.handleErase} />
		
		</Grid>
	</Grid> 
  );
}

function PreResultBox(props) {	
  return (
    <div className="resultbox">
		<Typography component="h1" variant="h7" className="preresultbox">
			{props.value}
		</Typography>
		<Typography component="h1" variant="h7" className="currentoperation">
			{props.operation}
		</Typography>	
	</div>

  );
}

function ResultBox(props) {	
  return (
    <Typography component="h1" variant="h7" className="resultbox">
		{props.value}
	</Typography>
  );
}

function CalculatorControls(props) {
  return (
    <div className="calculatorcontrols">
		<NumberButtons handleClick={props.handleClick} handleEqual={props.handleEqual} handleErase={props.handleErase}/>
		
	</div>
  );
}

export default function Calculator(props) {
	const [resultValue, setResultValue] = useState('');
	const [preResultValue, setPreResultValue] = useState('');
	const [currentOperation, setCurrentOperation] = useState('');
	
	var opArray = {'addition':'+','subtraction':'-','multiplication':'x','division':'/'}
	var instantOpArray = {'random_string':"R"}
	var oneOperandOpArray = {'square_root':'√'}
	
	var immediateOp = ''
	
	function handleErase() {
		setResultValue('')	
	}
	
	function handleEqual() {
		console.log(currentOperation)
		var currentOp = currentOperation
		if (immediateOp != '')
			currentOp = immediateOp
		if (preResultValue != '' && currentOp != '' && resultValue != '' || (currentOp in instantOpArray) || (currentOp in oneOperandOpArray && preResultValue != '')  ) {
		try {
			console.log(currentOp)
			fetch(`${WebserviceProtocol}://${WebserviceHost}:${WebservicePort}/calculator/v1/operations/` + currentOp,
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
				immediateOp = ''
			}).catch(error => {
                console.log(error);
            })
		} catch (e){
			console.log(e);
		}
		}
	}
	
	
	
	function handleClick(value) {
		var numbers = ['0','1','2','3','4','5','6','7','8','9']
		if (value in numbers && !(currentOperation in oneOperandOpArray)){
			setResultValue(resultValue + value);
		}
		if (value == '.' && !(currentOperation in oneOperandOpArray)) {
			if (!resultValue.includes('.')){
				setResultValue(resultValue + value);
			}
		}
		if (value in opArray || value in oneOperandOpArray){
			//handleEqual();
			if (preResultValue == '' && resultValue != '' ) {
				setPreResultValue(resultValue);
				setResultValue('');
				setCurrentOperation(value);
			}
			if (resultValue == '' && preResultValue != '' ) {
				setCurrentOperation(value);
			}
		}
		if (value in instantOpArray){
			console.log("instant")
			immediateOp = value;
			setCurrentOperation('');
			handleEqual(value);
			setPreResultValue(resultValue);
			setResultValue('');
		}
	}
	
  return (
    <div className="calculator">
		<CalculatorControls handleClick={handleClick} handleEqual={handleEqual} handleErase={handleErase}/>
		<PreResultBox value={preResultValue} operation={opArray[currentOperation]?opArray[currentOperation]:oneOperandOpArray[currentOperation] } />
		<ResultBox value={resultValue}/>
	</div>
  );
}