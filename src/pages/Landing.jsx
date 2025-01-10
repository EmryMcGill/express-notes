import { useEffect, useRef } from "react";
import styles from "./Landing.module.css";

const Landing = () => {

    const videoRef = useRef();

    useEffect(() => {
        videoRef.current.playbackRate = 2;
    }, []);

    return (
    <section className={styles.landing}>
        <div className={styles.header}>
            <h2 className={styles.title}>Expresso Notes ☕️</h2>
            <div className={styles.header_right}>
                <button className={styles.btn}>Login</button>
                <button>Sign Up</button>
            </div>
        </div>

        <div className={styles.content}>
            <div className={styles.hero_container}>
                <div className={styles.info_text}>
                    <h1 className={styles.hero_text}>
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

                <img className={styles.info_img} src="" alt="offline support" />
            </div>

            <div className={styles.info_section}>
                <video ref={videoRef} className={styles.info_vid} autoPlay muted loop>
                    <source src='/tag_demo.mov' />
                </video>

                <div className={styles.info_text}>
                    <h2 className={styles.info_title}>Organize your notes with ease</h2>
                    <p className={styles.info_desc}>
                    Organize your notes effortlessly by adding tags to group 
                    them into meaningful categories.
                    </p>
                </div>
            </div>
        </div>

        <div className={styles.footer}>
            <div className={styles.header_right}>
                <button className={styles.btn}>App</button>
                <button className={styles.btn}>Login</button>
                <button className={styles.btn}>Sign Up</button>
            </div>
            <p>Made by Emry Mcgill</p>
            
        </div>
    </section>
    );
};

export default Landing;