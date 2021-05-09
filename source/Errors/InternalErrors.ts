export default abstract class InternalErrors
{
    public static generateError(message: string)
    {
        console.trace();

        return new Error(
            "Internal error: " + message
        );
    }
}