import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import useTitle from '../../hooks/useTitle'
import PulseLoader from 'react-spinners/PulseLoader'

const Login = () => {
 useTitle('Employee Login')

 const userRef = useRef()
 const errRef = useRef()
 const [username, setUsername] = useState('')
 const [password, setPassword] = useState('')
 const [errMsg, setErrMsg] = useState('')
 const [persist, setPersist] = usePersist()

 const navigate = useNavigate()
 const dispatch = useDispatch()

 const [login, { isLoading }] = useLoginMutation()

 useEffect(() => {
  userRef.current.focus()
 }, [])

 useEffect(() => {
  setErrMsg('');
 }, [username, password])


 const handleSubmit = async (e) => {
  e.preventDefault()
  try {
   const { accessToken } = await login({ username, password }).unwrap()
   dispatch(setCredentials({ accessToken }))
   setUsername('')
   setPassword('')
   navigate('/dash')
  } catch (err) {
   if (!err.status) {
    setErrMsg('No Server Response');
   } else if (err.status === 400) {
    setErrMsg('Missing Username or Password');
   } else if (err.status === 401) {
    setErrMsg('Unauthorized');
   } else {
    setErrMsg(err.data?.message);
   }
   errRef.current.focus();
  }
 }

 const handleUserInput = (e) => setUsername(e.target.value)
 const handlePwdInput = (e) => setPassword(e.target.value)
 const handleToggle = () => setPersist(prev => !prev)

 const errClass = errMsg ? "errmsg" : "offscreen"

 if (isLoading) return <PulseLoader color={"#000"} cssOverride={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

 return (
  <section className="public">
   <header>
    <h1>Employee Login</h1>
   </header>

   <main className="login">
    <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

    <form onSubmit={handleSubmit} className="login-form">
     <input
      placeholder="Username"
      className="form-input"
      type="text"
      id="username"
      ref={userRef}
      value={username}
      onChange={handleUserInput}
      autoComplete="off"
      required
     />

     <input
      placeholder='Password'
      className="form-input"
      type="password"
      id="password"
      onChange={handlePwdInput}
      value={password}
      required
     />

     <div className="login-checkbox-joiner">
      <label htmlFor="persist" className="form__persist">
       <input type="checkbox" className="form__checkbox" id="persist" onChange={handleToggle} checked={persist} /> Trust This Device
      </label>
     </div>

     <button>Sign In</button>
    </form>
   </main>

   <footer>
    <Link to="/" className="btn">Back to Home</Link>
   </footer>
  </section>
 )
}

export default Login
