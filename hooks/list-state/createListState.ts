// dependencies
import { useState, SetStateAction, Dispatch } from 'react';

/* TYPES */
export interface Options <T extends any>{
    initialState?: T; // initial state for each list value
    uniqueValues?: { [ key: number ]: T } ; // object of unique values to set to a custom initial value
};

/**
 * Returns a list state with a specified length of states.
 * Customizable to have unique values for certain indexes.
 * Useful for keeping track of multiple like-kind elements states ( i.e -> multiple dropdown menus ).
 */
const createListState = <T extends any>( 
    length: number,
    options: Options<T>={},
) => {
    
    /* TYPES */
    // TO-DO - find a better way to use generics
    type ListState = ( T | any )[];

    /* CONTENT */
    const { 
        initialState=false,  // default to boolean type of false
        uniqueValues={}, // default to no custom values
    } = options;

    const useListState = () => {
        const listState: ListState = [];
        
        for ( let i =0; i < length; i++ ) {
            if ( i in uniqueValues )
                listState.push( uniqueValues[ i ] );
            else
                listState.push( initialState );
        }

        return useState( listState );
    }

    /* HELPER FUNCTIONS */
    /**
     * By default, resets all values to the initial state
     * If a unique values object is specified, the key:value pair is updated according to the specified number (index)
     */
    useListState.toggle = (
        setListState: Dispatch<SetStateAction<T | any>>,
        uniqueValues: { [ key: number ]: T }={},
    ) => {
        setListState( ( currList: ListState ) => {
            const newList: ListState  = [];

            currList.forEach( ( _, index ) => {
                if ( index in uniqueValues ) 
                    newList.push( uniqueValues[ index ] );
                else 
                    newList.push( initialState );
            } );

            return newList;
        } );
    }

    return useListState;
}

export default createListState;