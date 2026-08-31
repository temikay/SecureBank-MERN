import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";


function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const loadUser =
            async () => {

                try {

                    const response =
                        await api.get(
                            "/users/me"
                        );


                    if (
                        response.data.success
                    ) {

                        setUser(
                            response.data.user
                        );

                    }

                }

                catch (error) {

                    navigate("/login");

                }

                finally {

                    setLoading(false);

                }

            };


        loadUser();

    }, [navigate]);


    const handleLogout =
        async () => {

            try {

                await api.post(
                    "/auth/logout"
                );

            }

            finally {

                navigate("/login");

            }

        };


    if (loading) {

        return (
            <main className="page-container">

                <p>
                    Loading secure dashboard...
                </p>

            </main>
        );

    }


    if (!user) {
        return null;
    }


    return (

        <main className="dashboard">

            <nav className="dashboard-nav">

                <div className="logo">
                    🛡️ SecureBank
                </div>


                <button
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>

            </nav>


            <section className="dashboard-content">

                <div className="dashboard-heading">

                    <div>

                        <p className="eyebrow">
                            SECURE DASHBOARD
                        </p>

                        <h1>
                            Welcome, {user.name}
                        </h1>

                    </div>


                    <div className="protected-badge">
                        🛡️ Protected
                    </div>

                </div>


                <div className="balance-card">

                    <p>
                        Available Balance
                    </p>

                    <h2>
                        ₦{Number(
                            user.balance
                        ).toLocaleString()}
                    </h2>

                    <span>
                        Account No. {user.accountNumber}
                    </span>

                </div>


                <div className="dashboard-grid">

                    <div className="dashboard-card">

                        <div className="card-icon">
                            🔐
                        </div>

                        <h3>
                            Account Security
                        </h3>

                        <p>
                            Your account is protected
                            by authentication and
                            brute-force mitigation.
                        </p>

                        <span className="secure-status">
                            ● Secure
                        </span>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            💳
                        </div>

                        <h3>
                            Transactions
                        </h3>

                        <p>
                            Send and receive funds
                            through protected
                            transactions.
                        </p>

                        <button className="card-button">
                            Coming Soon
                        </button>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            🛡️
                        </div>

                        <h3>
                            Security Center
                        </h3>

                        <p>
                            Monitor security events
                            and detected threats.
                        </p>

                        <button className="card-button">
                            Coming Soon
                        </button>

                    </div>

                </div>

            </section>

        </main>

    );

}


export default Dashboard;