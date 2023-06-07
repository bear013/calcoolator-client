function SearchBar() {
  return (
	<div> Search Bar </div>
  )
}

function ResultsBox() {
  return (
	<div> Results Box </div>
  )
}


export default function History() {
  return (
    <div className="historypage">
	<SearchBar />
	<ResultsBox />
	</div>
  )
}