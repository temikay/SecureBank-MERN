import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import api from "../services/api";


function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate =
        useNavigate();

    const [message, setMessage] = useState({
        type: "",
        text: ""
    });


    const [loading, setLoading] =
        useState(false);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData({
            ...formData,
            [name]: value
        });

    };


    const handleSubmit = async (event) => {

        event.preventDefault();


        setMessage({
            type: "",
            text: ""
        });


        if (
            !formData.email.trim() ||
            !formData.password
        ) {

            setMessage({
                type: "error",
                text:
                    "Email and password are required."
            });

            return;

        }


        setLoading(true);


        try {

            const response =
                await api.post(
                    "/auth/login",
                    {
                        email:
                            formData.email
                                .trim()
                                .toLowerCase(),

                        password:
                            formData.password
                    }
                );


            if (response.data.success) {

                setMessage({

                    type: "success",

                    text:
                        `Welcome back, ${response.data.user.name}.`

                });


                setTimeout(() => {

                    navigate("/dashboard");
                                
                }, 500);

            }

        }

        catch (error) {

            setMessage({

                type: "error",

                text:
                    error.response?.data?.message ||
                    "Login failed. Please try again."

            });

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <main className="page-container">

            <div className="auth-card">

                <div className="auth-icon">
                    🔐
                </div>


                <h1>
                    Welcome Back
                </h1>


                <p>
                    Securely access your SecureBank
                    account.
                </p>


                <form
                    onSubmit={handleSubmit}
                    noValidate
                >

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            maxLength={254}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            maxLength={128}
                        />

                    </div>


                    {message.text && (

                        <div
                            className={`form-message ${message.type}`}
                        >
                            {message.text}
                        </div>

                    )}


                    <button
                        type="submit"
                        className="primary-button full-width"
                        disabled={loading}
                    >

                        {loading
                            ? "Authenticating..."
                            : "Login Securely"}

                    </button>

                </form>


                <p className="auth-footer">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create one
                    </Link>

                </p>

            </div>

        </main>

    );

}


export default Login;