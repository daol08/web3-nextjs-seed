import React, { useEffect, useState, useRef } from 'react';

import { Button, Form, Input } from 'antd';

import NewUserInput from '../components/NewUserInput';



const initUsers = [

	{

		id: 1,

		name: 'ken',

		email: 'ken@flui.ai'

	},

	{

		id: 2,

		name: 'ken2',

		email: 'ken2@flui.ai'

	}

];



const UserList = ({ users }) => {

	return (

		<div>

			<h1>User List</h1>

			{users && users.map(user => <User user={user} />)}

		</div>

	);

};



const User = ({ user }) => {

	return <div>Name: {user.name}</div>;

};






const UserListContainer = props => {

	const [users, setUsers] = useState([]);

	function onInputChangeHandle(values) {

		console.log('onInputChangeHandle', values);
		setUsers([...users, values]);
	}


	// useEffect(() => {});

	//

	// const ref = useRef();



	return (

		<>

			<NewUserInput onSubmit={onInputChangeHandle} />

			<UserList users={users} />

		</>

	);

};



export default UserListContainer;