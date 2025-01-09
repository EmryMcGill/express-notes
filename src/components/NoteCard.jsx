
import { useEffect, useRef, useState } from 'react';
import styles from './NoteCard.module.css';
import { usePocket } from '../PbContext';
import trash from '../../public/trash.svg';
import { deleteNotesOffline, saveNotesOffline, saveTagsOffline } from '../db';

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
        if (bodyRef.current.textContent === "") {
            if (navigator.onLine) {
                // delete note from both pb and db
                await deleteNote(note.id);
                await deleteNotesOffline([note]);
            }
            else {
                // add toDelete label
                await saveNotesOffline([{...note, toDelete: true}]);
            }
            
        }
        else {
            // extract tag titles from the input
            const tagTitles = [...bodyRef.current.innerText.matchAll(/#(\w+)(?=\s|$)/g)].map(match => match[1]);
            // get body content with line breaks
            const body = bodyRef.current.innerText.replace(/#(\w+)(?=\s|$)/g, "").trim().replace(/\n/g, "<br/>");

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
                        if (navigator.onLine) {
                            // create tag in pb and db
                            const res = await createTag(tagTitles[i], user.id);
                            await saveTagsOffline([res]);
                            newNoteTags.push(res.id);
                        }
                        else {
                            const res = {
                                title: tagTitles[i],
                                user: user.id,
                                created: new Date(),
                                updated: new Date(),
                                id: Math.random()   
                            };
                            await saveTagsOffline([res]);
                            newNoteTags.push(res.id);
                        }
                    }
                }
            }
            
            if (navigator.onLine) {
                // update note in pb and db
                console.log(note.id)
                const res = await updateNote(note.id, {
                    body: body,
                    user: user.id, 
                    tags: newNoteTags
                });
                await saveNotesOffline([res]);
            }
            else {
                // only update locally
                await saveNotesOffline([{
                    body: body,
                    user: user.id,
                    tags: newNoteTags,
                    created: note.created,
                    updated: new Date(),
                    id: note.id,
                    toUpdate: true,
                    toDelete: false,
                    isNew: false
                }]);
            }
            
            // close edit mode
            setIsEditNote(false);
            noteRef.current.style.zIndex = '1';

            // set the body to the updated input
            bodyRef.current.innerHTML = body;
        }
          // refresh notes
          await refreshNotesAndTags();
    }

    const handleDeleteNote = async () => {
        if (navigator.onLine) {
            // delete note from pb + db
            await deleteNote(note.id);
            await deleteNotesOffline([note]);
        }
        else {
            // add toDelete label
            await saveNotesOffline([{...note, toDelete: true}]);
        }
        
        await refreshNotesAndTags();
    }

    useEffect(() => {
        const filteredTags = tags.filter((tag) => note.tags.includes(tag.id));
        setNoteTags(filteredTags);

        if (filteredTags.length !== 0) {
            tagListRef.current.style.marginTop = '1rem';
        }

        //console.log(note)
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
                className={styles.body}
                contentEditable='true'
                dangerouslySetInnerHTML = {{ __html: note.body }}
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