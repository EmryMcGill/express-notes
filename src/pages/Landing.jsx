import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import styles from "./Landing.module.css";
import { usePocket } from "../PbContext";
import github from '../../public/icons/github.svg';
import email from '../../public/icons/email.svg';
import portfolio from '../../public/icons/portfolio.svg';


const Landing = () => {

    const navigate = useNavigate();
    const videoRef = useRef();
    const { user } = usePocket();

    const handleLoginBtn = () => {
        navigate('/login');
    }

    const handleRegisterBtn = () => {
        navigate('/register');
    }

    useEffect(() => {
        if (user) {
            navigate('/app');
        }
        videoRef.current.playbackRate = 2;
    }, []);

    return (
    <section className={styles.landing}>
        <div className={styles.header}>
            <h2 className={styles.title}>Expresso Notes ☕️</h2>
            <h2 className={styles.title_icon}>☕️</h2>
            <div className={styles.header_right}>
                <button className={styles.btn} onClick={handleLoginBtn}>Login</button>
                <button onClick={handleRegisterBtn}>Sign Up</button>
            </div>
        </div>

        <div className={styles.content}>
            <div className={styles.hero_container}>
                <div className={styles.hero_text}>
                    <h1 className={styles.hero_title}>
                        Create and<br/>organize notes<br/>efficiently
                    </h1>
                    <p className={styles.info_desc}>
                        Easily jot down notes and keep everything organized.
                    </p>
                </div>
                <img className={styles.hero_img} src="/hero.png" alt="Hero Image" />
            </div>

            <div className={styles.info_section}>
                <div className={styles.info_text}>
                    <h2 className={styles.info_title}>Create notes wherever you are, on any device</h2>
                    <p className={styles.info_desc}>
                    Expresso Notes is an offline-first, installable app. 
                    You can install it on your phone or computer and use it 
                    without an internet connection. Once you're back online, 
                    it will automatically sync your notes.
                    </p>
                </div>

                <video ref={videoRef} className={styles.info_vid} autoPlay muted loop>
                    <source src='/tag_demo.mov' />
                </video>
            </div>

            <div className={styles.info_section}>
                <video ref={videoRef} className={`${styles.info_vid} ${styles.info_vid_top}`} autoPlay muted loop>
                    <source src='/tag_demo.mov' />
                </video>

                <div className={styles.info_text}>
                    <h2 className={styles.info_title}>Organize your notes with ease</h2>
                    <p className={styles.info_desc}>
                    Organize your notes effortlessly by adding tags to group 
                    them into meaningful categories.
                    </p>
                </div>

                <video ref={videoRef} className={`${styles.info_vid} ${styles.info_vid_bot}`} autoPlay muted loop>
                    <source src='/tag_demo.mov' />
                </video>
            </div>
        </div>

        <div className={styles.footer}>
            <p>Made by Emry Mcgill</p>
            <div className={styles.footer_icon_container}>
                <a rel="noopener noreferrer" target="_blank" href="https://github.com/EmryMcGill">
                    <img className={styles.menu_icon} src={github} alt="github" />
                </a>
                <a rel="noopener noreferrer" target="_blank" href="mailto:emrymcgill@gmail.com">
                    <img className={styles.menu_icon} src={email} alt="email" />
                </a>
                <a rel="noopener noreferrer" target="_blank" href="https://emrymcgill.com">
                    <img className={styles.menu_icon} src={portfolio} alt="portfolio" />
                </a>
            </div>
        </div>
    </section>
    );
};

export default Landing;