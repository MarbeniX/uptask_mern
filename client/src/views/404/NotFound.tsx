import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <>
            <h1 className="font-black text-black text-4xl">Page not found</h1>
            <p className="mt-10 font-bold text-black">
                Go to projects or create an account {' '}
                <Link to={'/'} className='text-fuchsia-500'> Click here</Link>
            </p>
        </>
    )
}
