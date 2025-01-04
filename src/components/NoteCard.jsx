
import { useEffect, useRef, useState } from 'react';
import styles from './NoteCard.module.css';
import { usePocket } from '../PbContext';
import trash from '../../public/trash.svg';

const NoteCard = ({ note, tags, refreshNotesAndTags }) => {

    // global state
    const { pb, updateNote, user, deleteNote, createTag } = usePocket();
    // local state
    const [noteTags, setNoteTags] = useState([]);
    const [isEditNote, setIsEditNote] = useState(false);
    // refs
    const tagListRef = useRef();
    const noteRef = useRef();
    const bodyRef = useRef();

    const handleUpdateNote = async () => {
        if (noteRef.current.textContent === "") {
            // note empty
            // delete note
            await deleteNote(note.id);
        }
        else {
            // extract tag titles from the input
            const tagTitles = [...bodyRef.current.innerText.matchAll(/#(\w+)(?=\s|$)/g)].map(match => match[1]);
            // get body content with line breaks
            const body = bodyRef.current.innerText.replace(/#\w+/g, "").trim().replace(/\n/g, "<br/>");
            // make list for tag ids
            let newNoteTags = [...note.tags];
            
            if (tagTitles !== null) {
                // convert the titles to ids
                for (let i = 0; i < tagTitles.length; i++) {
                    const curTag = tags.filter((tag) => tag.title === tagTitles[i])[0];
                    if (curTag) {
                        newNoteTags.push(curTag.id);
                    }
                    else {
                        // api call: create tag
                        const res = await createTag(tagTitles[i], user.id);
                        newNoteTags.push(res.id);
                    }
                }
            }
            
            // api call: update note
            await updateNote(note.id, body, user.id, newNoteTags);

            // close edit mode
            setIsEditNote(false);
            noteRef.current.style.zIndex = '1';

            bodyRef.current.dangerouslySetInnerHTML = body;
        }
        // refresh notes
        await refreshNotesAndTags();
    }

    const handleDeleteNote = async () => {
        await deleteNote(note.id);

        await refreshNotesAndTags();
    }

    useEffect(() => {
        const filteredTags = tags.filter((tag) => note.tags.includes(tag.id));
        setNoteTags(filteredTags);

        if (filteredTags.length !== 0) {
            tagListRef.current.style.marginTop = '1rem';
        }
    }, [note]);

    return (
        <div className={styles.note_container}>
            {isEditNote?
            <button onClick={handleUpdateNote} className={styles.overlay}></button>
            : ''}

            <section 
            ref={noteRef} 
            className={styles.note_card}
             >
                <p 
                ref={bodyRef}
                dangerouslySetInnerHTML={{ __html: note.body }} 
                className={styles.body}
                contentEditable='true'
                onFocus={(e) => {
                    setIsEditNote(true);
                    noteRef.current.style.zIndex = '3';
                }}></p>

                <button onClick={handleDeleteNote} className={styles.btn_icon}>
                    <img className={styles.trash_icon} src={trash} alt="delete" />
                </button>

                <div ref={tagListRef} className={styles.tag_list}>
                    {noteTags.map((tag) => 
                        <p className={styles.tag} key={Math.random()}>{tag.title}</p>
                    )}
                </div>

                <p className={styles.date}>{new Date(note.updated).toLocaleString({
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                })}</p>
            </section>

            {isEditNote?
            <button onClick={handleUpdateNote} className={styles.close_btn}>Close</button>
            : ''}
        </div>
    );
}

export default NoteCard;