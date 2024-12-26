
import styles from "./SideMenu.module.css";
import menu from '../../public/menu.svg';
import { useRef, useState } from "react";


const SideMenu = () => {

    const menuRef = useRef();
    const [isMenu, setIsMenu] = useState(true);

    const toggleMenu = () => {
        if (isMenu) {
            menuRef.current.style.transform = "translateX(-250px)";
            setIsMenu(false);
        }
        else {
            menuRef.current.style.transform = "translateX(0px)";
            setIsMenu(true);
        }
    }

    return (
        <div ref={menuRef} className={styles.side_menu_outer}>
            <div className={styles.side_menu}>
                <h2 className={styles.h1}>Express Notes</h2>

                <h2>Tags</h2>
                <div className={styles.tag_list}>
                    <button className={styles.btn_tag}>app ideas</button>
                    <button className={styles.btn_tag}>vafy long title</button>
                </div>
            </div>
            <button onClick={toggleMenu} className={styles.btn_icon}>
                    <img className={styles.menu_icon} src={menu} alt="menu" />
            </button>
        </div>
    );
}

export default SideMenu;