import { useRef } from "react";
import { useNavigate } from "react-router";

import { usePocket } from "../PbContext";

const Register = () => {

    const { pb } = usePocket();
    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        // get form data
        const data = {
            "email": emailRef.current.value,
            "password": passwordRef.current.value,
            "passwordConfirm": passwordConfirmRef.current.value
        }

        // attempt to register user
        try {
            await pb.collection("users").create(data);

            // redirect to login page on sucess
            navigate('/login');
        }
        catch (err) {
            console.log('error with register')
            console.log(err?.data);
        }
    }

    return (
        <section>
            <h2>Login</h2>

            <form onSubmit={handleOnSubmit}>
                <input type="email" ref={emailRef} />
                <input type="password" ref={passwordRef} />
                <input type="password" ref={passwordConfirmRef} />

                <button>Register</button>
            </form>
        </section>
    );
}

export default Register;