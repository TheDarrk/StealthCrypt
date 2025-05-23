import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./landingpage.css";
import logo from "./logo.png";
import bgGif from "./bggif.gif";
import { Typewriter } from "react-simple-typewriter";

export default function LandingPage({ onLaunch }) {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="landing-page">
      {/* Background GIF */}
      <div
        className="bg-gif"
        style={{
          backgroundImage: `url(${bgGif})`,
        }}
      />

      {/* Foreground content */}
      <img src={logo} alt="SecureFile Logo" className="landing-logo" />
      <h1 className="landing-title">Welcome to StealthCrypt.</h1>
      <p className="landing-subtitle">
        Encrypt and decrypt your Data securely and easily.
        <br />
         <span className="typewriter-sentence">
          Your data stays {" "}
          <span className="typewriter-word">
            <Typewriter
              words={[" Secure.", " Private.", " Encrypted.", " Yours."]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={60}
              delaySpeed={1500}
            />
          </span>
        </span>
      </p>

      <button className="landing-button" onClick={onLaunch}>
        Launch App
      </button>

      <div className="info-boxes">
        <div className="info-box typewriter" data-aos="fade-up">
          <h3>What to Encrypt</h3>
          <ul>
            <li>Documents (PDF, DOCX, TXT)</li>
            <li>Images (JPG, PNG)</li>
            <li>Videos (MP4, AVI)</li>
            <li>Any sensitive file you want to keep private</li>
          </ul>
        </div>

        <div
          className="info-box typewriter"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h3>How to Encrypt</h3>
          <ul>
            <li>Select a file</li>
            <li>Click “Encrypt”</li>
            <li>Save the encrypted file and key</li>
            <li>Use the key to decrypt when needed</li>
          </ul>
        </div>

        <div
          className="info-box typewriter"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <h3>Why to Encrypt</h3>
          <ul>
            <li>Protect sensitive information</li>
            <li>Prevent unauthorized access</li>
            <li>Ensure data privacy & security</li>
            <li>Peace of mind in the digital age</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
