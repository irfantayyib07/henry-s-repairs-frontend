import { useState, useEffect, useRef } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditNoteForm = ({ note, users }) => {
 const toBeFocused = useRef();

 const { isManager, isAdmin } = useAuth();

 const [updateNote, { isLoading, isSuccess, isError, error }] = useUpdateNoteMutation();

 const [deleteNote, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] =
  useDeleteNoteMutation();

 const navigate = useNavigate();

 const [title, setTitle] = useState(note.title);
 const [text, setText] = useState(note.text);
 const [completed, setCompleted] = useState(note.completed);
 const [userId, setUserId] = useState(note.user);

 useEffect(() => {
  toBeFocused.current.focus();

  if (isSuccess || isDelSuccess) {
   setTitle("");
   setText("");
   setUserId("");
   navigate("/dash/notes");
  }
 }, [isSuccess, isDelSuccess, navigate]);

 const onTitleChanged = (e) => setTitle(e.target.value);
 const onTextChanged = (e) => setText(e.target.value);
 const onCompletedChanged = (e) => setCompleted((prev) => !prev);
 const onUserIdChanged = (e) => setUserId(e.target.value);

 const canSave = [title, text, userId].every(Boolean) && !isLoading;

 const onSaveNoteClicked = async (e) => {
  if (canSave) {
   await updateNote({ id: note.id, user: userId, title, text, completed });
  }
 };

 const onDeleteNoteClicked = async (e) => {
  e.target.closest("button").disabled = true;
  await deleteNote(note.id);
  navigate("/dash/notes");
 };

 const created = new Date(note.createdAt).toLocaleString("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
 });
 const updated = new Date(note.updatedAt).toLocaleString("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
 });

 const options = users.map((user) => {
  return (
   <option key={user.id} value={user.id}>
    {" "}
    {user.username}
   </option>
  );
 });

 const errClass = isError || isDelError ? "errmsg" : "offscreen";
 const validTitleClass = !title ? "invalid-input" : "";
 const validTextClass = !text ? "invalid-input" : "";

 const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

 let deleteButton = null;
 if (isManager || isAdmin) {
  deleteButton = (
   <button className="icon-button" title="Delete" onClick={onDeleteNoteClicked}>
    <FontAwesomeIcon icon={faTrashCan} />
   </button>
  );
 }

 return (
  <>
   <form onSubmit={(e) => e.preventDefault()} className="edit-note-form">
    <p className={errClass}>{errContent}</p>
    <header>
     <h2>Edit Note #{note.ticket}</h2>
     <div>
      <button title="Save" onClick={onSaveNoteClicked} disabled={!canSave}>
       <FontAwesomeIcon icon={faSave} />
      </button>
      {deleteButton}
     </div>
    </header>

    <div className="title-input-joiner">
     <label htmlFor="note-title">Title:</label>
     <input
      ref={toBeFocused}
      className={`${validTitleClass}`}
      id="note-title"
      name="title"
      type="text"
      autoComplete="off"
      value={title}
      onChange={onTitleChanged}
     />
    </div>

    <div className="textarea-joiner">
     <label htmlFor="note-text">Text:</label>
     <textarea
      className={`${validTextClass}`}
      id="note-text"
      name="text"
      value={text}
      onChange={onTextChanged}
     />
    </div>

    <div className="completed-checkbox-joiner">
     <label htmlFor="note-completed">
      Completed:{" "}
      <input
       id="note-completed"
       name="completed"
       type="checkbox"
       checked={completed}
       onChange={onCompletedChanged}
      />
     </label>
    </div>

    <div className="assigned-to-joiner">
     <label htmlFor="note-username">Assigned to:</label>
     <select id="note-username" name="username" value={userId} onChange={onUserIdChanged}>
      {options}
     </select>
    </div>

    <div>
     <p>Created: {created}</p>
     <p>Updated: {updated}</p>
    </div>
   </form>
  </>
 );
};

export default EditNoteForm;
