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

    return (
        <PbContext.Provider value={{ pb, user }}>
        {children}
        </PbContext.Provider>
    );
}

// export custom hook to simplify using useContext
export const usePocket = () => useContext(PbContext);
