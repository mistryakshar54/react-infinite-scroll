import React, { useState, useEffect } from "react";
import "./styles.css";

const fetchPokemonData = async (len) => {
  const promiseArr = [];
  for (let i = len; i < len + 20; i++) {
    promiseArr.push(
      (await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)).json()
    );
  }
  const resolvedData = await Promise.all(promiseArr);
  return resolvedData.map((item) => {
    return {
      name: item.name,
      sprite: item.sprites.front_default
    };
  });
};
export default function App() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage("Loading...");
      const resp = await fetchPokemonData(1);
      setData(resp);
      setLoading(false);
    };
    fetchData();
  }, []);
  window.onscroll = () => {
    if (data.length > 70) {
      setMessage("Reached end of the list!!");
      return;
    }
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setMessage("Loading...");
      setLoading(true);
      fetchPokemonData(data.length).then((newPokemons) => {
        setData([...data, ...newPokemons]);
        setLoading(false);
      });
    }
  };
  return (
    <div className="App">
      <h1 className="header">Pokemon Infinite Scroll</h1>
      <div id="content">
        {data.map((pokemon, index) => (
          <div className="card" key={"num" + index}>
            <img src={pokemon.sprite} alt={pokemon.name} />
            <h1 className="pokemonName"> {pokemon.name} </h1>
          </div>
        ))}
        {isLoading && <h1 className="pokemonName">{message}</h1>}
      </div>
    </div>
  );
}
