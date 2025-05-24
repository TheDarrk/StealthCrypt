import React, { useState } from "react";
import LandingPage from "./LandingPage";
import "./App.css";
import { ReactTyped } from "react-typed"; 



export default function App() {
  // Show landing page first
  const [showLandingPage, setShowLandingPage] = useState(true);

  // Encryption states
  const [encryptFile, setEncryptFile] = useState(null);
  const [encryptStatus, setEncryptStatus] = useState("");
  const [encryptDownloadLink, setEncryptDownloadLink] = useState(null);
  const [encryptDownloadFilename, setEncryptDownloadFilename] = useState("");
  const [encryptKey, setEncryptKey] = useState("");

  // Decryption states
  const [decryptFile, setDecryptFile] = useState(null);
  const [decryptKey, setDecryptKey] = useState("");
  const [decryptStatus, setDecryptStatus] = useState("");
  const [decryptDownloadLink, setDecryptDownloadLink] = useState(null);
  const [decryptDownloadFilename, setDecryptDownloadFilename] = useState("");

  // Show landing page first
  if (showLandingPage) {
    return <LandingPage onLaunch={() => setShowLandingPage(false)} />;
  }

  // Handlers
  const handleEncryptFileChange = (e) => {
    setEncryptFile(e.target.files[0]);
    setEncryptStatus("");
    setEncryptDownloadLink(null);
    setEncryptKey("");
  };

  const handleEncrypt = async () => {
    if (!encryptFile) {
      setEncryptStatus("Please select a file to encrypt.");
      return;
    }
    setEncryptStatus("Encrypting...");

    const formData = new FormData();
    formData.append("file", encryptFile);

    try {
      const response = await fetch("https://stealthcrypt.onrender.com/encrypt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Encryption failed");

      const data = await response.json();
      const byteCharacters = atob(data.encrypted_file);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);

      setEncryptDownloadLink(url);
      setEncryptDownloadFilename(encryptFile.name + ".encrypted");
      setEncryptKey(data.key);
      setEncryptStatus("Encryption successful! Download below.");
    } catch (err) {
      setEncryptStatus("Encryption failed: " + err.message);
    }
  };

  const copyEncryptKeyToClipboard = () => {
    if (!encryptKey) return;
    navigator.clipboard.writeText(encryptKey).then(() => {
      alert("Encryption key copied to clipboard!");
    });
  };

  const handleDecryptFileChange = (e) => {
    setDecryptFile(e.target.files[0]);
    setDecryptStatus("");
    setDecryptDownloadLink(null);
  };

  const handleDecryptKeyChange = (e) => {
    setDecryptKey(e.target.value);
  };

  const handleDecrypt = async () => {
    if (!decryptFile) {
      setDecryptStatus("Please select a file to decrypt.");
      return;
    }
    if (!decryptKey.trim()) {
      setDecryptStatus("Please enter the encryption key.");
      return;
    }
    setDecryptStatus("Decrypting...");

    const formData = new FormData();
    formData.append("file", decryptFile);
    formData.append("key", decryptKey);

    try {
      const response = await fetch("https://stealthcrypt.onrender.com/decrypt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Decryption failed");

      const data = await response.json();
      const byteCharacters = atob(data.decrypted_file);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);

      let filename = decryptFile.name;
      if (filename.endsWith(".encrypted")) {
        filename = filename.slice(0, -10);
      }
      setDecryptDownloadLink(url);
      setDecryptDownloadFilename(filename);
      setDecryptStatus("Decryption successful! Download below.");
    } catch (err) {
      setDecryptStatus("Decryption failed: " + err.message);
    }
  };

  return (
    <div className="app-page">
      
      <h1 className="app-title">StealthCrypt.</h1>
      <div className="typed-line">
      <span className="fixed-text">Data stays{""}</span>
      <ReactTyped
      className="typed-text"
  strings={["Secured!", "Encrypted!", "Private!","Yours!", "in your control."]}
  typeSpeed={60}
  backSpeed={40}
  loop
  backDelay={1500}
  showCursor={true}
/>
</div>

      {/* Encrypt Section */}
      <section className="card" aria-label="Encrypt File Section">
        <h2>Want to Encrypt a File :</h2>
        <label className="file-label" htmlFor="encrypt-file-input">
          Choose file to encrypt
          <input
            id="encrypt-file-input"
            type="file"
            onChange={handleEncryptFileChange}
            aria-required="true"
          />
        </label>
        {encryptFile && <div className="file-name">{encryptFile.name}</div>}
        <button onClick={handleEncrypt} className="action-button">
          Encrypt
        </button>
        <div className="status-message" role="status" aria-live="polite">
          {encryptStatus}
        </div>

        {encryptDownloadLink && (
          <div className="download-section">
            <a
              href={encryptDownloadLink}
              download={encryptDownloadFilename}
              className="download-link"
            >
              Download Encrypted File
            </a>
          </div>
        )}

        {encryptKey && (
          <div className="key-display" tabIndex={0} title="Click to copy key">
            <pre
              style={{ margin: 0, whiteSpace: "pre-wrap", userSelect: "all" }}
              onClick={copyEncryptKeyToClipboard}
            >
              {encryptKey}
            </pre>
            <button
              onClick={copyEncryptKeyToClipboard}
              className="action-button"
              style={{ marginTop: 10 }}
            >
              Copy Key
            </button>
            <p style={{ fontSize: 12, color: "#aaa" }}>
              * Save this key safely! You need it to decrypt your file.
            </p>
          </div>
        )}
      </section>

      {/* Decrypt Section */}
      <section className="card" aria-label="Decrypt File Section">
        <h2>Want to Decrypt a File :</h2>
        <label className="file-label" htmlFor="decrypt-file-input">
          Choose file to decrypt
          <input
            id="decrypt-file-input"
            type="file"
            onChange={handleDecryptFileChange}
            aria-required="true"
          />
        </label>
        <div className="input-group">
          <label htmlFor="key-textarea">Encryption Key</label>
          <textarea
            id="key-textarea"
            placeholder="Paste your encryption key here"
            value={decryptKey}
            onChange={handleDecryptKeyChange}
            rows={4}
            className="text-input"
            spellCheck="false"
          />
        </div>
        <button onClick={handleDecrypt} className="action-button">
          Decrypt
        </button>
        <div className="status-message" role="status" aria-live="polite">
          {decryptStatus}
        </div>

        {decryptDownloadLink && (
          <div className="download-section">
            <a
              href={decryptDownloadLink}
              download={decryptDownloadFilename}
              className="download-link"
            >
              Download Decrypted File
            </a>
          </div>
        )}
      </section>
    </div>
  );
} 
