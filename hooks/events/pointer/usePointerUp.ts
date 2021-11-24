// dependencies
import { useEffect, RefObject } from 'react';

/* TYPES */
type TapEvent = MouseEvent | TouchEvent;

/**
 * Custom pointer up function - certain broswers don't support all functionalities.
 * i.e firefox
 */
 const usePointerUp = <T extends HTMLElement>(
    ref: RefObject<T>,
    fn: ( event: TapEvent ) => void,
) => {

    useEffect( () => {
        const target = ref.current as HTMLElement;

        target.addEventListener( 'mouseup', fn );
        target.addEventListener( 'touchend', fn );
        return () => {
            target.removeEventListener( 'mouseup', fn );
            target.removeEventListener( 'touchend', fn );
        }
    }, [] );
}

export default usePointerUp;