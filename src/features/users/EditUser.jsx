import { useParams } from 'react-router-dom'
import EditUserForm from './EditUserForm'
import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditUser = () => {
 useTitle('Henry S. Repairs: Edit User')

 const { id } = useParams()

 const { user } = useGetUsersQuery("usersList", {
  selectFromResult: ({ data }) => ({
   user: data?.entities[id]
  }),
 })

 if (!user) return <PulseLoader color={"#000"} cssOverride={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

 return <EditUserForm user={user} />
}

export default EditUser
