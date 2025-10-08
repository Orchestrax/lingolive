import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../Context/SocketContext";
import { Send, FolderUpIcon } from "lucide-react";
import "remixicon/fonts/remixicon.css";

const ChatPage = ({ selectedUser, onOpenSidebar }) => {
  const { messages, setMessages, onlineUsers } = useSocket();
  const [text, setText] = useState("");
  const [media, setMedia] = useState({
    image: null,
    video: null,
    audio: null,
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch chat history
  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/${selectedUser._id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("Fetched messages:", data);
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type;
    if (type.startsWith("image"))
      setMedia({ image: file, video: null, audio: null, file: null });
    else if (type.startsWith("video"))
      setMedia({ image: null, video: file, audio: null, file: null });
    else if (type.startsWith("audio"))
      setMedia({ image: null, video: null, audio: file, file: null });
    else setMedia({ image: null, video: null, audio: null, file });
  };

  // Send new message
  const sendMessage = async () => {
    if (
      !text.trim() &&
      !media.image &&
      !media.video &&
      !media.audio &&
      !media.file
    )
      return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("receiverId", selectedUser._id);
      if (text.trim()) formData.append("text", text.trim());
      if (media.image) formData.append("image", media.image);
      if (media.video) formData.append("video", media.video);
      if (media.audio) formData.append("audio", media.audio);
      if (media.file) formData.append("file", media.file);

      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data?.data) {
        setText("");
        setMedia({ image: null, video: null, audio: null, file: null });
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gray-900">
        <button
          className="md:hidden mr-1 flex flex-col items-center justify-center w-9 h-9 rounded-md bg-gray-800 text-white"
          onClick={onOpenSidebar}
          aria-label="Open chats"
        >
          {/* simple hamburger */}
          <span className="block w-5 h-0.5 bg-white mb-1"></span>
          <span className="block w-5 h-0.5 bg-white mb-1"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
        </button>
        <img
          src={selectedUser.profilePic || "/default-avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="text-white font-semibold text-lg">
            @{selectedUser.username}
          </h2>
          <p className="text-gray-400 text-sm">
            {onlineUsers.includes(selectedUser._id) ? "🟢Online" : "🔴Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 custom-scrollbar">
        {messages.map((m) => {
          const senderId =
            typeof m.sender === "object" ? m.sender._id : m.sender;
          const isOwn = senderId !== selectedUser._id;

          return (
            <div
              key={m._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 max-w-[80%] md:max-w-xs ${
                  isOwn ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {!isOwn && (
                  <img
                    src={selectedUser.profilePic || "/default-avatar.png"}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div
                  className={`p-3 rounded-2xl break-words ${
                    isOwn
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{m.text}</p>
                  {m.image && (
                    <img
                      src={m.image}
                      alt="sent"
                      className="rounded-lg mt-2 max-w-[200px]"
                    />
                  )}
                  {m.video && (
                    <video
                      src={m.video}
                      controls
                      className="rounded-lg mt-2 max-w-[250px]"
                    />
                  )}
                  {m.audio && <audio src={m.audio} controls className="mt-2" />}
                  {m.file && (
                    <a
                      href={m.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline mt-2 block"
                    >
                      📎 Download file
                    </a>
                  )}

                  <span className="text-[10px] text-gray-400 block mt-1 text-right">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef}></div>
      </div>

      {/* Media preview before sending */}
      {(media.image || media.video || media.audio || media.file) && (
        <div className="p-2 flex items-center gap-3 border-t border-gray-800 bg-gray-900">
          {media.image && (
            <img
              src={URL.createObjectURL(media.image)}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg border border-gray-700"
            />
          )}
          {media.video && (
            <video
              src={URL.createObjectURL(media.video)}
              controls
              className="w-24 h-20 rounded-lg border border-gray-700"
            />
          )}
          {media.audio && (
            <audio
              src={URL.createObjectURL(media.audio)}
              controls
              className="w-48"
            />
          )}
          {media.file && (
            <p className="text-sm text-gray-300 truncate max-w-[150px]">
              📎 {media.file.name}
            </p>
          )}
          <button
            onClick={() =>
              setMedia({ image: null, video: null, audio: null, file: null })
            }
            className="text-red-400 text-xs underline"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center border-t border-gray-800 p-3 bg-gray-900">
        <FolderUpIcon
          className="cursor-pointer mr-3 text-amber-500"
          onClick={() => document.getElementById("media").click()}
        />
        <input
          type="file"
          id="media"
          className="hidden"
          onChange={handleMediaChange}
        />

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white p-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={sendMessage}
          className={`ml-3 p-2 ${loading ? "bg-gray-600" : "bg-blue-600"} ${loading ? "hover:bg-gray-700" : "hover:bg-blue-700"} rounded-full transition`}
          disabled={loading}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
