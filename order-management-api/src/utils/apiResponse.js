class ApiResponse {
  static success(res, data, message = "") {
    res.json({ success: true, message, errors: [], data });
  }

  static error(res, message = "Error", errors = [], status = 400) {
    res.status(status).json({ success: false, message, errors, data: null });
  }
}

module.exports = ApiResponse;