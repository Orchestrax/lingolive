import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import { useSocket } from "../../Context/SocketContext";

const FriendsSidebar = ({ onSelectFriend, selectedUser }) => {
  const { onlineUsers } = useSocket();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(
          "https://lingolive.onrender.com/api/friends/getfriends ",
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        ("Fetched friends for message sidebar:", data);
        setFriends(data.friends);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, []);

  return (
    <div className="w-72 bg-[#091530] h-full overflow-y-auto">
      <h2 className="sticky top-0 z-10 text-xl font-bold p-4 border-b border-gray-800 bg-[#091530] text-white">
        Chats
      </h2>
      <ul>
        {friends.length === 0 ? (
          <p className="text-gray-400 p-4">No friends yet</p>
        ) : (
          friends.map((friend) => (
            <li
              key={friend._id}
              onClick={() => onSelectFriend(friend)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                selectedUser?._id === friend._id ? "bg-gray-800" : ""
              }`}
            >
              {friend.profilePic ? (
                <div className="relative">
                  <img
                    src={friend.profilePic}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {onlineUsers.includes(friend._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
                  )}
                </div>
              ) : (
                <UserCircle className="w-10 h-10 text-gray-500" />
              )}
              <div className="min-w-0">
                <h3 className="text-white font-semibold truncate">@{friend.username}</h3>
                <p className="text-gray-400 text-sm truncate">{friend.email}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FriendsSidebar;
