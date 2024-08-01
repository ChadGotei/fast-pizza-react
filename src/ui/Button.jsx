/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

function Button({ children, disabled, to, type, onClick }) {
    const base = 'text-sm bg-yellow-400 font-semibold uppercase text-stone-800 rounded-full tracking-wide hover:bg-yellow-300 transition-colors duration-300 hover:text-slate-950 focus:outline-none focus:bg-yellow-300 focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed';


    const styles = {
        primary: base + ' py-4 px-6 md:px-6 md:py-4',
        small: base + 'py-2 px-4 md:px-5 py-2.5 text-xs',

        round: base + ' px-2.5 py-1 md:px-3.5 md:px-3.5 md:py-2 text-sm',

        secondary: 'border-2 border-stone-200 font-semibold uppercase text-stone-500 rounded-full tracking-wide hover:bg-stone-900 transition-colors duration-300 hover:text-slate-200 focus:outline-none focus:bg-stone-300 focus:ring focus:ring-stone-300 focus:text-stone-900 disabled:cursor-not-allowed px-4 py-2.5 md:px-6 py:3.5'
    }

    if (to) {
        return (
            <Link to={to} className={styles[type]}>
                {children}
            </Link>
        );
    }

    if(onClick) {
        return <button className={styles[type]} disabled={disabled} type={type} onClick={onClick}>
            {children}
        </button>
    }

    return (
        <button className={styles[type]} disabled={disabled} type={type} >
            {children}
        </button>
    );
}

export default Button;
