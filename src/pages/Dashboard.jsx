import { useCallback, useEffect, useRef, useState } from "react";
import SideMenu from "../components/SideMenu";
import NoteCard from "../components/noteCard";
import NoteCardNew from "../components/NoteCardNew";
import styles from './Dashboard.module.css';
import { usePocket } from "../PbContext";
import { 
    saveNotesOffline, 
    getAllNotesOffline, 
    saveTagsOffline, 
    getAllTagsOffline } from '../db.js';

const Dashboard = () => {

    const mainRef = useRef();
    const searchRef = useRef();
    const { getNotes, getTags, deleteTag } = usePocket();
    const [allNotes, setAllNotes] = useState();
    const [allTags, setAllTags] = useState();
    const [displayedNotes, setDisplayedNotes] = useState();
    const [isNewNote, setIsNewNote] = useState(false);
    const [activeTag, setActiveTag] = useState(null);
    
    // return: null
    const changePageMargin = (isMenu) => {
        if (isMenu) {
            mainRef.current.style.marginLeft = "-250px";
        }
        else {
            mainRef.current.style.marginLeft = "0px";
        }
    }

    // return: [] of filtered notes
    const filterNotes = (tagId) => {
        setActiveTag(tagId);
        return allNotes.filter((note) => note.tags.includes(tagId));
    }

    // return: null
    const search = () => {
        const searchString = searchRef.current.value;
        setDisplayedNotes(allNotes.filter((note) => note.body.includes(searchString)));
    }

    // return null
    const toggleIsNewNote = () => {
        setIsNewNote(!isNewNote);
    }

    // return: null
    const pruneObsoleteTags = async (notes, tags) => {
        // get all tags used by the notes
        let noteTags = [];
        notes.forEach((note) => {
            noteTags.push(...note.tags);
        })
        
        // find all obsolete, and final tags
        const obTags = tags.filter(tag => !noteTags.includes(tag.id));
        const finalTags = tags.filter(tag => noteTags.includes(tag.id));

        // remove obTags
        for (let i = 0; i < obTags.length; i++) {
            await deleteTag(obTags[i].id);
        }

        return finalTags;
    }

    // fetches notes and tags from pb
    // return: null
    const refreshNotesAndTags = async (tagId) => {
        let notes;
        let tags = [];
        if (navigator.onLine) {
            console.log('online')
            // refresh notes from pb
            notes = await getNotes();
            tags = await getTags();

            tags = await pruneObsoleteTags(notes, tags);

            // save notes and tags to offline db
            await saveNotesOffline(notes);
            await saveTagsOffline(tags);
        }
        else {
            console.log('offline')
            // get notes and tags from offline db
            notes = await getAllNotesOffline();
            tags = await getAllTagsOffline();
        }

        setAllNotes(notes);
        setAllTags(tags);

        if (tagId) {
            // filter display notes
            setDisplayedNotes(filterNotes(tagId));
        }
        else {
            setDisplayedNotes([...notes]);
        }
    };

    useEffect(() => {
        refreshNotesAndTags();
    }, []);
    
    return (
    <section className={styles.dashboard}>
        <SideMenu 
        tags={allTags} 
        toggleIsNewNote={(toggleIsNewNote)} 
        refreshNotesAndTags={refreshNotesAndTags} 
        changePageMargin={changePageMargin}
        activeTag={activeTag} />

        <div ref={mainRef} className={styles.main_container}>
            <div className={styles.input_container}>
                <input onChange={search} ref={searchRef} placeholder="Search notes" className={styles.input} type="text" />
            </div>
            <div className={styles.notes_list}>
                {isNewNote ? <NoteCardNew tags={allTags} activeTag={activeTag} refreshNotesAndTags={refreshNotesAndTags} toggleIsNewNote={toggleIsNewNote} /> : ''}

                {displayedNotes === undefined ? 'loading...' : displayedNotes.length === 0 && !isNewNote ? 'no notes found' : displayedNotes.map((note) => 
                    <NoteCard 
                    tags={allTags} 
                    note={note} 
                    key={note.id}
                    refreshNotesAndTags={refreshNotesAndTags} />
                )}
            </div>
        </div>
    </section>);
};

export default Dashboard;