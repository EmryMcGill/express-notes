import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Login.module.css";

import { usePocket } from "../PbContext"; 

const Login = () => {

    const { pb, user, login } = usePocket();
    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        // check if user is logged in
        if (user) {
            navigate('/app');
        }
    })

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        // attempt to login user
        const res = await login(emailRef.current.value, passwordRef.current.value);

        if (res === null) {
            // navigate to app
            navigate('/app');
        }
        else {
            setErrMsg(res);
        }
    }

    return (
        <section className={styles.login}>
                    <h2 className={styles.title}>
                        <a className={styles.title_link} href="/">Expresso Notes ☕️</a>
                    </h2>                
                    <form onSubmit={handleOnSubmit} className={styles.form}>
                    <h2 className={styles.h2}>Login</h2>

                    <input onFocus={() => setErrMsg('')} className={styles.input} type="email" ref={emailRef} placeholder="example@email.com" />
                    <input onFocus={() => setErrMsg('')} className={styles.input} type="password" ref={passwordRef} placeholder="password" />

                    <p className={styles.err_msg}>{errMsg}</p>

                    <button className={styles.btn_submit}>Login</button>
                </form>
                
                <p>Don't have an account? <a href="/register">Sign Up</a></p> 
        </section>
    );
}

export default Login;