import { useEffect, useState } from "react";
import Sidebar from "../Components/Connections/Sidebar";
import ShowAllUser from "../Components/Connections/Page/ShowAllUser";
import YourTotalConnection from "../Components/Connections/Page/YourTotalConnection";
import SendRequestConnection from "../Components/Connections/Page/SendRequestConnection";
import ReceiveRequestConnection from "../Components/Connections/Page/ReceiveRequestConnection";
import AppContext from "../Context/UseContext";
import { useContext } from "react";

const Connection = () => {
  const [displayName, setdisplayName] = useState(1);
  const { requests } = useContext(AppContext);
  const [requestBarOpen, setRequestBarOpen] = useState(false);

  const values = [
    { id: 1, element: <ShowAllUser /> },
    { id: 2, element: <YourTotalConnection /> },
    { id: 3, element: <SendRequestConnection /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setRequestBarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-1 gap-4 mt-5 lg:mx-10">
      <div className="mx-2">
        <Sidebar setdisplayName={setdisplayName} displayName={displayName} />
      </div>

      <div className="lg:col-span-3 mt-5">
        {displayName === 1 && (
          <div>
            {requests.length > 0 ? (
              <>
                <h1 className="text-white text-2xl ml-4">Friend Requests</h1>
                <ReceiveRequestConnection />
                <hr className="my-4" />
              </>
            ) : requestBarOpen ? (
              <>
                <div className="bg-gray-800 p-4 rounded-lg mx-2 border-2 border-gray-700">
                  <h1 className="text-white text-xl ml-4">Friend Requests</h1>
                  <p className="text-white text-sm ml-4">
                    No Friend Requests Available
                  </p>
                </div>
                <hr className="my-4" />
              </>
            ) : null}
          </div>
        )}

        {displayName === 1 ? (
          <ShowAllUser />
        ) : displayName === 2 ? (
          <YourTotalConnection />
        ) : displayName === 3 ? (
          <SendRequestConnection />
        ) : null}
      </div>
    </div>
  );
};

export default Connection;
