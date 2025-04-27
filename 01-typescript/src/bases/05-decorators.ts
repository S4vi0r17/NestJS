// Un decorador simple que imprime el constructor de la clase
const PrintConstructor = () => {
	return (target: Function) => {
		console.log('Constructor de la clase:', target);
	};
};

// Un decorador que agrega una propiedad estática a la clase
const AddStaticProperty = () => {
	return (target: Function) => {
		target.prototype.isPokemon = true;
	};
};

// Un decorador que reemplaza el método scream
const OverrideScream = () => {
	return (target: Function) => {
		target.prototype.scream = function () {
			console.log('¡Este grito ha sido sobrescrito por el decorador!');
		};
	};
};

@PrintConstructor()
@AddStaticProperty()
@OverrideScream()
export class Pokemon {
	constructor(public readonly id: number, public name: string) {}

	scream() {
		console.log(`${this.name.toUpperCase()}!!`);
	}

	speak() {
		console.log(`${this.name}, ${this.name}!`);
	}
}

export const charmander = new Pokemon(4, 'Charmander');
export const bulbasaur = new Pokemon(1, 'Bulbasaur');

charmander.scream(); // ¡Este grito ha sido sobrescrito por el decorador!
charmander.speak();  // Charmander, Charmander!

bulbasaur.scream();  // ¡Este grito ha sido sobrescrito por el decorador!
bulbasaur.speak();   // Bulbasaur, Bulbasaur!

// Demostrando la propiedad agregada por el decorador
console.log('¿Charmander es un Pokémon?', (charmander as any).isPokemon); // true
console.log('¿Bulbasaur es un Pokémon?', (bulbasaur as any).isPokemon);   // true
