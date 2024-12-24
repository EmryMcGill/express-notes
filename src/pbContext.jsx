import Pocketbase from 'pocketbase';
import { createContext, useEffect, useMemo, useState } from 'react';

// url for pb TODO: move this to .env
const BASE_URL = 'http://127.0.0.1:8090';

// create the pb context
const PbContext = createContext();

const PbProvider = ({ children }) => {
    // define the pb object 
    const pb = useMemo(() => new Pocketbase(BASE_URL));

    // define user
    const [user, setUser] = useState(pb.authStore.record);

    // listen for changes to the authStore state
    useEffect(() => {
        return pb.authStore.onChange(record => setUser(record));
    })

    return (
        <PbContext.Provider value={{ pb, user }}>
        {children}
        </PbContext.Provider>
    );
}
