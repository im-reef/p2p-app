//peer-to-peer
const peer = new Peer();
let conn;

// Display Peer ID
peer.on("open", id => {
    document.getElementById("peerId").textContent = id;
});

// Handle incoming connections
peer.on("connection", connection => {
    conn = connection;
    setupConnection();
    document.getElementById("status").textContent = "Connected to " + conn.peer;
});

// Connect to a peer
function connectToPeer() {
    const remoteId = document.getElementById("remotePeerId").value;
    conn = peer.connect(remoteId);
    setupConnection();
}

// Setup data event handlers
function setupConnection() {
    conn.on("open", () => {
        document.getElementById("status").textContent = "Connected to " + conn.peer;
    });

    conn.on("data", data => {
        if (data.file && data.filename) {
            receiveFile(data);
        }
    });
}

// Send file
function sendFile() {
    const fileInput = document.getElementById("fileInputP2p");
    console.log("file value is: ", fileInput.files.length)
    if (fileInput.files.length === 0) {
        alert("Please select a file to send.");
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        conn.send({ file: reader.result, filename: file.name });
        alert("File sent!");
    };

    reader.readAsDataURL(file);
}

// Receive file
function receiveFile(data) {
    const link = document.getElementById("downloadLink");
    link.href = data.file;
    link.textContent = "Download " + data.filename;
    link.style.display = "block";

    console.log(data.file)
}

// --> peer-to-peer end