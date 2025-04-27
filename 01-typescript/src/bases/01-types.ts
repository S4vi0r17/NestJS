// Definición de tipos y variables
export let name: string = 'Gustavo';
export const age: number = 23;
export const isValid: boolean = true;

// Cambiando el valor de name
name = 'Gisel';

// Función para obtener información formateada
export function getUserInfo(userName: string, userAge: number, valid: boolean): string {
    return `
        Información del usuario:
        -----------------------
        Nombre: ${userName}
        Edad: ${userAge}
        ¿Es válido?: ${valid ? 'Sí' : 'No'}
        Expresión ejemplo: ${userAge * 2}
        Fecha actual: ${new Date().toLocaleDateString()}
    `;
}

// Uso de la función y template string
export const userInfo = getUserInfo(name, age, isValid);

console.log(userInfo);
