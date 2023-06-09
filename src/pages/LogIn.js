import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
    <Box component="form">
		<Typography component="h1" variant="h5">
			Sign in
		</Typography>
		<p><TextField name="username" label="User Name" id="username" type="text" onChange={usernameChange} /></p>
		<p><TextField name="password" label="Password" id="password" type="password" onChange={passwordChange} /></p>
		<Button variant="contained" onClick={() => {props.tryLogin(username,password)} }>Log In</Button>
	</Box>
  )
}