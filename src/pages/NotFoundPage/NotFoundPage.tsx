import { Link } from 'react-router-dom';
import Icon from '../../components/Icon/Icon';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="not-found__icon">
        <Icon name="search" size={36} />
      </span>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn--primary">
        Back to the store
      </Link>
    </main>
  );
}
