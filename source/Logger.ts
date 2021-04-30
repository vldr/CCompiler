export default class Logger
{
    public log(message: any): void
    {
        console.dir(message, { depth: null });
    }
}