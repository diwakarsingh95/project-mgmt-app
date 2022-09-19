import { Link } from 'react-router-dom'
import Logo from './assets/logo.png'

const Header = () => {
  return (
    <nav className='navbar bg-light mb-4 p-0'>
      <div className='container'>
        <Link to='/' className='navbar-brand'>
          <div className='d-flex'>
            <img src={Logo} alt='Logo' className='mr-2' width={30} height={30} />
            <div>Project Management</div>
          </div>
        </Link>
      </div>
    </nav>
  )
}

export default Header
