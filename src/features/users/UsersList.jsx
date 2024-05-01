import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const UsersList = () => {
 useTitle("Henry S. Repairs: Users List");

 const {
  data: users,
  isLoading,
  isSuccess,
  isError,
  error,
 } = useGetUsersQuery("usersList", {
  // "usersList" is kind of a cache key? (used in EditUser.js and User.js)
  pollingInterval: 60000,
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
 });

 let content;

 if (isLoading)
  content = (
   <PulseLoader
    color={"#000"}
    cssOverride={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
   />
  );

 if (isError) {
  content = <p className="errmsg">{error?.data?.message}</p>;
 }

 if (isSuccess) {
  const { ids } = users;

  const tableContent = ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

  content = (
   <main>
    <table className="users-table">
     <thead>
      <tr>
       <th scope="col">Username</th>
       <th scope="col">Roles</th>
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
export default UsersList;
