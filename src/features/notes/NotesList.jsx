import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const NotesList = () => {
 useTitle("Henry S. Repairs: Notes List");

 const { username, isManager, isAdmin } = useAuth();

 const {
  data: notes,
  isLoading,
  isSuccess,
  isError,
  error,
 } = useGetNotesQuery("notesList", {
  pollingInterval: 15000,
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
 });

 let content;

 if (isLoading)
  content = (
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

 if (isError) {
  content = (
   <main>
    <p>{error?.data?.message}</p>
   </main>
  );
 }

 if (isSuccess) {
  const { ids, entities } = notes;

  let filteredIds;
  if (isManager || isAdmin) {
   filteredIds = [...ids];
  } else {
   filteredIds = ids.filter((noteId) => entities[noteId].username === username);
  }

  const tableContent =
   ids?.length !== 0 ? filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />) : null;

  content = (
   <main>
    <table className="notes-table">
     <thead>
      <tr>
       <th scope="col">Status</th>
       <th scope="col">Created</th>
       <th scope="col">Updated</th>
       <th scope="col">Title</th>
       <th scope="col">Owner</th>
       <th scope="col">Edit</th>
      </tr>
     </thead>
     <tbody>{tableContent}</tbody>
    </table>
   </main>
  );
 }

 return content;
};
export default NotesList;
