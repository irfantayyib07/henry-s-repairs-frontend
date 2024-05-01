import NewNoteForm from "./NewNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const NewNote = () => {
 useTitle("Henry S. Repairs: New Note");

 const { users } = useGetUsersQuery("prefetchedUsersList", {
  selectFromResult: ({ data }) => ({
   users: data?.ids.map((id) => data?.entities[id]),
  }),
 });

 if (!users?.length)
  return (
   <PulseLoader
    color={"#000"}
    cssOverride={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
   />
  );

 return <NewNoteForm users={users} />;
};

export default NewNote;
