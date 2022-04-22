// dependencies
import { useRef, useEffect } from 'react';


/**
 * Adds an onClick handler for a ref.
 */
const useOnClickRef = <T extends HTMLElement = HTMLElement>( 
    onClick: ( ( event: MouseEvent ) => void ) | ( () => void ),
) => {
    /* HOOKS */
    const ref = useRef<T>( null );

    useEffect( () => {
        ref.current?.addEventListener( 'click', onClick );

        return () => {
            ref.current?.removeEventListener( 'click', onClick );
        }
    } )

    return ref;
}

export default useOnClickRef;