import Logo from './assets/logo.png'

const Header = () => {
  return (
    <nav className='navbar bg-light mb-4 p-0'>
      <div className='container'>
        <a href='/' className='navbar-brand'>
          <div className='d-flex'>
            <img src={Logo} alt='Logo' className='mr-2' />
            <div>Project Management</div>
          </div>
        </a>
      </div>
    </nav>
  )
}

export default Header
