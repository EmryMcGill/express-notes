import { useCallback, useEffect, useRef, useState } from "react";
import SideMenu from "../components/SideMenu";
import NoteCard from "../components/noteCard";
import NoteCardNew from "../components/NoteCardNew";
import styles from './Dashboard.module.css';
import { PbProvider, usePocket } from "../PbContext";
import { 
    saveNotesOffline, 
    getAllNotesOffline,
    deleteNotesOffline, 
    saveTagsOffline, 
    getAllTagsOffline,
    deleteTagsOffline } from '../db.js';

const Dashboard = () => {

    const mainRef = useRef();
    const searchRef = useRef();
    const { 
        pb,
        getNotes, 
        getTags, 
        deleteTag, 
        createNote,
        updateNote, 
        deleteNote,
        createTag,
    } = usePocket();
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
    const pruneObsoleteTags = async (notes, tags) => {
        // get all tags used by the notes
        let noteTags = [];
        notes.forEach((note) => {
            noteTags.push(...note.tags);
        })
        
        // find all obsolete, and final tags
        const obTags = tags.filter(tag => !noteTags.includes(tag.id));
        const finalTags = tags.filter(tag => noteTags.includes(tag.id));

        // remove obTags from pb and db
        for (let i = 0; i < obTags.length; i++) {
            if (navigator.onLine) {
                await deleteTag(obTags[i].id);
                await deleteTagsOffline([obTags[i]]);
            }
            else {
                await deleteTagsOffline([obTags[i]]);
            }
        }
        return finalTags;
    }

    // to resync db with pb
    const syncOnline = async () => {

        let remoteNotes = await getNotes();
        console.log('remote notes: ', remoteNotes)
        
        let localNotes = await getAllNotesOffline();
        console.log('local notes: ', localNotes)

        // go over any new local notes and save to remote
        const notesToAdd = localNotes.filter(note => note.isNew === true);
        for (const note of notesToAdd) {
            await createNote({...note, isNew: false});
            await saveNotesOffline([{...note, isNew: false}]);

            localNotes.push({...note, isNew: false});
            remoteNotes.push({...note, isNew: false});
        }

        // go over any deleted local notes and delete on remote
        const notesToDelete = localNotes.filter(note => note.toDelete === true);
        for (const note of notesToDelete) {
            await deleteNote(note.id);
            await deleteNotesOffline([note]);

            localNotes = localNotes.filter(n => n.id !== note.id);
            remoteNotes = localNotes.filter(n => n.id !== note.id);
        }

        // go over any updated local notes and update on remote
        const notesToUpdate = localNotes.filter(note => note.toUpdate === true);
        for (const note of notesToUpdate) {
            await updateNote(note.id, {...note, toUpdate: false});
            await saveNotesOffline([{...note, toUpdate: false}]);

            localNotes = localNotes.filter(n => n.id !== note.id);
            remoteNotes = localNotes.filter(n => n.id !== note.id);

            localNotes.push({...note, toUpdate: false});
            remoteNotes.push({...note, toUpdate: false});
        }


        // go over any new remote notes and save locally
        remoteNotes.forEach(async note => {
            await saveNotesOffline([note]);

            if (!localNotes.some(n => n.id === note.id)) {
                localNotes.push(note);
            }
            else {
                localNotes = localNotes.filter(n => n.id !== note.id);
                localNotes.push(note);
            }
        });

        // if any notes where deleted remotely, delete them on local
        localNotes.forEach(async note => {
            if (!remoteNotes.some(n => n.id === note.id)) {
                // delete note locally
                await deleteNotesOffline([note]);
                
                localNotes = localNotes.filter(n => n.id !== note.id);
            }
        });
            
        const remoteNotes2 = await getNotes();
        console.log('remote notes: ', remoteNotes2)
        
        const localNotes2 = await getAllNotesOffline();
        console.log('local notes: ', localNotes2)

        console.log('done sync')
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

            await syncOnline();

            notes = await getAllNotesOffline();
            tags = await getTags();
        }
        else {
            console.log('offline')
            // get notes and tags from offline db
            notes = await getAllNotesOffline();
            notes = notes.filter(note => note.toDelete === false);
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