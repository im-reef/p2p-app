// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IPFSUploader {
    // Event emitted when a new IPFS hash is uploaded
    event IPFSHashUploaded(address indexed uploader, string ipfsHash);

    // Mapping to store IPFS hashes by uploader address
    mapping(address => string[]) private userHashes;

    // Function to upload an IPFS hash
    function uploadIPFSHash(string memory _ipfsHash) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");

        // Store the IPFS hash
        userHashes[msg.sender].push(_ipfsHash);

        // Emit the event
        emit IPFSHashUploaded(msg.sender, _ipfsHash);
    }

    // Function to retrieve all IPFS hashes uploaded by a specific address
    function getIPFSHashes(address _uploader) public view returns (string[] memory) {
        return userHashes[_uploader];
    }
}
