import React, { useEffect, useRef, useState } from 'react';

import { useCaver } from '../hooks/useCaver';
import JSONPretty from 'react-json-pretty';
import { JsonContainer } from '../components/PrettyJson.style';
import axios from 'axios';
import DepositInput from '../components/DepositInput';
import TransferInput from '../components/TransferInput';
import WithdrawInput from '../components/WithdrawInput';
import { Button, Divider, PageHeader, Typography } from 'antd';
const { Title, Text } = Typography;

// pages/index.jsimport getConfig from 'next/config'
import getConfig from 'next/config';
// Only holds serverRuntimeConfig and publicRuntimeConfig from next.config.js nothing else.
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

function deposit({ contract, amount, from }) {
	return contract.methods.deposit(amount).send({ from, gas: '300000' });
};
function withdraw({contract, amount, from}) {
	return contract.methods.withdraw(amount).send({ from, gas: '300000' });
};
function transfer({contract, to, amount, from}) {
	return contract.methods.transfer(to, amount).send({ from, gas: '300000' });
};
function getBalance({contract, from}) {
	return contract.methods.getBalance(balance).send({ from, gas: '300000' });
};
const FLUIBank = ({ privateKey, abi, contractAddress }) => {
	const context = useCaver();

	const { account, contract, provider } = context.initializeWithContract({
		privateKey,
		abi,
		contractAddress
	});

	const [lastTransaction, setLastTransaction] = useState({});

	async function onSubmit(values) {
		console.log('onSubmit');
		if (context === null) {
			alert('No provider');
			return;
		}

		const { toPeb } = context.getUtils();

		const { name, address } = values;
		const transaction = await deposit({
			contract,
			name,
			address,
			from: account.address
		});

		setLastTransaction(transaction);
	}

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

			<DepositInput onSubmit={onSubmit} />
			<TransferInput onSubmit={onSubmit} />
			<WithdrawInput onSubmit={onSubmit} />
			<Divider />

			<JsonContainer>
				<Title level={2}>Last Transaction</Title>
				<JSONPretty data={lastTransaction} />
			</JsonContainer>
		</>
	);
};

FLUIBank.getInitialProps = async ({ pathname }) => {
	console.log('FLUIBank::getInitialProps', pathname);
	console.log('FLUIBank::getInitialProps::serverRuntimeConfig', serverRuntimeConfig);

	const privateKey = serverRuntimeConfig.KLAYTN_PRIVATE_KEY;
	const abi = await axios.get(serverRuntimeConfig.CONTRACT_ABI_JSON).then(res => {
		return res.data;
	});

	const { contractAddress } = await axios
		.get(serverRuntimeConfig.CONTRACT_ADDRESS_JSON)
		.then(res => res.data);

	return { privateKey, abi, contractAddress };
};

export default FLUIBank;
