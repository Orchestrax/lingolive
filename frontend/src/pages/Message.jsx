import { useEffect, useState } from "react";
import FriendsSidebar from "../Components/Messages/FriendSideBar";
import ChatPage from "../Components/Messages/ChatPage";

const Message = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ensure sidebar defaults open on desktop widths
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex h-screen bg-gray-950 text-white">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-gray-900 border-r border-gray-800 transition-transform duration-200 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <FriendsSidebar
          selectedUser={selectedUser}
          onSelectFriend={(friend) => {
            setSelectedUser(friend);
            // Auto-close on mobile after selecting a friend
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 ml-0 md:ml-0">
        {selectedUser ? (
          <div className="h-full">
            <ChatPage
              selectedUser={selectedUser}
              onOpenSidebar={() => setIsSidebarOpen(true)}
            />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center p-6 text-gray-400">
            <div className="text-center">
              <p className="text-base md:text-lg">Select a friend to start chatting</p>
              <button
                className="mt-4 inline-flex md:hidden items-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                onClick={() => setIsSidebarOpen(true)}
              >
                Open Chats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
