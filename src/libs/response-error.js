class ResponseError {
  constructor(message, reason, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
    this.reason = reason;
    this.status = false;
    this.timestamp = Date.now();
  }
}

export default ResponseError;
