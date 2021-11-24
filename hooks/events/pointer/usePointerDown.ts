// dependencies
import { useEffect, RefObject } from 'react';

/* TYPES */
type TapEvent = MouseEvent | TouchEvent;

/**
 * Custom pointer down function - certain broswers don't support all functionalities.
 * i.e firefox
 */
 const usePointerDown = <T extends HTMLElement>(
    ref: RefObject<T>,
    fn: ( event: TapEvent ) => void,
) => {
    
    useEffect( () => {
        const target = ref.current as HTMLElement;

        target.addEventListener( 'mousedown', fn );
        target.addEventListener( 'touchstart', fn );
        return () => {
            target.removeEventListener( 'mousedown', fn );
            target.removeEventListener( 'touchstart', fn );
        }
    }, [] );
}

export default usePointerDown;