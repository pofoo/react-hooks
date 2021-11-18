// dependencies
import { useEffect, useRef, MouseEvent, RefObject } from 'react';

/**
 * Returns refs that calls an onClick function everytime a click is made outside of that HTML Element
 * Defaults to 1 ref returned - if greater than 1, the refs will be returned in an array
 */
const useClickOutsideRef = ( 
    onClick: ( event: MouseEvent ) => void, 
    numRefs: number=1
) => {

    // clickOutside function that will attach the the click event listener to each ref
    let clickOutsideFn: ( event: MouseEvent ) => void;
    // either a single ref or a list of refs
    let refs: RefObject<HTMLElement>[] | RefObject<HTMLElement>;

    // creating an array of refs
    if ( numRefs > 1 ) {
        for ( let i=0; i < numRefs; i++ ) {
            refs = [];
            refs.push( useRef( null ) );
        }
    } 
    // creating a single ref
    else {
        refs = useRef( null );
    }

    if ( Array.isArray( refs ) ) {
        clickOutsideFn = ( event: MouseEvent ) => {
            let isFocused: boolean = false;
            for ( const ref of refs ) {
                // when you navigate to a new page, for some reason a nullish ref gets added to the beginning of the refs
                if ( !ref.current ) continue;
                if ( !ref.current ) isFocused = true;
                if ( ref.current.contains( event.target ) ) isFocused = true;
            }
            if ( !isFocused ) onClick( event );
        }   
    } else {
        clickOutsideFn = ( event: MouseEvent ) => {
            if ( !refs.current ) return;
            if ( refs.current.contains( event.target ) ) return;
            onClick( event );
        }
    }

    useEffect( () => {
        document.addEventListener( 'mousedown', clickOutsideFn );
        document.addEventListener( 'touchstart', clickOutsideFn );
        return () => {
            document.removeEventListener( 'mousedown', clickOutsideFn );
            document.removeEventListener( 'touchstart', clickOutsideFn );
        }
    }, [] );  

    return refs;
}

export default useClickOutsideRef;