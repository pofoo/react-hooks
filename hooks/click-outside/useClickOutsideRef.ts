// dependencies
import { useEffect, useRef, MouseEvent, TouchEvent, RefObject } from 'react';

/* TYPES */
type TapEvent = MouseEvent | TouchEvent;

/**
 * Returns refs that calls an onClick function everytime a click is made outside of that HTML Element
 * Defaults to 1 ref returned - if greater than 1, the refs will be returned in an array
 * numRefs only takes positive numbers
 */
const useClickOutsideRef = <T extends HTMLElement>( 
    onClick: ( event: TapEvent ) => void,
    numRefs: number=1 // this should only be a positive number
): RefObject<T>[] | RefObject<T> => {

    // creating an array of refs
    if ( numRefs > 1 ) {
        const refList: RefObject<T>[] = [];

        for ( let i=0; i < numRefs; i++ ) {
            refList.push( useRef( null ) );
        }

        const clickOutsideFn = ( event: TapEvent ): void => {
            // if the HTMLElement ref is clicked, isClicked will be false
            // by default, we assume the HTMLElement ref is clicked (false)
            let isClicked: boolean = false;

            for ( const ref of refList ) {
                // when you navigate to a new page, for some reason a nullish ref gets added to the beginning of the refs
                if ( !ref.current ) continue;
                if ( !ref.current ) isClicked = true;
                if ( ref.current.contains( event.target as HTMLElement ) ) isClicked = true;
            }
            // the HTMLElement was not clicked - call the onClick function
            if ( !isClicked ) onClick( event );
        }   
        // attaching the clickOutsideFn to all the refs in the refList
        addRefEventListener( clickOutsideFn );

        return refList;
    } 
    // creating a single ref
    else if ( numRefs === 1 ) {
        const ref: RefObject<T> = useRef( null );
        
        const clickOutsideFn = ( event: TapEvent ): void => {
            if ( !ref.current ) return;
            if ( ref.current.contains( event.target as HTMLElement ) ) return;
            // the HTMLElement was not clicked - call the onClick function
            onClick( event );

        }
        // attaching the clickOutsideFn to the ref
        addRefEventListener( clickOutsideFn );

        return ref;
    }
    // numRefs specfifed as something other than a positive integer
    else {
        throw(`numRefs needs to be a positive number. You specified numRefs as ${numRefs}.`)
    }
}


const addRefEventListener = ( clickOutsideFn: ( event: TapEvent ) => void ) => {
    // TO-DO - find a typescript solution for this
    useEffect( () => {
        // @ts-ignore
        document.addEventListener( 'mousedown', clickOutsideFn );
        // @ts-ignore
        document.addEventListener( 'touchstart', clickOutsideFn );
        return () => {
            // @ts-ignore
            document.removeEventListener( 'mousedown', clickOutsideFn );
            // @ts-ignore
            document.removeEventListener( 'touchstart', clickOutsideFn );
        }
    }, [] );  
}

export default useClickOutsideRef;