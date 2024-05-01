import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faFileCirclePlus,
 faFileSignature,
 faUsersGear,
 faUserPlus,
 faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const NEW_NOTE_REGEX = /^\/dash\/notes\/\w*(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;
const NEW_USER_REGEX = /^\/dash\/users\/\w*(\/)?$/;

const DashHeader = () => {
 const { isManager, isAdmin } = useAuth();

 const navigate = useNavigate();
 const { pathname } = useLocation();

 const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();

 useEffect(() => {
  if (isSuccess) navigate("/");
 }, [isSuccess, navigate]);

 const onNewNoteClicked = () => navigate("/dash/notes/new");
 const onNewUserClicked = () => navigate("/dash/users/new");
 const onNotesClicked = () => navigate("/dash/notes");
 const onUsersClicked = () => navigate("/dash/users");

 let newNoteButton = null;
 if (NOTES_REGEX.test(pathname)) {
  newNoteButton = (
   <button className="icon-button" title="New Note" onClick={onNewNoteClicked}>
    <FontAwesomeIcon icon={faFileCirclePlus} />
   </button>
  );
 }

 let newUserButton = null;
 if (USERS_REGEX.test(pathname)) {
  newUserButton = (
   <button className="icon-button" title="New User" onClick={onNewUserClicked}>
    <FontAwesomeIcon icon={faUserPlus} />
   </button>
  );
 }

 let userButton = null;
 if (isManager || isAdmin) {
  if (DASH_REGEX.test(pathname) || NEW_USER_REGEX.test(pathname)) {
   userButton = (
    <button className="icon-button" title="Users" onClick={onUsersClicked}>
     <FontAwesomeIcon icon={faUsersGear} />
    </button>
   );
  }
 }

 let notesButton = null;
 if (DASH_REGEX.test(pathname) || NEW_NOTE_REGEX.test(pathname)) {
  notesButton = (
   <button className="icon-button" title="Notes" onClick={onNotesClicked}>
    <FontAwesomeIcon icon={faFileSignature} />
   </button>
  );
 }

 const logoutButton = (
  <button className="icon-button" title="Logout" onClick={sendLogout}>
   <FontAwesomeIcon icon={faRightFromBracket} />
  </button>
 );

 const errClass = isError ? "errmsg" : "offscreen";

 let buttonContent;
 if (isLoading) {
  buttonContent = null;
 } else {
  buttonContent = (
   <>
    {newNoteButton}
    {newUserButton}
    {notesButton}
    {userButton}
    {logoutButton}
   </>
  );
 }

 return (
  <>
   {isLoading && (
    <PulseLoader
     color={"#000"}
     cssOverride={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
     }}
    />
   )}
   <header className="dash-header">
    <p className={errClass}>{error?.data?.message}</p>
    <h1>
     <Link to="/dash">Dashboard</Link>
    </h1>
    <nav>{buttonContent}</nav>
   </header>
  </>
 );
};

export default DashHeader;
