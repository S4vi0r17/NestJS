# Principios SOLID

Los principios SOLID son un conjunto de buenas prácticas para el diseño de software orientado a objetos. Ayudan a crear sistemas más mantenibles, escalables y fáciles de entender. SOLID es un acrónimo de:

- **S**: Single Responsibility Principle (Principio de Responsabilidad Única)
- **O**: Open/Closed Principle (Principio de Abierto/Cerrado)
- **L**: Liskov Substitution Principle (Principio de Sustitución de Liskov)
- **I**: Interface Segregation Principle (Principio de Segregación de Interfaces)
- **D**: Dependency Inversion Principle (Principio de Inversión de Dependencias)

---

## 1. Single Responsibility Principle (SRP)
**Una clase debe tener una única razón para cambiar.**

Cada clase debe encargarse de una sola responsabilidad o funcionalidad.

**Ejemplo:**

```typescript
// Violando SRP
class User {
  saveToDatabase() { /* ... */ }
  validateEmail() { /* ... */ }
}

// Aplicando SRP
class User {
  // ...propiedades y métodos relacionados al usuario...
}

class UserRepository {
  saveToDatabase(user: User) { /* ... */ }
}

class UserValidator {
  validateEmail(email: string) { /* ... */ }
}
```

---

## 2. Open/Closed Principle (OCP)
**Las entidades de software deben estar abiertas para extensión, pero cerradas para modificación.**

Puedes extender el comportamiento de una clase sin modificar su código fuente.

**Ejemplo:**

```typescript
// Violando OCP
class Rectangle {
  area() { /* ... */ }
}
class AreaCalculator {
  calculate(shape: any) {
    if (shape instanceof Rectangle) {
      // ...
    }
    // Si agregamos más figuras, debemos modificar este método
  }
}

// Aplicando OCP
interface Shape {
  area(): number;
}
class Rectangle implements Shape {
  area() { /* ... */ }
}
class Circle implements Shape {
  area() { /* ... */ }
}
class AreaCalculator {
  calculate(shape: Shape) {
    return shape.area();
  }
}
```

---

## 3. Liskov Substitution Principle (LSP)
**Las clases derivadas deben poder sustituir a sus clases base sin alterar el funcionamiento del programa.**

Las subclases deben ser completamente intercambiables por sus clases padre.

**Ejemplo:**

```typescript
// Violando LSP
class Bird {
  fly() { /* ... */ }
}
class Ostrich extends Bird {
  fly() { throw new Error("No puedo volar"); }
}

// Aplicando LSP
interface Bird {
  eat(): void;
}
interface FlyingBird extends Bird {
  fly(): void;
}
class Sparrow implements FlyingBird {
  fly() { /* ... */ }
  eat() { /* ... */ }
}
class Ostrich implements Bird {
  eat() { /* ... */ }
}
```

---

## 4. Interface Segregation Principle (ISP)
**Los clientes no deben verse forzados a depender de interfaces que no utilizan.**

Es mejor tener varias interfaces específicas que una general.

**Ejemplo:**

```typescript
// Violando ISP
interface Worker {
  work(): void;
  eat(): void;
}
class Robot implements Worker {
  work() { /* ... */ }
  eat() { throw new Error("No como"); }
}

// Aplicando ISP
interface Workable {
  work(): void;
}
interface Eatable {
  eat(): void;
}
class Human implements Workable, Eatable {
  work() { /* ... */ }
  eat() { /* ... */ }
}
class Robot implements Workable {
  work() { /* ... */ }
}
```

---

## 5. Dependency Inversion Principle (DIP)
**Los módulos de alto nivel no deben depender de módulos de bajo nivel, ambos deben depender de abstracciones.**

Depende de interfaces o abstracciones, no de implementaciones concretas.

**Ejemplo:**

```typescript
// Violando DIP
class MySQLDatabase {
  connect() { /* ... */ }
}
class UserService {
  db: MySQLDatabase;
  constructor() {
    this.db = new MySQLDatabase();
  }
}

// Aplicando DIP
interface Database {
  connect(): void;
}
class MySQLDatabase implements Database {
  connect() { /* ... */ }
}
class UserService {
  constructor(private db: Database) {}
}
```

---

## Recursos adicionales

- [Wikipedia: SOLID](https://es.wikipedia.org/wiki/SOLID)
- [Principios SOLID explicados con ejemplos](https://medium.com/@tonio.garcia/solid-principios-de-la-programaci%C3%B3n-orientada-a-objetos-1a2c2e2c7b3c)
