
import styles from "./SideMenu.module.css";
import menu from '../../public/menu.svg';
import { useEffect, useRef, useState } from "react";
import { usePocket } from "../PbContext"; 

const SideMenu = ({ 
    changeIsMenu, 
    refreshNotesAndTags, 
    toggleIsNewNote, 
    tags,
    activeTag
 }) => {

    const { pb } = usePocket();

    // variables
    const menuRef = useRef();
    const tagListRef = useRef();
    const [isMenu, setIsMenu] = useState();

    const toggleMenu = () => {
        if (isMenu) {
            changeIsMenu(false);
            setIsMenu(false);
        }
        else {
            changeIsMenu(true);
            setIsMenu(true);
        }
    }

    const handleTagClick = (e, id) => {
        refreshNotesAndTags(id);
        tagListRef.current.childNodes.forEach((node) => node.style.backgroundColor = 'transparent');
        e.target.style.backgroundColor = '#e6ebf0';
    }

    const handleLogout = async () => {
        try {
            await pb.authStore.clear();
        }
        catch (err) {
            console.log(err);
        }
    }

    // toggle menu on window resize
    const handleResize = () => {
        if (window.innerWidth < 650) {
            // screen is small
            // close menu
            setIsMenu(false);
            changeIsMenu(false);
        }
        else {
            setIsMenu(true);
            changeIsMenu(true);
        }
    }

    useEffect(() => {
        if (activeTag === null) {
            tagListRef.current.childNodes[0].style.backgroundColor = '#e6ebf0';
        }

        // handle toggle on load
        handleResize();

        // listen for window resizing
        window.addEventListener('resize', handleResize);

    }, []);

    return (
        <div ref={menuRef} className={`${styles.side_menu_outer} ${isMenu ? styles.open : ''}`}>
            <div className={styles.side_menu}>                    
                <a className={styles.h1} href="/app">Expresso Notes ☕️</a>

                <button onClick={toggleIsNewNote} className={styles.btn_new_note}>+ New Note</button>
                
                <h2 className={styles.h2}>Tags</h2>
                <div ref={tagListRef} className={styles.tag_list}>
                    <button 
                        className={styles.btn_tag}
                        onClick={(e) => handleTagClick(e)} > 
                        All Notes</button>

                    {tags === undefined ? 'loading...' : tags.map((tag) => 
                            <button 
                                className={styles.btn_tag}
                                key={tag.id}
                                onClick={(e) => handleTagClick(e, tag.id)} > 
                            {tag.title}</button>
                    )}
                </div>

                <button onClick={handleLogout} className={styles.logout_btn}>Logout</button>
            </div>

            <button onClick={toggleMenu} className={styles.btn_icon}>
                    <img className={styles.menu_icon} src={menu} alt="menu" />
            </button>
        </div>
    );
}

export default SideMenu;