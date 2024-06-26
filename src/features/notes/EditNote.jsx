import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditNote = () => {
 useTitle("Henry S. Repairs: Edit Note");

 const { id } = useParams();

 const { username, isManager, isAdmin } = useAuth();

 const { note } = useGetNotesQuery("prefetchedNotesList", {
  selectFromResult: ({ data }) => ({
   note: data?.entities[id],
  }),
 });

 const { users } = useGetUsersQuery("prefetchedUsersList", {
  selectFromResult: ({ data }) => ({
   users: data?.ids.map((id) => data?.entities[id]),
  }),
 });

 if (!note || !users?.length)
  return (
   <PulseLoader
    color={"#000"}
    cssOverride={{
     position: "absolute",
     top: "50%",
     left: "50%",
     transform: "translate(-50%, -50%)",
    }}
   />
  );

 if (!isManager && !isAdmin) {
  if (note.username !== username) {
   return <p>No access</p>;
  }
 }

 return <EditNoteForm note={note} users={users} />;
};

export default EditNote;
