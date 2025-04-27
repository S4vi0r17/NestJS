import axios, { AxiosInstance } from 'axios';
import { Move, PokeapiResponse } from '../interfaces/pokeapi-response.interface.ts';

export class Pokemon {
	// Imagen oficial desde pokeapi
	get imageUrl(): string {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`;
	}

	constructor(
		public readonly id: number,
		public name: string,
		private readonly http: AxiosInstance = axios // Inyección de dependencias
	) {}

	scream(): void {
		console.log(`${this.name.toUpperCase()}!!!`);
	}

	speak(): void {
		console.log(`${this.name}, ${this.name}`);
	}

	async getMoves(): Promise<Move[]> {
		try {
			const { data } = await this.http.get<PokeapiResponse>(
				`https://pokeapi.co/api/v2/pokemon/${this.id}`
			);
			console.log(data.moves);
			return data.moves;
		} catch (error) {
			console.error('Error fetching moves:', error);
			return [];
		}
	}
}

// Ejemplo de uso
const charmander = new Pokemon(4, 'Charmander');
console.log('Image URL:', charmander.imageUrl);
charmander.scream();
charmander.speak();
charmander.getMoves();
