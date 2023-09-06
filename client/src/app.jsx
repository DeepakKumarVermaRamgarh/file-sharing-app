import { useEffect, useState } from "react";
import "./app.scss";
import { scanVirus, uploadFile } from "./actions/action";
import QRCode from "react-qr-code";

const App = () => {
  // State variables to manage various aspects of the app
  const [file, setFile] = useState({});
  const [fileUrl, setFileUrl] = useState("");
  const [count, setCount] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Function to format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Event handler for changing the download count
  const handleCountChange = (e) => {
    const { value } = e.target;
    if (value <= 0 || value > 50) return;
    setCount(value);
  };

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setScanning(true);
      const res = await scanVirus(file);
      setScanning(false);
      if (res === "clean") {
        setMessage("File is Safe");
        await upload();
        setMessage("");
      } else if (res === "infected") {
        setMessage("File is Infected!!!");
      } else {
        setMessage("Error in scanning...");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to handle file upload
  const upload = async () => {
    setUploading(true);
    const fileData = new FormData();
    fileData.append("name", file.name);
    fileData.append("file", file);
    fileData.append("maxDownload", count);
    try {
      const { path } = await uploadFile(fileData);
      setFileUrl(path);
      setUploading(false);
    } catch (error) {
      console.log(error.message);
      setUploading(false);
    }
    setFile({});
  };

  // Function to copy the file URL to the clipboard
  const copyIntoCLipboard = () => {
    navigator.clipboard.writeText(fileUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  // Reset state variables when the file changes
  useEffect(() => {
    setUploading(false);
    setScanning(false);
    setMessage("");
  }, [file]);

  return (
    <>
      <header>
        <h1>Simple and secure file share</h1>
        <h2>
          Downloadable upto <span>50</span> times.
        </h2>
      </header>
      <main>
        <form
          method="POST"
          encType="multipart-formdata"
          onSubmit={handleSubmit}
        >
          <div className="left-container">
            <label
              htmlFor="file"
              className="drop-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setFile(e.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                name="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />

              <img src="upload.png" alt="upload icon" />

              {file.name && (
                <h4>
                  {file.name} <span> {formatFileSize(file.size)} </span>{" "}
                </h4>
              )}

              <h3>Drag & drop or click here to upload file</h3>

              {scanning && <p>Scanning for viruses...</p>}
              {message && <p>{message}</p>}
              {uploading && <p>Uploading File Please Wait...</p>}
            </label>

            {file.name && (
              <div className="actions">
                <label htmlFor="count">
                  Download Limit :
                  <input
                    type="number"
                    name="count"
                    min={1}
                    max={50}
                    inputMode="number"
                    id="count"
                    value={count}
                    onChange={(e) => handleCountChange(e)}
                  />
                </label>
                <button disabled={uploading} type="submit">
                  Upload
                </button>
              </div>
            )}
          </div>
        </form>
        {fileUrl && (
          <div className="right-container">
            <div className="card-container">
              <QRCode
                size={256}
                title="Scan Me"
                fgColor=""
                level="Q"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={fileUrl}
                viewBox={`0 0 256 256`}
              />
              <div className="actions">
                <input type="text" value={fileUrl} readOnly />
                <button
                  onClick={copyIntoCLipboard}
                  style={
                    copied
                      ? {
                          color: "#fff",
                          backgroundColor: "#308f30",
                          borderColor: "#308f30",
                        }
                      : {}
                  }
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default App;
