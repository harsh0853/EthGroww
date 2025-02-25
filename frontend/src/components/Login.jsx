import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { ethers } from "ethers";

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    position: "relative",
    backgroundColor: "#333", // Dark gray background color
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    margin: "5px",
    animation: "modalFadeIn 0.3s ease-out",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "red",
    transition: "color 0.3s ease",
  },
  "@keyframes modalFadeIn": {
    from: {
      opacity: 0,
      transform: "translateY(-20px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "58vh",
    backgroundColor: "#f5f5f5",
    padding: "10px",
  },
  formsContainer: {
    display: "flex",
    gap: "1rem",
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
  },
  formBox: {
    flex: 1,
    backgroundColor: "#333", // Dark gray background color
    padding: "0.5rem",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#fff", // White heading color
    marginBottom: "1.5rem",
    fontFamily: "Yatra One",
  },
  formGroup: {
    marginBottom: "0.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#00ffff", // Cyan label color
    fontWeight: "600",
    fontFamily: "Almendra",
  },
  input: {
    width: "95%",
    padding: "0.75rem",
    border: "1px solid #00ffff", // Cyan border color
    borderRadius: "4px",
    fontSize: "1rem",
    color: "aliceblue", // Alice blue input text color
    backgroundColor: "#333", // Dark gray background color
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#333", // Dark gray background color
    color: "#00ffff", // Cyan text color
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  errorMessage: {
    backgroundColor: "#fff3f3",
    color: "#dc3545",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    textAlign: "center",
    border: "1px solid #ffcdd2",
  },
  toggleText: {
    textAlign: "center",
    marginTop: "1rem",
    color: "#666",
  },
  toggleLink: {
    color: "#00ffff", // Cyan link color
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: "0.5rem",
  },
};

const API_BASE_URL = "http://localhost:5000/api/v1"; // Remove /users from base URL

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState({ login: "", signup: "" });
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isSendOTP, setIsSendOTP] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    // Add event listener for page refresh
    const handleBeforeUnload = () => {
      localStorage.removeItem("userToken");
      setIsLoggedIn(false);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setError((prev) => ({ ...prev, login: "" }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setError((prev) => ({ ...prev, signup: "" }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError((prev) => ({ ...prev, login: "" }));

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: loginData.email.toLowerCase(),
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store tokens and user data
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("userData", JSON.stringify(data.data.user));

      if (data.data.user?.ethAddress) {
        localStorage.setItem("walletAddress", data.data.user.ethAddress);
      }

      // Dispatch custom event to notify Navbar
      window.dispatchEvent(new Event("loginStateChanged"));

      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setError((prev) => ({
        ...prev,
        login: err.message || "Invalid email or password",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to continue");
      }

      setIsLoading(true);
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      setWalletAddress(address);
      setIsWalletConnected(true);

      // Add wallet address to signup data
      setSignupData((prev) => ({
        ...prev,
        walletAddress: address,
      }));

      return address;
    } catch (error) {
      setError((prev) => ({
        ...prev,
        signup: error.message || "Failed to connect wallet",
      }));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError((prev) => ({ ...prev, signup: "" }));

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError((prev) => ({
        ...prev,
        signup: "Passwords do not match",
      }));
      return;
    }

    // Connect wallet if not already connected
    if (!isWalletConnected) {
      const address = await connectWallet();
      if (!address) return; // Stop if wallet connection failed
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: signupData.name,
          email: signupData.email,
          password: signupData.password,
          otp: signupData.otp,
          ethAddress: walletAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store the token, user data, and wallet address
      localStorage.setItem("userToken", data.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...data.user,
          walletAddress: walletAddress,
        })
      );
      localStorage.setItem("walletAddress", walletAddress);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setError((prev) => ({
        ...prev,
        signup: err.message || "Signup failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    setIsSendOTP(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/current-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error checking login status:", error);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const WalletConnectButton = () => (
    <button
      type="button"
      style={{
        ...styles.button,
        marginBottom: "1rem",
        backgroundColor: isWalletConnected ? "#28a745" : "#007bff",
      }}
      onClick={connectWallet}
      disabled={isWalletConnected}
    >
      {isWalletConnected
        ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : "Connect MetaMask"}
    </button>
  );

  // Add this function to check stored data
  const checkStoredData = () => {
    const userData = localStorage.getItem("userData");
    const accessToken = localStorage.getItem("accessToken");
    const walletAddress = localStorage.getItem("walletAddress");

    console.log("Stored User Data:", userData);
    console.log("Access Token:", accessToken);
    console.log("Wallet Address:", walletAddress);
  };

  // Add this to your useEffect to verify data is being stored
  useEffect(() => {
    if (isLoggedIn) {
      checkStoredData();
    }
  }, [isLoggedIn]);

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button style={styles.closeButton} onClick={() => navigate("/")}>
          ×
        </button>
        <div style={styles.formsContainer}>
          {isLoginView ? (
            <div style={styles.formBox}>
              <h2 style={styles.heading}>Login</h2>
              {error.login && (
                <div style={styles.errorMessage}>{error.login}</div>
              )}
              <form onSubmit={handleLoginSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  autoFocus
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#00ffff", // Cyan border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#00ffff", // Cyan border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff", // Cyan border color on focus
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "aliceblue", // Alice blue input text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#00ffff", // Cyan label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#00ffff", // Cyan label color on focus
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#00ffff", // Cyan border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#00ffff", // Cyan border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff", // Cyan border color on focus
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "aliceblue", // Alice blue input text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#00ffff", // Cyan label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#00ffff", // Cyan label color on focus
                    },
                  }}
                />
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    backgroundColor:
                      isLoggedIn || isLoading ? "#cccccc" : "#333", // Dark gray background color
                    cursor: isLoggedIn || isLoading ? "not-allowed" : "pointer",
                  }}
                  disabled={isLoggedIn || isLoading}
                  onMouseOver={
                    (e) =>
                      !isLoggedIn &&
                      !isLoading &&
                      (e.target.style.backgroundColor = "#555") // Slightly lighter dark gray on hover
                  }
                  onMouseOut={
                    (e) =>
                      !isLoggedIn &&
                      !isLoading &&
                      (e.target.style.backgroundColor = "#333") // Dark gray background color
                  }
                >
                  {isLoading
                    ? "Loading..."
                    : isLoggedIn
                    ? "Already Logged In"
                    : "Login"}
                </button>
              </form>
              <div style={styles.toggleText}>
                Don't have an account?
                <span
                  style={styles.toggleLink}
                  onClick={() => setIsLoginView(false)}
                >
                  Sign up
                </span>
              </div>
            </div>
          ) : (
            <div style={styles.formBox}>
              <h2 style={styles.heading}>Sign Up</h2>
              {error.signup && (
                <div style={styles.errorMessage}>{error.signup}</div>
              )}
              <form onSubmit={handleSignupSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  autoFocus
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#00ffff", // Cyan border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#00ffff", // Cyan border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff", // Cyan border color on focus
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "aliceblue", // Alice blue input text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#00ffff", // Cyan label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#00ffff", // Cyan label color on focus
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#00ffff", // Cyan border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#00ffff", // Cyan border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff", // Cyan border color on focus
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "aliceblue", // Alice blue input text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#00ffff", // Cyan label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#00ffff", // Cyan label color on focus
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#00ffff", // Cyan border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#00ffff", // Cyan border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff", // Cyan border color on focus
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "aliceblue", // Alice blue input text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#00ffff", // Cyan label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#00ffff", // Cyan label color on focus
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#00ffff", // Cyan border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#00ffff", // Cyan border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff", // Cyan border color on focus
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "aliceblue", // Alice blue input text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#00ffff", // Cyan label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#00ffff", // Cyan label color on focus
                    },
                  }}
                />
                <button
                  type="button"
                  style={styles.button}
                  onClick={handleOTPVerify}
                  disabled={!signupData.email}
                >
                  Send OTP
                </button>
                <TextField
                  margin="normal"
                  disabled={!isSendOTP}
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  value={signupData.otp}
                  onChange={handleSignupChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#00ffff", // Cyan border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#00ffff", // Cyan border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff", // Cyan border color on focus
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "aliceblue", // Alice blue input text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#00ffff", // Cyan label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#00ffff", // Cyan label color on focus
                    },
                  }}
                />

                <WalletConnectButton />
                <button
                  type="submit"
                  style={styles.button}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
                >
                  Sign Up
                </button>
              </form>
              <div style={styles.toggleText}>
                Already have an account?
                <span
                  style={styles.toggleLink}
                  onClick={() => setIsLoginView(true)}
                >
                  Login
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
