import Pocketbase from 'pocketbase';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// url for pb TODO: move this to .env
const BASE_URL = import.meta.env.VITE_PB_URI;

// create the pb context
const PbContext = createContext();

export const PbProvider = ({ children }) => {
    // define the pb object 
    //const pb = useMemo(() => new Pocketbase(BASE_URL));
    const pb = new Pocketbase(BASE_URL);

    // define user
    const [user, setUser] = useState(pb.authStore.record);

    // listen for changes to the authStore state
    useEffect(() => {
        return pb.authStore.onChange(record => setUser(record));
    })

    // api calls

    // AUTH

    const login = async (email, pass) => {
        // attempt to login user
        try {
            await pb.collection("users").authWithPassword(email, pass);
            return null;
        }
        catch (err) {
            console.log(err.data.message);
            return err.data.message;
        }
    }

    const register = async (data) => {
        // attempt to register user
        try {
            await pb.collection("users").create(data);
            return null;
        }
        catch (err) {
            console.log('error with register')
            return err?.data.message;
        }
    }

    //--------- NOTES --------------

    // return: [] of notes
    const getNotes = async () => {
        try {
            let res = await pb.collection('notes').getFullList({
                sort: '-updated',
            });
            return res;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    // return: note {}
    const createNote = async (data) => {
        try {
            const res = await pb.collection('notes').create(data);
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }

    // return: note {}
    const updateNote = async (noteId, data) => {
        try {
            const res = await pb.collection('notes').update(noteId, data);
            return res;
        }
        catch (err) {
            console.log(err.data);
        }
    }

    // return: null
    const deleteNote = async (noteId) => {
        try {
            await pb.collection('notes').delete(noteId);
        }
        catch (err) {
            console.log(err);
        }
    }

    // ---------- TAGS --------------

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

    // return: tag {}
    const createTag = async (data) => {
        try {
            const res = await pb.collection('tags').create(data);
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }

    // return: null
    const deleteTag = async (tagId) => {
        try {
            await pb.collection('tags').delete(tagId);
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
            createTag,
            deleteTag,
            login,
            register
        }}>
        {children}
        </PbContext.Provider>
    );
}

// export custom hook to simplify using useContext
export const usePocket = () => useContext(PbContext);
