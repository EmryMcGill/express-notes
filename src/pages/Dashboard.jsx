import { useEffect, useRef, useState } from "react";
import SideMenu from "../components/SideMenu";
import NoteCard from "../components/NoteCard";
import NoteCardNew from "../components/NoteCardNew";
import styles from './Dashboard.module.css';
import { usePocket } from "../PbContext";
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
    const [isMenu, setIsMenu] = useState();

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
            if (await getNotes() !== null) {
                // delete tag from local and remote
                await deleteTag(obTags[i].id);
                await deleteTagsOffline([obTags[i]]);
            }
            else {
                // just delete from remote
                await saveTagsOffline([{...obTags[i], toDelete: true}]);
            }
        }
        return finalTags;
    }

    // to resync db with pb
    const syncOnline = async () => {

        let remoteNotes = await getNotes();
        let localNotes = await getAllNotesOffline();

        let remoteTags = await getTags();
        let localTags = await getAllTagsOffline();


        // go over any deleted local notes and delete on remote
        const notesToDelete = localNotes.filter(note => note.toDelete === true);
        for (const note of notesToDelete) {
            if (remoteNotes.some(n => n.id === note.id)) {
                await deleteNote(note.id);
            }   
            await deleteNotesOffline([note]);

            localNotes = localNotes.filter(n => n.id !== note.id);
            remoteNotes = localNotes.filter(n => n.id !== note.id);
        }
        // Go over any deleted local tags and delete on remote
        const tagsToDelete = localTags.filter(tag => tag.toDelete === true);
        for (const tag of tagsToDelete) {
            if (remoteTags.some(t => t.id === tag.id)) {
                await deleteTag(tag.id);
            }
            await deleteTagsOffline([tag]);

            localTags = localTags.filter(t => t.id !== tag.id);
            remoteTags = localTags.filter(t => t.id !== tag.id);
        }

        // go over any new local tags and save to remote
        const tagsToAdd = localTags.filter(tag => tag.isNew === true);
        for (const tag of tagsToAdd) {
            await createTag({...tag, isNew: false});
            await saveTagsOffline([{...tag, isNew: false}]);

            localTags.push({...tag, isNew: false});
            localTags.push({...tag, isNew: false});
        }
        // go over any new local notes and save to remote
        const notesToAdd = localNotes.filter(note => note.isNew === true);
        for (const note of notesToAdd) {
            await createNote({...note, isNew: false});
            await saveNotesOffline([{...note, isNew: false}]);

            localNotes.push({...note, isNew: false});
            remoteNotes.push({...note, isNew: false});
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
        // Go over any new remote tags and save locally
        remoteTags.forEach(async tag => {
            await saveTagsOffline([tag]);

            if (!localTags.some(t => t.id === tag.id)) {
                localTags.push(tag);
            } else {
                localTags = localTags.filter(t => t.id !== tag.id);
                localTags.push(tag);
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
        // If any tags were deleted remotely, delete them locally
        localTags.forEach(async tag => {
            if (!remoteTags.some(t => t.id === tag.id)) {
                // Delete tag locally
                await deleteTagsOffline([tag]);

                localTags = localTags.filter(t => t.id !== tag.id);
            }
        });
    }

    // fetches notes and tags from pb
    // return: null
    const refreshNotesAndTags = async (tagId) => {
        let notes;
        let tags = [];
        if (await getNotes() !== null) {
            console.log('online')
            alert('online')

            await syncOnline();

            notes = await getAllNotesOffline();
            tags = await getAllTagsOffline();
            tags = await pruneObsoleteTags(notes, tags);
        }
        else {
            console.log('offline')
            alert('offline')
            // get notes and tags from offline db
            notes = await getAllNotesOffline();
            notes = notes.filter(note => note.toDelete === false);
            tags = await getAllTagsOffline();
            tags = await pruneObsoleteTags(notes, tags);
        }

        setAllNotes(notes);
        setAllTags(tags);

        if (tagId) {
            // filter display notes
            setDisplayedNotes(filterNotes(tagId));
        }
        else {
            setDisplayedNotes([...notes]);
            setActiveTag(null);
        }
    };

    useEffect(() => {
        refreshNotesAndTags();

        // listen for network changes
        window.addEventListener("online", refreshNotesAndTags);
    }, []);
    
    return (
    <section className={styles.dashboard}>
        <SideMenu 
        tags={allTags} 
        toggleIsNewNote={(toggleIsNewNote)} 
        refreshNotesAndTags={refreshNotesAndTags} 
        changeIsMenu={(val) => setIsMenu(val)}
        activeTag={activeTag} />

        <div ref={mainRef} className={`${styles.main_container} ${isMenu ? styles.open : ''}`}>
            <div className={styles.input_container}>
                <input onChange={search} ref={searchRef} placeholder="Search notes" className={styles.input} type="text" />
            </div>
            <div className={styles.notes_list}>
                <button onClick={toggleIsNewNote} className={styles.new_note_btn_mobile}>+ New Note</button>
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