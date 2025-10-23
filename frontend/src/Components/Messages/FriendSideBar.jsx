import { useEffect, useState } from "react";
import { UserCircle, Users, Search } from "lucide-react";
import { useSocket } from "../../Context/SocketContext";

const FriendsSidebar = ({ onSelectFriend, selectedUser }) => {
  const { onlineUsers } = useSocket();
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/friends/getfriends",
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("Fetched friends for message sidebar:", data);
        setFriends(data.friends || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, []);

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-gray-900/90 backdrop-blur-xl h-full overflow-y-auto border-r border-gray-700/50">
      {/* Header */}
      <div className="sticky top-0 z-10 p-6 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Messages
          </h2>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="p-4">
        {filteredFriends.length === 0 ? (
          <div className="text-center py-12">
            <UserCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              {searchTerm ? "No friends found" : "No friends yet"}
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm ? "Try a different search term" : "Start connecting with people"}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredFriends.map((friend) => (
              <li
                key={friend._id}
                onClick={() => onSelectFriend(friend)}
                className={`flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all duration-300 ${
                  selectedUser?._id === friend._id 
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 shadow-lg" 
                    : "hover:bg-gray-800/50 border border-transparent hover:border-gray-600/30"
                }`}
              >
                <div className="relative flex-shrink-0">
                  {friend.profilePic ? (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                      <img
                        src={friend.profilePic}
                        alt="profile"
                        className="w-full h-full rounded-2xl object-cover bg-gray-800"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center">
                      <UserCircle className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {onlineUsers.includes(friend._id) && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-gray-900 rounded-full"></span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold text-lg truncate">
                    @{friend.username}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {onlineUsers.includes(friend._id) ? "Online" : "Offline"}
                  </p>
                </div>
                {onlineUsers.includes(friend._id) && (
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsSidebar;