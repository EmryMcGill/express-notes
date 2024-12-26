import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import styles from "./Login.module.css";

import { usePocket } from "../PbContext"; 

const Login = () => {

    const { pb, user } = usePocket();
    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        // check if user is logged in
        if (user) {
            navigate('/app');
        }
    })

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        // attempt to login user
        try {
            await pb.collection("users").authWithPassword(emailRef.current.value, passwordRef.current.value);

            // navigate to app
            navigate('/app');

        }
        catch (err) {
            console.log(err.data.message);
        }
    }

    return (
        <section className={styles.login}>
            <form onSubmit={handleOnSubmit} className={styles.form}>
                <h2 className={styles.h2}>Login</h2>

                <input className={styles.input} type="email" ref={emailRef} placeholder="example@email.com" />
                <input className={styles.input} type="password" ref={passwordRef} placeholder="password" />

                <button className={styles.btn_submit}>Login</button>
            </form>
        </section>
    );
}

export default Login;