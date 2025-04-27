export const pokemonIds = [1, 4, 150];

interface Pokemon {
	id: number;
	name: string;
	age: number;
	type: string;
	isLegendary?: boolean;
}

export const bulbasaur: Pokemon = {
	id: pokemonIds[0],
	name: 'Bulbasaur',
	age: 2,
	type: 'Grass/Poison',
};

export const charmander: Pokemon = {
	id: pokemonIds[1],
	name: 'Charmander',
	age: 1,
	type: 'Fire',
};

export const mewtwo: Pokemon = {
	id: pokemonIds[2],
	name: 'Mewtwo',
	age: 5,
	type: 'Psychic',
	isLegendary: true,
};

export const pokemons: Pokemon[] = [bulbasaur, charmander, mewtwo];

// Mostrar información detallada de cada Pokémon
pokemons.forEach(pokemon => {
	console.log(
		`#${pokemon.id} - ${pokemon.name} (${pokemon.type})${pokemon.isLegendary ? ' [Legendary]' : ''}, Age: ${pokemon.age}`
	);
});
