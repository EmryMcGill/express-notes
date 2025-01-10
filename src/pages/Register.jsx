import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Login.module.css";

import { usePocket } from "../PbContext";

const Register = () => {

    const { register } = usePocket();
    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const [errMsg, setErrMsg] = useState('');

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        // get form data
        const data = {
            "email": emailRef.current.value,
            "password": passwordRef.current.value,
            "passwordConfirm": passwordConfirmRef.current.value
        }

        // try to register new user
        const res = await register(data);

        if (res === null) {
            // redirect to login page on sucess
            navigate('/login');
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
            <form 
                onSubmit={handleOnSubmit} 
                className={styles.form} 
            >
                <h2 className={styles.h2}>Register</h2>
                
                <input 
                    className={styles.input} 
                    onFocus={() => setErrMsg('')} 
                    type="email" 
                    ref={emailRef} 
                    placeholder="example@email.com" 
                />
                <input 
                    className={styles.input} 
                    onFocus={() => setErrMsg('')} 
                    type="password" 
                    ref={passwordRef} 
                    placeholder="password" 
                />
                <input 
                    className={styles.input} 
                    onFocus={() => setErrMsg('')} 
                    type="password" 
                    ref={passwordConfirmRef} 
                    placeholder="password" 
                />

                <p className={styles.err_msg}>{errMsg}</p>

                <button className={styles.btn_submit}>Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p> 
        </section>
    );
}

export default Register;