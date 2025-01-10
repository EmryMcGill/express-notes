import { useEffect, useState, useRef } from 'react';
import styles from './NoteCardNew.module.css';
import { usePocket } from '../PbContext';
import { saveNotesOffline, saveTagsOffline } from '../db';

const NoteCardNew = ({ toggleIsNewNote, refreshNotesAndTags, activeTag, tags }) => {

    const { pb, createNote, createTag } = usePocket();
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
                        if (navigator.onLine) {
                            // create tag local and remote
                            const res = await createTag({
                                title: tagTitles[i], 
                                user: pb.authStore.record.id
                            });
                            await saveTagsOffline([res]);
                            newNoteTags.push(res.id);
                        }
                        else {
                            // just create tag locally
                            const res = {
                                title: tagTitles[i],
                                user: pb.authStore.record.id,
                                isNew: true,
                                toDelete: false,
                                created: new Date(),
                                updated: new Date(),
                                id: (Date.now().toString() + Math.floor(Math.random() * 1e8).toString()).slice(0, 15)
                            };
                            await saveTagsOffline([res]);
                            newNoteTags.push(res.id);
                        }   
                    }
                }
            }

            if (navigator.onLine) {
                // create note in pb and db
                //console.log('user on creation:', user.id)
                const res = await createNote({
                    body: body,
                    user: pb.authStore.record.id,
                    tags: newNoteTags,
                    toDelete: false
                });
                await saveNotesOffline([res]);
            }
            else {
                // just create note in db
                await saveNotesOffline([{
                    body: body,
                    user: pb.authStore.record.id,
                    tags: newNoteTags,
                    isNew: true,
                    toDelete: false,
                    toUpdate: false,
                    created: new Date(),
                    updated: new Date(),
                    id: (Date.now().toString() + Math.floor(Math.random() * 1e8).toString()).slice(0, 15)   
                }])
            }
            

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
        <div className={styles.note_container}>
            <button onClick={handleNewNote} className={styles.overlay}></button>

            <section className={styles.note_card}>
                <span ref={inputRef} className={styles.input_area} contentEditable="true"></span>

                {defaultTag ? 
                <p className={styles.tag}>{defaultTag}</p> 
                : ''}
                <button onClick={handleNewNote} className={styles.close_btn}>Close</button>
            </section>            
        </div>
        
    );
}

export default NoteCardNew;