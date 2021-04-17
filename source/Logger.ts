export default class Logger
{
    public static log(message: object): void
    {
        console.dir(message, { depth: null });
    }
}