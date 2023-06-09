import config from '../config/config'
import { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Search from '@mui/icons-material/Search';
import Delete from '@mui/icons-material/Delete';

const WebserviceProtocol = config.WebserviceProtocol
const WebserviceHost = config.WebserviceHost
const WebservicePort = config.WebservicePort

function TypeFilter(props) {
  return (
    <div>
	 
    <Select  
	labelId="typeLabel"
    id="type"
	label="Type"
	value={props.typeFilter}
    onChange={props.filterEvents.typeFilterChange}> 
		<MenuItem value="any" >Any Operation</MenuItem> 
		<MenuItem value="addition">Addition</MenuItem> 
		<MenuItem value="subtraction">Subtraction</MenuItem> 
		<MenuItem value="multiplication">Multiplication</MenuItem>
		<MenuItem value="division">Division</MenuItem>
		<MenuItem value="square_root">Square Root</MenuItem>
		<MenuItem value="random_string">Random String</MenuItem>
	</Select>
    </div>
  )
}

function DateFilter(props) {
  return (
	<div> 
	<TextField label="Start Date" type="text" placeholder="YYYY-MM-DD" onChange={props.filterEvents.fromDateFilterChange} /> 
	<TextField label="End Date" type="text" placeholder="YYYY-MM-DD" onChange={props.filterEvents.untilDateFilterChange} /> 
	</div>
  )
}

function AmountFilter(props) {
  return (
	<div><TextField type="text" label="Min Amount" placeholder="1" onChange={props.filterEvents.minAmountFilterChange} /><TextField type="text" label="Min Amount" placeholder="100" onChange={props.filterEvents.maxAmountFilterChange} /> </div>
  )
}


function SearchButton(props) {
  return (
	<div> <Button minheight="64px" onClick={() => props.searchFunction(0)} variant="contained" > <Search/> </Button></div>
  )
}

function SearchBar(props) {
  return (
	<div className="searchbar"> 
	<Grid container spacing={0} xs={12} > 
		<TypeFilter filterEvents={props.events} typeFilter={props.typeFilter} /><SearchButton searchFunction={props.searchFunction}/> 

	</Grid>
	<Grid container spacing={0} xs={12} > 
		<DateFilter filterEvents={props.events} /> 
		<AmountFilter filterEvents={props.events}/> 	
	</Grid>
	</div>
  )
}

function HistoryFooter(props) {	
	var pages = Array.from(Array(props.totalPages).keys());
	return (
	<div>
		{pages.map(item =>{ return <Button variant="text" key={item} onClick={() => props.selectPage(item)}>{item + 1}</Button> })}
	</div>
	)

}

function ResultsData(props) {	
  return (
	<TableContainer component={Paper}>
		<Table> 
			{props.searchResults !== undefined? 
				<TableHead>
					<TableRow>
						<TableCell>Type</TableCell>
						<TableCell>Amount</TableCell> 
						<TableCell>Balance</TableCell> 
						<TableCell>Response</TableCell> 
						<TableCell>Date</TableCell>  
						<TableCell></TableCell> 
					</TableRow> 
				</TableHead>:<TableHead></TableHead>}
			<TableBody>
				{props.searchResults !== undefined && props.searchResults.data.rows.map(item =>{
				   return <TableRow key={item}> <TableCell> {item.type} </TableCell> <TableCell> {item.amount} </TableCell> <TableCell> {item.balance} </TableCell> <TableCell> {item.response} </TableCell> <TableCell> {item.op_date} </TableCell> <TableCell><Button onClick={() => props.tryDeleteRecord(item.record_id)}><Delete/></Button></TableCell>  </TableRow> 
				})}
			</TableBody>
		</Table>
		{props.searchResults !== undefined && props.searchResults.resultCode == 0? <HistoryFooter currentIndex={props.searchResults.data.currentPage} itemCount={props.searchResults.data.count} totalPages={props.searchResults.data.totalPages} selectPage={props.selectPage} /> : <div></div> }
		
	</TableContainer>
  )
}

export default function History(props) {
	
	const [minAmountFilter, setMinAmountFilter] = useState('');
	const [maxAmountFilter, setMaxAmountFilter] = useState('');
	const [fromDateFilter, setFromDateFilter] = useState('');
	const [untilDateFilter, setUntilDateFilter] = useState('');
	const [typeFilter, setTypeFilter] = useState('any');
	const [pageOffset, setPageOffset] = useState(0);
	const [searchResults, setSearchResults] = useState();
	
	function selectPage(page) {
		setPageOffset(page);
	};
	
	const minAmountFilterChange = (e) => {
		setMinAmountFilter(e.target.value);
	};
	
	const maxAmountFilterChange = (e) => {
		setMaxAmountFilter(e.target.value);
	};
	
	const fromDateFilterChange = (e) => {
		setFromDateFilter(e.target.value);
	};
	
	const untilDateFilterChange = (e) => {
		setUntilDateFilter(e.target.value);
	};
	
	const typeFilterChange = (e) => {
		setTypeFilter(e.target.value);
	};
	
	const filterEvents = {'minAmountFilterChange':minAmountFilterChange,
						'maxAmountFilterChange':maxAmountFilterChange,
						'fromDateFilterChange':fromDateFilterChange,
						'untilDateFilterChange':untilDateFilterChange,
						'typeFilterChange':typeFilterChange}
	
	function trySearch(page) {
		try {
			fetch(`${WebserviceProtocol}://${WebserviceHost}:${WebservicePort}/calculator/v1/history?`  + new URLSearchParams({
				minAmount: minAmountFilter,
				maxAmount: maxAmountFilter,
				fromDate: fromDateFilter,
				untilDate: untilDateFilter,
				type:typeFilter,
				offset:page
			}),
			{
				method:'GET',
				headers: {
					'content-type': 'application/json',	
					'x-access-token' : props.token
				}
			})
            .then(response => response.json())
            .then(data => {
				if (data.resultCode == 0){
					setSearchResults(data);
				}
				if (data.resultCode == -2){
					alert('You must sign in to continue');
				}
			})
			
			.catch(error => {
                console.log(error);
				setSearchResults('');
            })
		} catch (e){
			console.log(e);
		}		
	}
	
	function tryDeleteRecord(operationId) {
		try {
			fetch(`${WebserviceProtocol}://${WebserviceHost}:${WebservicePort}/calculator/v1/deleteRecord`,
			{
				method:'DELETE',
				headers: {
					'content-type': 'application/json',	
					'x-access-token' : props.token
				},
				body: JSON.stringify({"recordId":operationId})
			})
            .then(response => response.json())
            .then(data => {
				//this is not ideal, the filter states could change between executions
				trySearch(); 
			})
			
			.catch(error => {
                console.log(error);
            })
		} catch (e){
			console.log(e);
		}		
	}
	
  return (
    <div className="historypage">
	<SearchBar token={props.userToken} events={filterEvents} searchFunction={trySearch} typeFilter={typeFilter}/>
	<ResultsData searchResults={searchResults} tryDeleteRecord={tryDeleteRecord} selectPage={trySearch}/>
	</div>
  )
}