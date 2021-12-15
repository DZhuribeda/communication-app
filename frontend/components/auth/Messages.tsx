import { UiText } from "@ory/kratos-client";

interface MessageProps {
  message: UiText;
}

export const Message = ({ message }: MessageProps) => {
  const severity = message.type === "error" ? "error" : "info";
  const severityColor = {
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
  };
  //   TODO: extract this to alert component
  return (
    <div
      className={`flex rounded-lg p-4 mb-4 text-sm ${severityColor[severity]}`}
      role="alert"
    >
      <svg
        className="w-5 h-5 inline mr-3"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        ></path>
      </svg>
      <div data-testid={`ui/message/${message.id}`}>{message.text}</div>
    </div>
  );
};

interface MessagesProps {
  messages?: Array<UiText>;
}

export const Messages = ({ messages }: MessagesProps) => {
  if (!messages) {
    // No messages? Do nothing.
    return null;
  }

  return (
    <div>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};
