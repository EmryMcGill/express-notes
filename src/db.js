import { openDB } from 'idb';

const dbPromise = openDB('pocketbase-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('note')) {
      db.createObjectStore('note', { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains('tag')) {
        db.createObjectStore('tag', { keyPath: 'id' });
      }
  },
});

export async function saveNotesOffline(notes) {
    const db = await dbPromise;
    notes.forEach(async (note) => await db.put('note', note))
}

export async function getAllNotesOffline() {
    const db = await dbPromise;
    return await db.getAll('note');
}

export async function saveTagsOffline(tags) {
    const db = await dbPromise;
    tags.forEach(async (tag) => await db.put('tag', tag))
}

export async function getAllTagsOffline() {
    const db = await dbPromise;
    return await db.getAll('tag');
}