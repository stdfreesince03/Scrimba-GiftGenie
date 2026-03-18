export class OpenAIResponseError extends Error {
    httpCode : number;
    responseStatus : string;
    errorCodeStr :string;

    constructor(httpCode : number, responseStatus : string, errorCodeStr : string,message:string) {
        super(message);
        this.httpCode = httpCode;
        this.responseStatus = responseStatus;
        this.errorCodeStr = errorCodeStr;
    }
}

