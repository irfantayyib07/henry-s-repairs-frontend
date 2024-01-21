import { useState, useEffect, useRef } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
import useTitle from "../../hooks/useTitle"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
 const toBeFocused = useRef();

 useTitle('Henry S. Repairs: New User')

 const [addNewUser, {
  isLoading,
  isSuccess,
  isError,
  error
 }] = useAddNewUserMutation()

 const navigate = useNavigate()

 const [username, setUsername] = useState('')
 const [validUsername, setValidUsername] = useState(false)
 const [password, setPassword] = useState('')
 const [validPassword, setValidPassword] = useState(false)
 const [roles, setRoles] = useState(["Employee"])

 useEffect(() => {
  setValidUsername(USER_REGEX.test(username))
 }, [username])

 useEffect(() => {
  setValidPassword(PWD_REGEX.test(password))
 }, [password])

 useEffect(() => {
  toBeFocused.current.focus();

  if (isSuccess) {
   setUsername('')
   setPassword('')
   setRoles([])
   navigate('/dash/users')
  }
 }, [isSuccess, navigate])

 const onUsernameChanged = e => setUsername(e.target.value)
 const onPasswordChanged = e => setPassword(e.target.value)

 const onRolesChanged = e => {
  const values = Array.from(
   e.target.selectedOptions, //HTMLCollection 
   (option) => option.value
  )
  setRoles(values)
 }

 const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

 const onSaveUserClicked = async (e) => {
  e.preventDefault()
  if (canSave) {
  // console.log("I AM RUNNING");
   await addNewUser({ username, password, roles })
  }
 }

 const options = Object.values(ROLES).map(role => {
  return <option key={role} value={role}>{role}</option >
 })

 const errClass = isError ? "errmsg" : "offscreen"
 const validUserClass = !validUsername ? 'invalid-input' : ''
 const validPwdClass = !validPassword ? 'invalid-input' : ''
 const validRolesClass = !Boolean(roles.length) ? 'invalid-input' : ''

 return (
  <>
   <form className="new-user-form" onSubmit={onSaveUserClicked}>
    <p className={errClass}>{error?.data?.message}</p>
    <header>
     <h2>New User</h2>
     <button title="Save" disabled={!canSave}>
      <FontAwesomeIcon icon={faSave} />
     </button>
    </header>

    <div className="username-input-joiner">
     <label htmlFor="username">
      Username: <span className="nowrap">[3-20 letters]</span></label>
     <input
      ref={toBeFocused}
      className={`${validUserClass}`}
      id="username"
      name="username"
      type="text"
      autoComplete="off"
      value={username}
      onChange={onUsernameChanged}
     />
    </div>

    <div className="password-input-joiner">
     <label htmlFor="password">Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
     <input
      className={`${validPwdClass}`}
      id="password"
      name="password"
      type="password"
      value={password}
      onChange={onPasswordChanged}
     />
    </div>

    <div className="assigned-roles-joiner">
     <label htmlFor="roles">Assigned roles:</label>
     <select
      id="roles"
      name="roles"
      className={`${validRolesClass}`}
      multiple={true}
      size="3"
      value={roles}
      onChange={onRolesChanged}
     >
      {options}
     </select>
    </div>
   </form>
  </>
 )
}
export default NewUserForm