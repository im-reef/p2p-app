import contractABI from './Abi.js';

const contractAbiJSON = contractABI;



//const contractABI = contractABI;
const contractAddress = "0xf30Be38dC77EF38728D4fd6722F4BDc5F7d6aEA8"; // Replace with the deployed contract address

const web3 = new Web3(window.ethereum);

let contract = new web3.eth.Contract(contractAbiJSON, contractAddress)
console.log(contractAbiJSON);

let clientIpfsHash = "";


// Function to upload a file to Pinata via our server
async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            console.log("File uploaded successfully:", result);
            alert(`File uploaded! IPFS Hash: ${result.IpfsHash}`);

            // Create a new line of text
            const newText = document.createElement('p');
            newText.textContent = result.IpfsHash;

            //add ipfs hash value to a variable
            clientIpfsHash = result.IpfsHash;
            
            // Append the new text to the container
            textContainer.appendChild(newText);

        } else {
            console.error("Error uploading file:", result);
            alert("File upload failed! Check console for details.");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An error occurred. Check console for details.");
    }
}

// Function to upload IPFS hash to the Solidity contract
async function uploadHashToBlockchain(ipfsHash) {
    try {
        // Request user accounts through MetaMask
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];

        // Call the Solidity contract's uploadIPFSHash function
        const receipt = await contract.methods.uploadIPFSHash(ipfsHash).send({ from: account });
        console.log("Transaction successful:", receipt);
        alert("IPFS Hash successfully uploaded to the blockchain!");

        
    } catch (error) {
        console.error("Error uploading hash to blockchain:", error);
        alert("Failed to upload IPFS Hash to the blockchain. Check console for details.");
    }
}

// Attach form submission event handler
document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    
    if (fileInput.files.length === 0) {
        alert("Please select a file to upload.");
        return;
    }


    const file = fileInput.files[0];
    await uploadToIPFS(file);
    //Connection to the blockchain is still in developement 
    try {
        // Request user accounts through MetaMask
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];

        console.log(account);

        
        // Call the Solidity contract's uploadIPFSHash function
        const receipt = await contract.methods.uploadIPFSHash(clientIpfsHash).send({ from: account });
        const userHash = await contract.methods.getIPFSHashes(account).call();
        console.log("Transaction successful:", receipt);
        console.log("all user IPFS hash", userHash);
        alert("IPFS Hash successfully uploaded to the blockchain!");

        const hashContainer = document.getElementById("hashContainer");

        // Clear previous content
        hashContainer.innerHTML = "";

        // Convert userHashes to an array (if needed)
        const formattedHashes = [...new Set(userHash)];

        // Loop through hashes and add them to the container
        formattedHashes.forEach(hash => {
            const hashElement = document.createElement("a");
            hashElement.href = `https://ipfs.io/ipfs/${hash}`;
            hashElement.textContent = `https://ipfs.io/ipfs/${hash}`;
            hashElement.target = "_blank"; // Open in new tab
            hashElement.style.display = "block"; // Ensure each link appears on a new line
    
            hashContainer.appendChild(hashElement);
        });

    } catch (error) {
        console.error("Error uploading hash to blockchain:", error);
        alert("Failed to upload IPFS Hash to the blockchain. Check console for details.");
    }

    //console.log(clientIpfsHash);
    //await uploadHashToBlockchain(clientIpfsHash); 
});



/*

//web3 implementation

// Intermediary script to interact with Solidity contract using web3.js

const contractABI = [ Replace with the ABI of your Solidity contract ];
const contractAddress = "0xYourContractAddress"; // Replace with the deployed contract address

// Initialize Web3 instance
let web3;
let contract;

if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);
} else {
    alert("Please install MetaMask to interact with this application.");
}

// Function to upload IPFS hash to the Solidity contract
async function uploadHashToBlockchain(ipfsHash) {
    try {
        // Request user accounts through MetaMask
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];

        // Call the Solidity contract's uploadIPFSHash function
        const receipt = await contract.methods.uploadIPFSHash(ipfsHash).send({ from: account });
        console.log("Transaction successful:", receipt);
        alert("IPFS Hash successfully uploaded to the blockchain!");
    } catch (error) {
        console.error("Error uploading hash to blockchain:", error);
        alert("Failed to upload IPFS Hash to the blockchain. Check console for details.");
    }
}

// Extend the existing uploadToIPFS.js functionality
async function uploadToIPFSAndBlockchain(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        // Upload file to Pinata via server
        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            console.log("File uploaded to IPFS:", result);
            alert(`File uploaded! IPFS Hash: ${result.IpfsHash}`);

            // Upload IPFS hash to blockchain
            await uploadHashToBlockchain(result.IpfsHash);
        } else {
            console.error("Error uploading file to IPFS:", result);
            alert("File upload to IPFS failed. Check console for details.");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An error occurred during the file upload. Check console for details.");
    }
}

// Attach extended functionality to the form submission
const uploadForm = document.getElementById("uploadForm");
uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");

    if (fileInput.files.length === 0) {
        alert("Please select a file to upload.");
        return;
    }

    const file = fileInput.files[0];
    await uploadToIPFSAndBlockchain(file);
});

*/