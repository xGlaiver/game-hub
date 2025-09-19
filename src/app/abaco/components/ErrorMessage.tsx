type Props = {
    message: string;
};

const ErrorMessage = ({ message }: Props) => (
    <p
        className={`text-red-800 font-medium transition mt-2.5 ${
            message ? "opacity-100 translate-0" : "opacity-0 -translate-x-60"
        }`}
    >
        {message}
    </p>
);

export default ErrorMessage;
