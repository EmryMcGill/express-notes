import styles from "./Landing.module.css";

const Landing = () => {
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
                <img className={styles.info_img} src="" alt="offline support" />

                <div className={styles.info_text}>
                    <h2 className={styles.info_title}>Organize your notes with ease</h2>
                    <p className={styles.info_desc}>
                    Add tags to your notes to organize them into categories.
                    </p>
                </div>
            </div>
        </div>
    </section>
    );
};

export default Landing;