import { Link } from 'react-router-dom'

const Public = () => {
 return (
  <section className="public">
   <header>
    <h1>Welcome to <span className="nowrap">Henry S. Repairs!</span></h1>
   </header>

   <main>
    <p>Located in Beautiful Downtown Foo City, Henry S. Repairs  provides a trained staff ready to meet your tech repair needs.</p>
    <br />
    <address>
     Henry S. Repairs<br />
     555 Foo Drive<br />
     Foo City, CA 12345<br />
     <a href="tel:+15555555555">(555) 555-5555</a>
    </address>
    <br />
    <p>Owner: Henry Smith</p>
   </main>

   <footer>
    <Link to="/login" className="btn">Employee Login</Link>
   </footer>
  </section>
 )
}

export default Public
