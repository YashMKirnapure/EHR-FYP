const Web3 = require('web3');
const { create } = require('ipfs-http-client');
const CryptoJS = require('crypto-js');
const fs = require('fs');

// Configure Web3 (Ethereum RPC)
const web3 = new Web3('http://127.0.0.1:8545'); // Replace with your Ethereum RPC URL

// Configure IPFS (Local Node)
const ipfs = create({ host: '127.0.0.1', port: '5001', protocol: 'http' });

// Entities (Doctor, Patient, Diagnostic)
const entities = {
    Doctor: {
        public: '0xb49bbaC7E687a50DCbb2d92341b4184B22ccA6fd',
        private: '2fa7a98fba84fe737589c35dfea69f48b536162d9c8f08e7285c25085bb56666',
    },
    Patient: {
        public: '0xC6676BBc0228c3BE5A213F2c4e1995624FeeF091',
        private: '90e5f5a9ce2d17a9ba0032c472cd9a1a3657146c86988fd8586f048d438f3c8a',
    },
    Diagnostic: {
        public: '0x67CAc6e9E44106353b8f491198b10e5e5D5b4Eb2',
        private: '0d04ab0c652c4275b253cdf4f20658378783248860b16febffb93f68b922481c',
    },
};

// Smart Contract Addresses
const contracts = {
    DiagnosticForm: '0xB2Cc642BCbbB979C5440CDe84608895b7a4F4BC1',
    DiagnosticRegistration: '0xAf040f1404559f79381Ddc9e67Db799781A52137',
    DoctorForm: '0x6e4A1F2722fc060356E204EcF234815e3B217089',
    DoctorRegistration: '0x1dCAA1d56B138525E2df3F14100345B057C9eDCF',
    PatientRegistration: '0xc1c250BC3417577d0d27A7502C68A8eA715793E1',
    UploadEhr: '0x530BA9A5179549b461Cd592744FEcc11DE7694f0',
};

// Measure TPS
async function measureTPS() {
    let startTime = Date.now();
    let initialBlock = await web3.eth.getBlockNumber();

    setTimeout(async () => {
        let endBlock = await web3.eth.getBlockNumber();
        let elapsedTime = (Date.now() - startTime) / 1000;
        let tps = (endBlock - initialBlock) / elapsedTime;
        console.log(`Transaction Speed (TPS): ${tps.toFixed(2)}`);
    }, 10000);
}

// Measure Transaction Latency
async function measureLatency(txHash) {
    let startTime = Date.now();
    let receipt = await web3.eth.getTransactionReceipt(txHash);
    while (!receipt) {
        receipt = await web3.eth.getTransactionReceipt(txHash);
    }
    console.log(`Transaction Latency: ${(Date.now() - startTime) / 1000} sec`);
}

// Measure Gas Cost
async function measureGasCost(txHash) {
    let receipt = await web3.eth.getTransactionReceipt(txHash);
    let gasUsed = receipt.gasUsed;
    let gasPrice = await web3.eth.getGasPrice();
    let totalGasCost = gasUsed * gasPrice;

    console.log(`Gas Cost: ${web3.utils.fromWei(totalGasCost.toString(), 'ether')} ETH`);
}

// Measure IPFS Performance (Upload & Retrieval)
async function measureIPFSPerformance(filePath) {
    let file = fs.readFileSync(filePath);

    // Upload
    let startTime = Date.now();
    let fileAdded = await ipfs.add(file);
    console.log(`IPFS Upload Time: ${(Date.now() - startTime) / 1000} sec`);

    // Retrieve
    startTime = Date.now();
    let fileData = await ipfs.cat(fileAdded.path);
    console.log(`IPFS Retrieval Time: ${(Date.now() - startTime) / 1000} sec`);
}

// Measure Encryption & Decryption Performance
async function measureEncryptionPerformance(data) {
    let key = 'secret-key';

    let startTime = Date.now();
    let encryptedData = CryptoJS.AES.encrypt(data, key).toString();
    console.log(`Encryption Time: ${(Date.now() - startTime) / 1000} sec`);

    startTime = Date.now();
    let decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
    console.log(`Decryption Time: ${(Date.now() - startTime) / 1000} sec`);
}

// Run Tests for Each Entity
async function runTests(entity) {
    console.log(`\n🔍 Running Performance Tests for ${entity}...\n`);

    let senderAddress = entities[entity].public;
    let privateKey = entities[entity].private;
    let contractAddress = contracts.UploadEhr; // Assuming UploadEhr is the main contract

    measureTPS();

    // Sample transaction
    let tx = {
        from: senderAddress,
        to: contractAddress,
        value: web3.utils.toWei('0.01', 'ether'),
        gas: 21000,
    };

    let signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    let sentTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction Hash: ${sentTx.transactionHash}`);

    await measureLatency(sentTx.transactionHash);
    await measureGasCost(sentTx.transactionHash);
    await measureIPFSPerformance('./sampleEHR.json');
    await measureEncryptionPerformance('Sample EHR Data');

    console.log(`\n✅ Performance Monitoring for ${entity} Complete.\n`);
}

// Start Monitoring for Each Entity
(async () => {
    for (let entity in entities) {
        await runTests(entity);
    }
})();
