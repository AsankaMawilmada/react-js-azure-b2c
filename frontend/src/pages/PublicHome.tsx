import { Link } from 'react-router-dom'

export const PublicHome = () => {
  return (
    <section className="route-message">
      <p className="eyebrow">Public page</p>
      <h1>Welcome to the access reference.</h1>
      <p>
        This page is available without an account. Explore the public information, or sign in to
        open protected areas.
      </p>
      <div className="route-actions">
        <Link className="button link-button" to="/about">
          About
        </Link>
        <Link className="button secondary link-button" to="/dashboard">
          Protected dashboard
        </Link>
      </div>
    </section>
  )
}

export const About = () => {
  return (
    <section className="route-message">
      <p className="eyebrow">Public page</p>
      <h1>Public information.</h1>
      <p>
        Anyone can reach this route. Authorization is enforced separately by the API for protected
        data.
      </p>
    </section>
  )
}
