import {
	HttpAdapter,
	PokeapiAdapter,
	PokeapiFetchAdapter,
} from '../api/pokeapi.adapter';
import { Move, PokeapiResponse } from '../interfaces/pokeapi-response.interface';

// Opciones para crear un Pokémon
export interface PokemonOptions {
	id: number;
	name: string;
	http: HttpAdapter;
}

// Clase principal Pokémon
export class Pokemon {
	constructor(private readonly options: PokemonOptions) {}

	get id(): number {
		return this.options.id;
	}

	get name(): string {
		return this.options.name;
	}

	get imageUrl(): string {
		return `https://pokemon.com/${this.id}.jpg`;
	}

	scream(): void {
		console.log(`${this.name.toUpperCase()}!!!`);
	}

	speak(): void {
		console.log(`${this.name}, ${this.name}`);
	}

	// Ahora puedes usar cualquier método del adapter (get, post, patch, delete)
	async getMoves(): Promise<Move[]> {
		try {
			const data = await this.options.http.get<PokeapiResponse>(
				`https://pokeapi.co/api/v2/pokemon/${this.id}`
			);
			return data.moves;
		} catch (error) {
			console.error('Error fetching moves:', error);
			return [];
		}
	}

	// Ejemplo de uso de POST (no existe en la API real, solo como ejemplo)
	async fakePostMove(move: Move): Promise<any> {
		try {
			const result = await this.options.http.post<any>(
				`https://pokeapi.co/api/v2/pokemon/${this.id}/moves`,
				move
			);
			return result;
		} catch (error) {
			console.error('Error posting move:', error);
			return null;
		}
	}
}

// Puedes cambiar fácilmente el adaptador aquí:
const pokeApiAdapter: HttpAdapter = new PokeapiAdapter();
// const pokeApiAdapter: HttpAdapter = new PokeapiFetchAdapter();

export const charmander = new Pokemon({
	id: 4,
	name: 'Charmander',
	http: pokeApiAdapter,
});

(async () => {
	await charmander.getMoves();
	// await charmander.fakePostMove({ move: { name: 'ember', url: '' } }); // Ejemplo de POST
})();
