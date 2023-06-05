import { useState } from 'react';

export default function LogIn(props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const usernameChange = (e) => {
		setUsername(e.target.value);
	};
	
	const passwordChange = (e) => {
		setPassword(e.target.value);
	};
	
  return (
    <div className="login">
		<p><label for="username">Username</label><input name="username" id="username" type="text" onChange={usernameChange} /></p>
		<p><label for="password">Password</label><input name="password" id="password" type="password" onChange={passwordChange} /></p>
		<button onClick={() => {props.tryLogin(username,password)} }>Log In</button>
	</div>
  )
}