class Response {
  constructor(data) {
    this.data = data;
    this.statusCode = 200;
    this.status = true;
    this.timestamp = Date.now();
  }
}

export default Response;
