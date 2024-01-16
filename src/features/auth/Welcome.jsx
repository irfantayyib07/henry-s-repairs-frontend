import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

const Welcome = () => {

 const { username, isManager, isAdmin } = useAuth()

 useTitle(`techNotes: ${username}`)

 const date = new Date()
 const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

 return (
  <section className="welcome">

   <div className="welcome-text-container">
    <p>{today}</p>
    <h1>Welcome {username}!</h1>
   </div>

   <ul className='welcome-link-list'>
    <li><Link to="/dash/notes" className='btn'>View techNotes</Link></li>
    <li><Link to="/dash/notes/new" className='btn'>Add New techNote</Link></li>
    {(isManager || isAdmin) && <li><Link to="/dash/users" className='btn'>View User Settings</Link></li>}
    {(isManager || isAdmin) && <li><Link to="/dash/users/new" className='btn'>Add New User</Link></li>}
   </ul>

  </section>
 )
}

export default Welcome