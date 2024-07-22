import React, { useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Signup.css'

export default function Signup() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        if (!username || !email || !password) {
            setError("Please fill all fields")
            return
        }
        Axios.post("http://localhost:3000/auth/signup", {
            username,
            email,
            password
        }).then((response) => {
            if (response.data.status) {
                navigate("/login")
            }
        }).catch(() => {
            setError("Internal error occurred, please try again.")
        })
    }

    return (
        <div className="signup-container">
            <h2 className="signup-title">Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username: </label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email: </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password: </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
                <div className="signup-link">
                    <p className="signup-text">Already have an account?</p>
                    <button onClick={() => navigate("/login")} className="login-button">Login</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    )
}
