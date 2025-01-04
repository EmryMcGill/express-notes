
import styles from "./SideMenu.module.css";
import menu from '../../public/menu.svg';
import { useEffect, useRef, useState } from "react";

const SideMenu = ({ 
    changePageMargin, 
    refreshNotesAndTags, 
    toggleIsNewNote, 
    tags,
    activeTag
 }) => {

    // variables
    const menuRef = useRef();
    const tagListRef = useRef();
    const [isMenu, setIsMenu] = useState(true);

    const toggleMenu = () => {
        if (isMenu) {
            menuRef.current.style.transform = "translateX(-250px)";
            changePageMargin(isMenu);
            setIsMenu(false);
        }
        else {
            menuRef.current.style.transform = "translateX(0px)";
            changePageMargin(isMenu)
            setIsMenu(true);
        }
    }

    const handleTagClick = (e, id) => {
        refreshNotesAndTags(id);
        tagListRef.current.childNodes.forEach((node) => node.style.backgroundColor = 'transparent');
        e.target.style.backgroundColor = '#e6ebf0';
    }

    useEffect(() => {
        if (activeTag === null) {
            tagListRef.current.childNodes[0].style.backgroundColor = '#e6ebf0';
        }
    }, []);

    return (
        <div ref={menuRef} className={styles.side_menu_outer}>
            <div className={styles.side_menu}>
                <a className={styles.h1} href="/app">Espresso Notes ☕️</a>

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
            </div>

            <button onClick={toggleMenu} className={styles.btn_icon}>
                    <img className={styles.menu_icon} src={menu} alt="menu" />
            </button>
        </div>
    );
}

export default SideMenu;