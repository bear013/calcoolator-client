import { useState } from 'react';

function TypeFilter(props) {
  return (
	<div> 
	<select onChange={props.filterEvents.typeFilterChange}> 
		<option value="any">Any Operation</option> 
		<option value="addition">Addition</option> 
		<option value="subtraction">Subtraction</option> 
		<option value="multiplication">Multiplication</option>
		<option value="division">Division</option>
		<option value="square_root">Square Root</option>
		<option value="random_string">Random String</option>
	</select>
	</div>
  )
}

function DateFilter(props) {
  return (
	<div> 
	From: <input type="text" placeholder="YYYY-MM-DD" onChange={props.filterEvents.fromDateFilterChange} /> 
	Until: <input type="text" placeholder="YYYY-MM-DD" onChange={props.filterEvents.untilDateFilterChange} /> 
	</div>
  )
}

function AmountFilter(props) {
  return (
	<div> Between:<input type="text" placeholder="1" onChange={props.filterEvents.minAmountFilterChange} /> And: <input type="text" placeholder="100" onChange={props.filterEvents.maxAmountFilterChange} /> </div>
  )
}


function SearchButton(props) {
  return (
	<div> <button onClick={props.searchFunction} > S </button></div>
  )
}

function SearchBar(props) {
  return (
	<div className="searchbar"> 
		<TypeFilter filterEvents={props.events} /> 
		<DateFilter filterEvents={props.events} /> 
		<AmountFilter filterEvents={props.events}/> 
		<SearchButton searchFunction={props.searchFunction}/> 
	</div>
  )
}


function ResultsData(props) {
  return (
	<div> 
	<table> 
	{props.searchResults !== undefined? <tr> <th>Type</th> <th> Amount </th> <th> Balance </th> <th> Response </th> <th> Date </th> </tr> : <tr></tr> }
	{props.searchResults !== undefined && props.searchResults.data.rows.map(item =>{
       return <tr> <td> {item.type} </td> <td> {item.amount} </td> <td> {item.balance} </td> <td> {item.response} </td> <td> {item.op_date} </td> </tr> 
    })}
	</table>
	<div className="historyfooter"></div>
	</div>
  )
}

//op.type as type,
//h.amount as amount,
//h.user_balance as balance,
//h.operation_response as response,
//h.operation_date as op_date



export default function History(props) {
	
	const [minAmountFilter, setMinAmountFilter] = useState('');
	const [maxAmountFilter, setMaxAmountFilter] = useState('');
	const [fromDateFilter, setFromDateFilter] = useState('');
	const [untilDateFilter, setUntilDateFilter] = useState('');
	const [typeFilter, setTypeFilter] = useState('any');
	const [pageOffset, setPageOffset] = useState(0);
	const [searchResults, setSearchResults] = useState();
	
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
	
	function trySearch() {
		try {
			fetch(`http://localhost:8099/calculator/v1/history?`  + new URLSearchParams({
				minAmount: minAmountFilter,
				maxAmount: maxAmountFilter,
				fromDate: fromDateFilter,
				untilDate: untilDateFilter,
				type:typeFilter,
				offset:pageOffset
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
				{console.log(data.data);
				setSearchResults(data)};
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
	<SearchBar token={props.userToken} events={filterEvents} searchFunction={trySearch} />
	<ResultsData searchResults={searchResults}/>
	</div>
  )
}