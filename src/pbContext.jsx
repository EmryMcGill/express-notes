import Pocketbase from 'pocketbase';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// url for pb TODO: move this to .env
const BASE_URL = 'http://localhost:8090';

// create the pb context
const PbContext = createContext();

export const PbProvider = ({ children }) => {
    // define the pb object 
    const pb = useMemo(() => new Pocketbase(BASE_URL));

    // define user
    const [user, setUser] = useState(pb.authStore.record);

    // listen for changes to the authStore state
    useEffect(() => {
        return pb.authStore.onChange(record => setUser(record));
    })

    // api calls

    // return: [] of notes
    const getNotes = async () => {
        try {
            const res = await pb.collection('notes').getFullList({
                sort: '-created'
            });
            console.log(res)
            return res;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    // return: [] of tags
    const getTags = async () => {
        try {
            const res = await pb.collection('tags').getFullList();
            return res;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    // return: null
    const createNote = async (body, user, tags) => {
        try {
            await pb.collection('notes').create({
                body: body,
                user: user,
                tags: tags
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    const updateNote = async (noteId, body, user, tags) => {
        try {
            await pb.collection('notes').update(noteId, {
                body: body,
                user: user,
                tags: tags
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    const deleteNote = async (noteId) => {
        try {
            await pb.collection('notes').delete(noteId);
        }
        catch (err) {
            console.log(err);
        }
    }

    const createTag = async (title, user) => {
        try {
            const res = await pb.collection('tags').create({
                title: title,
                user: user
            });
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <PbContext.Provider value={{ 
            pb, 
            user, 
            getNotes, 
            createNote, 
            updateNote, 
            deleteNote,
            getTags, 
            createTag
        }}>
        {children}
        </PbContext.Provider>
    );
}

// export custom hook to simplify using useContext
export const usePocket = () => useContext(PbContext);
