import { useState, useEffect, useRef } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
 const toBeFocused = useRef();

 const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation();

 const [deleteUser, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] =
  useDeleteUserMutation();

 const navigate = useNavigate();

 const [username, setUsername] = useState(user.username);
 const [validUsername, setValidUsername] = useState(false);
 const [password, setPassword] = useState("");
 const [validPassword, setValidPassword] = useState(false);
 const [roles, setRoles] = useState(user.roles);
 const [active, setActive] = useState(user.active);

 useEffect(() => {
  setValidUsername(USER_REGEX.test(username));
 }, [username]);

 useEffect(() => {
  setValidPassword(PWD_REGEX.test(password));
 }, [password]);

 useEffect(() => {
  toBeFocused.current.focus();

  if (isSuccess || isDelSuccess) {
   setUsername("");
   setPassword("");
   setRoles([]);
   navigate("/dash/users");
  }
 }, [isSuccess, isDelSuccess, navigate]);

 const onUsernameChanged = (e) => setUsername(e.target.value);
 const onPasswordChanged = (e) => setPassword(e.target.value);

 const onRolesChanged = (e) => {
  const values = Array.from(e.target.selectedOptions, (option) => option.value);
  setRoles(values);
 };

 const onActiveChanged = () => setActive((prev) => !prev);

 const onSaveUserClicked = async (e) => {
  if (password) {
   await updateUser({
    id: user.id,
    username,
    password,
    roles,
    active,
   });
  } else {
   await updateUser({
    id: user.id,
    username,
    roles,
    active,
   });
  }
 };

 const onDeleteUserClicked = async (e) => {
  e.target.closest("button").disabled = true;
  await deleteUser({ id: user.id });
 };

 const options = Object.values(ROLES).map((role) => {
  return (
   <option key={role} value={role}>
    {" "}
    {role}
   </option>
  );
 });

 let canSave;
 if (password) {
  canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
 } else {
  canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
 }

 const errClass = isError || isDelError ? "errmsg" : "offscreen";
 const validUserClass = !validUsername ? "invalid-input" : "";
 const validPwdClass = password && !validPassword ? "invalid-input" : "";
 const validRolesClass = !Boolean(roles.length) ? "invalid-input" : "";

 const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

 return (
  <>
   <form onSubmit={(e) => e.preventDefault()} className="edit-user-form">
    <p className={errClass}>{errContent}</p>
    <header>
     <h2>Edit User</h2>
     <div>
      <button title="Save" onClick={onSaveUserClicked} disabled={!canSave}>
       <FontAwesomeIcon icon={faSave} />
      </button>
      <button title="Delete" onClick={onDeleteUserClicked}>
       <FontAwesomeIcon icon={faTrashCan} />
      </button>
     </div>
    </header>

    <div className="username-input-joiner">
     <label htmlFor="username">
      Username: <span className="nowrap">[3-20 letters]</span>
     </label>
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
     <label htmlFor="password">
      Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
     </label>
     <input
      className={`${validPwdClass}`}
      id="password"
      name="password"
      type="password"
      value={password}
      onChange={onPasswordChanged}
     />
    </div>

    <div className="active-checkbox-joiner">
     <label htmlFor="user-active">
      Active:{" "}
      <input
       id="user-active"
       name="user-active"
       type="checkbox"
       checked={active}
       onChange={onActiveChanged}
      />
     </label>
    </div>

    <div className="assigned-roles-joiner">
     <label htmlFor="roles">Assigned roles</label>
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
 );
};
export default EditUserForm;
