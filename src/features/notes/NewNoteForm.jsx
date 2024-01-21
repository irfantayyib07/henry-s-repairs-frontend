import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewNoteMutation } from "./notesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

const NewNoteForm = ({ users }) => {

 const [addNewNote, {
  isLoading,
  isSuccess,
  isError,
  error
 }] = useAddNewNoteMutation()

 const navigate = useNavigate()

 const [title, setTitle] = useState('')
 const [text, setText] = useState('')
 const [userId, setUserId] = useState(users[0].id)

 useEffect(() => {
  if (isSuccess) {
   setTitle('')
   setText('')
   setUserId('')
   navigate('/dash/notes')
  }
 }, [isSuccess, navigate])

 const onTitleChanged = e => setTitle(e.target.value)
 const onTextChanged = e => setText(e.target.value)
 const onUserIdChanged = e => setUserId(e.target.value)

 const canSave = [title, text, userId].every(Boolean) && !isLoading

 const onSaveNoteClicked = async (e) => {
  e.preventDefault()
  if (canSave) {
   await addNewNote({ user: userId, title, text })
  }
 }

 const options = users.map(user => {
  return (
   <option key={user.id} value={user.id}>{user.username}</option >
  )
 })

 const errClass = isError ? "errmsg" : "offscreen"
 const validTitleClass = !title ? "form__input--incomplete" : ''
 const validTextClass = !text ? "form__input--incomplete" : ''

 return (
  <>
   <form className="new-note-form" onSubmit={onSaveNoteClicked}>
    <p className={errClass}>{error?.data?.message}</p>
    <header>
     <h2>New Note</h2>
     <button title="Save" disabled={!canSave}><FontAwesomeIcon icon={faSave} /></button>
    </header>

    <div className="title-input-joiner">
     <label htmlFor="title">Title:</label>
     <input
      className={`${validTitleClass}`}
      id="title"
      name="title"
      type="text"
      autoComplete="off"
      value={title}
      onChange={onTitleChanged}
     />
    </div>

    <div className="textarea-joiner">
     <label htmlFor="text">Text:</label>
     <textarea className={`${validTextClass}`} id="text" name="text" value={text} onChange={onTextChanged} />
    </div>

    <div className="assigned-to-joiner">
     <label htmlFor="username">Assigned to:</label>
     <select id="username" name="username" value={userId} onChange={onUserIdChanged}>
      {options}
     </select>
    </div>
   </form>
  </>
 )
}

export default NewNoteForm