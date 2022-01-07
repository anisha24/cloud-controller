function status_mapping() {
  return {
    "400": {
      "errCode": "BadRequest",
      "errParams": [],
      "errMessage": "Unable to process request"
    },
    "401": {
      "errCode": "Unauthorized",
      "errParams": [],
      "errMessage": "Unauthorized error"
    },
    "403": {
      "errCode": "Forbidden",
      "errParams": [],
      "errMessage": "Forbidden"
    },
    "404": {
      "errCode": "NotFound",
      "errParams": [],
      "errMessage": "Requested resource does not exists"
    },
    "500": {
      "errCode": "InternalServerError",
      "errParams": [],
      "errMessage": "Internal server error"
    },
    "501": {
      "errCode": "NotImplemented",
      "errParams": [],
      "errMessage": "Not Implemented"
    },
    "502": {
      "errCode": "BadGateway",
      "errParams": [],
      "errMessage": "Bad gateway"
    },
    "503": {
      "errCode": "ServiceUnavailable",
      "errParams": [],
      "errMessage": "Requested service is not available"
    },
    "504": {
      "errCode": "GatewayTimeout",
      "errParams": [],
      "errMessage": "Gateway timeout"
    }
  };
}

function errorHandler(key, errCode, errParams, errMessage) {
  if (key !== undefined) {
    var status = status_mapping();
    status[key].errParams = [];
    status[key].errCode = errCode ? errCode : status[key].errCode;
    status[key].errParams = errParams ? errParams : status[key].errParams;
    status[key].errMessage = errMessage ? errMessage : status[key].errMessage;
    return status[key];
  } else {
    return {
      errCode: errCode,
      errParams: errParams ? errParams : [],
      errMessage: errMessage
    }
  }
}

module.exports.errorHandler = errorHandler;
