import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Welcome = () => {
 const { username, isManager, isAdmin } = useAuth();

 useTitle(`Dashboard: ${username}`);

 const date = new Date();
 const today = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeStyle: "long",
 }).format(date);

 return (
  <section className="welcome">
   <div className="welcome-text-container">
    <p>{today}</p>
    <h1>Welcome {username}!</h1>
   </div>

   <ul className="welcome-link-list">
    <li>
     <Link to="/dash/notes">View and Edit Notes</Link>
    </li>
    <li>
     <Link to="/dash/notes/new">Add New Note</Link>
    </li>
    {(isManager || isAdmin) && (
     <li>
      <Link to="/dash/users">View and Edit Users</Link>
     </li>
    )}
    {(isManager || isAdmin) && (
     <li>
      <Link to="/dash/users/new">Add New User</Link>
     </li>
    )}
   </ul>
  </section>
 );
};

export default Welcome;
