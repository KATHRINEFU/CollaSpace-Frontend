import { ITicketLog } from "../../types";
import { useEffect, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { Button, Input, notification } from "antd";
import axios from "axios";
import { useUser } from "../../hooks/useUser";

interface MessageListProps {
  logs: ITicketLog[];
  currentUserId: number;
  ticketId: number;
}

const MessageList: React.FC<MessageListProps> = ({
  logs,
  currentUserId,
  ticketId,
}) => {
  function getFormattedDate(date: Date) {
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var year = date.getFullYear();
    var hour = ("0" + date.getHours()).slice(-2);
    var min = ("0" + date.getMinutes()).slice(-2);
    var seg = ("0" + date.getSeconds()).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seg;
  }

  const user = useUser();
  const [newMessage, setNewMessage] = useState("");
  const [, setError] = useState("");
  const [sortedLogs, setSortedLogs] = useState<ITicketLog[]>([]);
  const [allLogs, setAllLogs] = useState(sortedLogs);

  const { TextArea } = Input;

  const handleSendMessage = () => {
    if (newMessage) {
      // Add the new message to dababase and logs.

      const payload = {
        ticketId: ticketId,
        ticketLogCreator: user?.id,
        ticketLogContent: newMessage,
      };

      axios
        .post("/api/ticket/log/create", payload)
        .then((r) => {
          if (!r.data) {
            setError("Error: Ticket creation failed");
            return;
          }
          notification.success({
            type: "success",
            message: "Ticket Created successfully",
          });
        })
        .catch(() => {
          setError("Error: Ticket creation failed");
        });

      const newLog = {
        ticketLogId: logs.length + 1, // Replace with the appropriate ID.
        ticketLogCreator: currentUserId,
        ticketLogCreationdate: new Date(),
        ticketLogContent: newMessage,
      };
      setAllLogs((prevList) => [...prevList, newLog]);
      console.log(newLog);
      setNewMessage("");
    }
  };

  useEffect(() => {
    setSortedLogs(
      [...logs].sort(
        (a, b) =>
          new Date(a.ticketLogCreationdate).getTime() -
          new Date(b.ticketLogCreationdate).getTime(),
      ),
    );
  }, [logs]);

  useEffect(() => {
    setAllLogs(sortedLogs);
  }, [sortedLogs]);

  return (
    <div className="message-list relative h-full">
      {allLogs.map((log) => (
        <div className="flex flex-col space-y-2 mt-3" key={log.ticketLogId}>
          <div
            className={`flex items-center space-x-2 ${
              log.ticketLogCreator === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-3 max-w-md w-80 rounded-lg ${
                log.ticketLogCreator === currentUserId
                  ? "bg-white"
                  : "bg-blue-100"
              }`}
            >
              <p className="text-xs">{log.ticketLogContent}</p>
              <div className="text-sm mt-3">
                {log.ticketLogCreator === currentUserId
                  ? "You"
                  : `${log.ticketLogCreatorName}`}
                <span> </span>
                {getFormattedDate(new Date(log.ticketLogCreationdate))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Input box for sending messages */}
      <div className="flex items-center space-x-2 justify-start absolute inset-x-0 bottom-9">
        <TextArea
          rows={4}
          className="p-3 w-full max-w-md rounded-lg border-gray-300 border focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          icon={<SendOutlined />}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageList;
