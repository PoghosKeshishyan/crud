export function Header({ header }) {
  return (
    <header>
      <h1>{header.title}</h1>
      <img src={header.logo} alt='logo' />
    </header>
  )
}
