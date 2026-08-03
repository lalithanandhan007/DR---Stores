class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    if (data !== undefined) this.data = data;
  }

  static success(data, message = 'Success') {
    return new ApiResponse(200, data, message);
  }

  static created(data, message = 'Created successfully') {
    return new ApiResponse(201, data, message);
  }

  static paginated(data, total, page, limit) {
    return new ApiResponse(200, {
      items: data,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  }
}

export default ApiResponse;
