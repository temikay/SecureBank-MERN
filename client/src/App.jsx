import {
    useEffect,
    useState
} from "react";

import {
    Navigate,
    Outlet
} from "react-router-dom";

import api from "../services/api";


function ProtectedRoute() {

    const [
        checkingAuth,
        setCheckingAuth
    ] = useState(true);

    const [
        authenticated,
        setAuthenticated
    ] = useState(false);


    useEffect(() => {

        let mounted = true;


        const verifyAuthentication =
            async () => {

                try {

                    await api.get(
                        "/users/me"
                    );

                    if (mounted) {

                        setAuthenticated(true);

                    }

                } catch (error) {

                    if (mounted) {

                        setAuthenticated(false);

                    }

                } finally {

                    if (mounted) {

                        setCheckingAuth(false);

                    }

                }

            };


        verifyAuthentication();


        return () => {

            mounted = false;

        };

    }, []);


    if (checkingAuth) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                Verifying authentication...
            </div>

        );

    }


    if (!authenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    return <Outlet />;

}


export default ProtectedRoute;
