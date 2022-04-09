import styled from "styled-components";
import React, { useEffect, useReducer, useState } from "react";

/* ✅ modify this usePokemon custom hook to take in a query as an argument */
export function usePokemon(query) {
  const [{data, status, errors}, dispatch] = useReducer(reducer, {
    data: null,
    status: 'pending',
    errors: null
  });

  function reducer(state, action) {
    switch (action.type) {
      case 'pending':
        return {data: null, status: 'pending', errors: null};
      case 'fulfilled':
        return {data: action.payload, status: 'fulfilled', errors: null};
      case 'rejected':
        return {data: null, status: 'rejected', errors: ['Not found']};
      default:
        throw new Error(`No action defined for type ${action.type}`);
    }
  }

  /* ✅ this hook should only return one thing: an object with the pokemon data */
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then(r => r.json())
      .then(poke => {
        dispatch({type: 'fulfilled', payload: poke});
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          dispatch({type: 'rejected', payload: err});
        }
      });
  }, [query]);
  return {
    data, status, errors
  }
}

function Pokemon({ query }) {
  /* 
   ✅ move the code from the useState and useEffect hooks into the usePokemon hook
   then, call the usePokemon hook to access the pokemon data in this component
  */
  const {pokemon} = usePokemon(query);

  // 🚫 don't worry about the code below here, you shouldn't have to touch it
  if (!pokemon) return <h3>Loading...</h3>;

  return (
    <div>
      <h3>{pokemon.name}</h3>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name + " front sprite"}
      />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("charmander");

  function handleSubmit(e) {
    e.preventDefault();
    setQuery(e.target.search.value);
  }

  return (
    <Wrapper>
      <h1>PokéSearcher</h1>
      <Pokemon query={query} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="search" defaultValue={query} />
        <button type="submit">Search</button>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  display: grid;
  place-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: papayawhip;
  text-align: center;

  h1 {
    background: #ef5350;
    color: white;
    display: block;
    margin: 0;
    padding: 1rem;
    color: white;
    font-size: 2rem;
  }

  form {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
  }
`;
