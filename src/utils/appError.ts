export class AppError extends Error {
  public statusCode: number; 

  constructor( message: string,  statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, AppError.prototype); // Imposta il prototipo dell'oggetto per mantenere la catena di ereditarietà corretta
  }
}