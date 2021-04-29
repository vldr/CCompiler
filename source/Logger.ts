export default class Logger
{
    public log(message: object): void
    {
        console.dir(message, { depth: null });
    }
}