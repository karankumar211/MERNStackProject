import React, {
  Fragment,
  createContext,
  useReducer,
  useState,
  useEffect,
} from "react"; // NEW: Added useState & useEffect
import AdminLayout from "../layout";
import DashboardCard from "./DashboardCard";
import Customize from "./Customize";
import { dashboardState, dashboardReducer } from "./DashboardContext";
import TodaySell from "./TodaySell";
import { socket } from "../../../socket"; // You already have this, which is perfect

export const DashboardContext = createContext();

const DashboardComponent = (props) => {
  return (
    <Fragment>
      <DashboardCard />

      {/* NEW: Display the live feed component */}
      <LiveUserFeed newlyRegistered={props.newlyRegistered} />

      <Customize />
      <TodaySell />
    </Fragment>
  );
};

// NEW: A small component to display the live feed
const LiveUserFeed = ({ newlyRegistered }) => {
  return (
    <div
      style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
      <h3>Live Feed of New Users:</h3>
      {newlyRegistered.length === 0 ? (
        <p>No new users yet...</p>
      ) : (
        <ul>
          {newlyRegistered.map((user) => (
            <li key={user._id}>
              <strong>Name:</strong> {user.name} | <strong>Email:</strong>{" "}
              {user.email} | <strong>Signed Up:</strong>{" "}
              {new Date(user.createdAt).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DashboardAdmin = (props) => {
  const [data, dispatch] = useReducer(dashboardReducer, dashboardState);

  // NEW: State and effect for real-time updates
  const [newlyRegistered, setNewlyRegistered] = useState([]);

  useEffect(() => {
    function onNewUser(user) {
      console.log("New user event received!", user);
      setNewlyRegistered((prevUsers) => [user, ...prevUsers]);
    }

    socket.on("newUserRegistered", onNewUser);

    return () => {
      socket.off("newUserRegistered", onNewUser);
    };
  }, []);

  return (
    <Fragment>
      <DashboardContext.Provider value={{ data, dispatch }}>
        {/* NEW: Pass the real-time data down to the component that renders the UI */}
        <AdminLayout
          children={<DashboardComponent newlyRegistered={newlyRegistered} />}
        />
      </DashboardContext.Provider>
    </Fragment>
  );
};

export default DashboardAdmin;
