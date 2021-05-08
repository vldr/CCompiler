export default abstract class InternalErrors
{
    public static generateError(message: string)
    {
        return new Error(
            "Internal error: " + message
        );
    }
}