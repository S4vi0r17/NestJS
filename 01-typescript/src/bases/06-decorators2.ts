// Decorador para marcar métodos como obsoletos (deprecated)
const Deprecated = (deprecationReason: string) => {
	return (
		target: any,
		memberName: string,
		propertyDescriptor: PropertyDescriptor
	) => {
		const originalMethod = propertyDescriptor.value;
		propertyDescriptor.value = function (...args: any[]) {
			console.warn(
				`[DEPRECATED] Method "${memberName}" is deprecated: ${deprecationReason}`
			);
			return originalMethod.apply(this, args);
		};
		return propertyDescriptor;
	};
};

export class Pokemon {
	constructor(public readonly id: number, public name: string) {}

	// Método normal
	scream() {
		console.log(`${this.name.toUpperCase()}!!`);
	}

	// Método obsoleto, se recomienda usar speak2
	@Deprecated('Must use speak2 method instead')
	speak() {
		console.log(`${this.name}, ${this.name}!`);
	}

	// Método obsoleto, se recomienda usar speak3
	@Deprecated('Must use speak3 method instead')
	speak2() {
		console.log(`${this.name}, ${this.name}!!!`);
	}

	// Método recomendado
	speak3() {
		console.log(`🔥 ${this.name} is speaking in the new way! 🔥`);
	}
}

// Instancia de la clase
export const charmander = new Pokemon(4, 'Charmander');

// Ejemplo de uso de los métodos
console.log('--- scream ---');
charmander.scream();

console.log('--- speak (deprecated) ---');
charmander.speak();

console.log('--- speak2 (deprecated) ---');
charmander.speak2();

console.log('--- speak3 (recommended) ---');
charmander.speak3();

/*
Salida esperada:
--- scream ---
CHARMANDER!!
--- speak (deprecated) ---
[DEPRECATED] Method "speak" is deprecated: Must use speak2 method instead
Charmander, Charmander!
--- speak2 (deprecated) ---
[DEPRECATED] Method "speak2" is deprecated: Must use speak3 method instead
Charmander, Charmander!!!
--- speak3 (recommended) ---
🔥 Charmander is speaking in the new way! 🔥
*/
