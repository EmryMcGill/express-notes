import { useEffect, useState, useRef } from 'react';
import styles from './NoteCardNew.module.css';
import { usePocket } from '../PbContext';

const NoteCardNew = ({ toggleIsNewNote, refreshNotesAndTags, activeTag, tags }) => {

    const { pb, user, createNote, createTag } = usePocket();
    const inputRef = useRef();
    const [defaultTag, setDefaultTag] = useState(null);

    const handleNewNote = async () => {
        // check if note is empty
        if (inputRef.current.textContent === "") {
            // close new note
            toggleIsNewNote();
        }
        else {
            // extract tag titles from the input
            const tagTitles = [...inputRef.current.innerText.matchAll(/#(\w+)(?=\s|$)/g)].map(match => match[1]);
            const body = inputRef.current.innerText.replace(/#\w+/g, "").trim().replace(/\n/g, "<br/>");

            if (defaultTag !== null) {
                tagTitles.push(defaultTag);
            }

            let newNoteTags = [];
            
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
            
            // api call: create note
            await createNote(body, user.id, newNoteTags);

            // close new note
            toggleIsNewNote();
            // refresh notes
            refreshNotesAndTags();
        }
    }

    const getTagTitle = async (tagId) => {
        try {
            const res = await pb.collection('tags').getOne(tagId);
            setDefaultTag(res.title);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        inputRef.current.focus();
        if (activeTag !== null) {
            getTagTitle(activeTag);
        }
    }, [])

    return (
        <div>
            <button onClick={handleNewNote} className={styles.overlay}></button>

            <section className={styles.note_card}>
                <span ref={inputRef} className={styles.input_area} contentEditable="true"></span>

                {defaultTag ? 
                <p className={styles.tag}>{defaultTag}</p> 
                : ''}
                
            </section>
        </div>
        
    );
}

export default NoteCardNew;