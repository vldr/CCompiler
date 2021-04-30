export default class ErrorLocation
{
    constructor(
        public readonly offset: number,
        public readonly line: number,
        public readonly column: number)
    {
    }
}