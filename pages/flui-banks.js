import React, { useEffect, useRef, useState } from 'react';

// lib
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useCaver } from '../hooks/useCaver';

// ui
import JSONPretty from 'react-json-pretty';
import { JsonContainer } from '../components/PrettyJson.style';
import DepositInput from '../components/DepositInput';
import { Button, Col, Divider, PageHeader, Row, Typography } from 'antd';
const { Title, Text } = Typography;

import WithdrawInput from '../components/WithdrawInput';
import TransferInput from '../components/TransferInput';
import basicStyle from '../components/basicStyle';

// function deposit({ contract, amount, from }) {
// 	return contract.methods.mintCard(amount).send({ from, gas: '300000' });
// }

function deposit({ contract, amount, from }) {
	return contract.methods.deposit(amount).send({ value: amount, from, gas: '300000' });
}
function withdraw({ contract, amount, from }) {
	return contract.methods.withdraw(amount).send({ from, gas: '300000' });
}

function transfer({ contract, to, amount, from }) {
	return contract.methods.transfer(to, amount).send({ from, gas: '300000' });
}

function getBalance({ contract, from }) {
	return contract.methods.getBalance(amount).send({ from, gas: '300000' });
}

const FLUIBank = ({ privateKey, abi, contractAddress }) => {
	const context = useCaver();

	const { account, contract, provider } = context.initializeWithContract({
		privateKey,
		abi,
		contractAddress
	});

	const [lastTransaction, setLastTransaction] = useState({});

	// onSubmit -> onDepositSubmitHandle
	async function onDepositSubmit(values) {
		console.log('onDepositSubmit', values);
		if (context === null) {
			alert('No provider');
			return;
		}

		const { toPeb } = context.getUtils();

		// const { amount } = values;
		const amount = parseInt(values.amount * 1000); // decimal to integer

		const transaction = await deposit({
			contract,
			amount: toPeb(amount, 'mKLAY'),
			from: account.address
		});

		setLastTransaction(transaction);
	}

	// onSubmit -> onWithdrawSubmit
	async function onWithdrawSubmit(values) {
		console.log('onWithdrawSubmit', values);
		if (context === null) {
			alert('No provider');
			return;
		}

		const { toPeb } = context.getUtils();

		// const { amount } = values;
		const amount = parseInt(values.amount * 1000); // decimal to integer

		const transaction = await withdraw({
			contract,
<<<<<<< HEAD
			name,
			address,
=======
			amount: toPeb(amount, 'mKLAY'),
>>>>>>> upstream/master
			from: account.address
		});

		setLastTransaction(transaction);
	}

	// onSubmit -> onTransferSubmit
	async function onTransferSubmit(values) {
		console.log('onTransferSubmit', values);
		if (context === null) {
			alert('No provider');
			return;
		}

		const { toPeb } = context.getUtils();

		const { to } = values;
		// const { amount } = values;
		const amount = parseInt(values.amount * 1000); // decimal to integer
		const transaction = await transfer({
			contract,
			to,
			amount,
			from: account.address
		});

		setLastTransaction(transaction);
	}

	const { rowStyle, colStyle, gutter } = basicStyle;
	return (
		<>
			<div style={{ paddingTop: 24 }}>
				<Title>DAOL Bank</Title>
				<Text>Account: {account.address}</Text>
				<br />
				<Text>Contract Address: {contractAddress}</Text>
				<br />
			</div>

			<Divider />

			<Row style={rowStyle} gutter={gutter} type="flex">
				<Col style={colStyle} span={8}>
					<h3> Deposit Func </h3>
					<DepositInput onSubmit={onDepositSubmit} />
				</Col>

				<Col style={colStyle} span={8}>
					<h3> Withdraw Func </h3>
					<WithdrawInput onSubmit={onWithdrawSubmit} />
				</Col>

				<Col style={colStyle} span={8}>
					<h3> Transfer Func </h3>
					<TransferInput onSubmit={onTransferSubmit} />
				</Col>
			</Row>

			<Divider />

			<JsonContainer>
				<Title level={2}>Last Transaction</Title>
				<JSONPretty data={lastTransaction} />
			</JsonContainer>
		</>
	);
};

const NoSSRFLUIBank = dynamic(
	() => {
		return Promise.resolve(FLUIBank);
	},
	{
		ssr: false
	}
);

const FLUIBankPage = props => {
	return (
		<>
			<NoSSRFLUIBank {...props} />
		</>
	);
};

FLUIBankPage.getInitialProps = async ({ pathname }) => {
	const CONTRACT_ABI_JSON = process.env.FLUI_CARD_CONTRACT_ABI_JSON;
	const CONTRACT_ADDRESS_JSON = process.env.FLUI_CARD_CONTRACT_ADDRESS_JSON;

	const privateKey = process.env.KLAYTN_PRIVATE_KEY;
	const abi = await axios.get(CONTRACT_ABI_JSON).then(res => {
		return res.data;
	});

	const { contractAddress } = await axios.get(CONTRACT_ADDRESS_JSON).then(res => res.data);

	return { privateKey, abi, contractAddress };
};

<<<<<<< HEAD
export default FLUIBank;
=======
export default FLUIBankPage;
>>>>>>> upstream/master
