import ErrorLocation from "./ErrorLocation";

export default class CompilerError
{
    constructor(
        public readonly message: string,
        public readonly start: ErrorLocation,
        public readonly end: ErrorLocation
    )
    {
    }
}
