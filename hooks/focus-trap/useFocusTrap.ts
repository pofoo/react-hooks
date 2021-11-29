// dependencies
import { useEffect, RefObject, useRef } from 'react';

/* TYPES */
export type InitialFocus = 'first' | 'none' | number;

export interface Options {
    initialFocus?: InitialFocus;     // HTML Element we should draw focus to first
    tabbableElems?: string;          // additional tabbable elements to be added
}

/**
 * Adds focus trap effect to a given ref.
 */
const useFocusTrap = <T extends HTMLElement>(
    ref: RefObject<T>,
    isActive: boolean, // isActive state of target pop up
    options: Options={},
) => {

    /* CONTENT */
    const { initialFocus='none', tabbableElems='' } = options;
    
    /* HOOKS */
    //  last focused element BEFORE the focus trap was activated
    const lastFocusedElem = useRef<HTMLElement | null>( null );

    /* CONSTANTS */
    const TABBABLE_ELEMS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), area[href], form, audio[controls], video[controls], [tabindex="0"]';

    useEffect( () => {
        if ( isActive ) {
            const target = ref.current as T;

            // setting the last focused element
            lastFocusedElem.current = document.activeElement as HTMLElement;
            // blur the last focused element
            lastFocusedElem.current.blur();

            // all focusable elements for the given target
            const focusableElems = target.querySelectorAll( TABBABLE_ELEMS + tabbableElems );
            // number of focusable elements on the target
            const numFocusableElems = focusableElems.length;

            // no focusable elements on the dialog box
            if ( numFocusableElems === 0 ) throw( 'At least one tabbable element needs to be present within your target. If you feel this is a mistake and there is a tabbable element on your target, try adding your tabbable element within the optional tabbableElems parameter.')

             // elements on the target
            const firstElement = focusableElems[ 0 ] as HTMLElement;
            const lastElement = focusableElems[ numFocusableElems - 1 ] as HTMLElement;

            // focus the first focusable element wthin the target
            if ( initialFocus === 'first' ) firstElement.focus();
            // focus the custom element on the target
            else if ( typeof initialFocus === 'number' ) {
                if ( initialFocus < 0 ) throw( `initialFocus cannot be a negative number: you entered ${initialFocus}` );
                if ( initialFocus >= numFocusableElems ) throw( `initialFocus cannot be greater than or equal to the total number of focusable elements within the target: you entered ${initialFocus}` );

                const elem = focusableElems[ initialFocus ] as HTMLElement;
                elem.focus();
            }
            else if ( initialFocus === 'none' ) {}
            // incorrect type specified of initialFocus
            else {
                throw( `initialFocus must be either the values 'first', 'none', or a number. You specified initialFocus as ${typeof initialFocus}`)
            }
    
            const handleTab = ( event: KeyboardEvent ) => {
                if ( event.key === 'Tab' ) {
                    // currently focused element within the document
                    const focusedElement = document.activeElement as HTMLElement;

                    const focusEvent = ( elem: HTMLElement ) => {
                        elem.focus();
                        return event.preventDefault();
                    }

                    // reaching the last focusable element going forward
                    if ( !event.shiftKey && focusedElement === lastElement ) {
                        focusEvent( firstElement );
                    }
                    // reaching the first focusable element going backwards
                    if ( event.shiftKey && focusedElement === firstElement ) {
                        focusEvent( lastElement );
                    }
                }
            }

            target.addEventListener( 'keydown', handleTab );
            return () => {
                // on unmount, focus the last focused elem outside of the target
                lastFocusedElem.current!.focus();

                target.removeEventListener( 'keydown', handleTab );
            }
        }
    }, [ isActive ] );
}

export default useFocusTrap;