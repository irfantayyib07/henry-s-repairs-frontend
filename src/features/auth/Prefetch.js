import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useState } from "react";

const Prefetch = () => {
 // const [count, setCount] = useState(1);
 // console.log(count);

 useEffect(() => {
  store.dispatch(notesApiSlice.util.prefetch('getNotes', "prefetchedNotesList", { force: true }))
  store.dispatch(usersApiSlice.util.prefetch('getUsers', "prefetchedUsersList", { force: true }))
 }, [])

 return (
  <>
   {/* <button onClick={() => setCount(prev => prev + 1)}>RENDER PREFETCH</button> */}
   <Outlet />
  </>
 )
}
export default Prefetch
