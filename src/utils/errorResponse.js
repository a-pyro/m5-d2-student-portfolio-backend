export default class ErrorRespone extends Error {
  constructor(message, statusCode, origin) {
    super(message);
    this.statusCode = statusCode;
    this.origin = origin;
  }
}
