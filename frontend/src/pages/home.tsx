import { useLoggedUser } from "../lib/state/user";
import { Link } from "react-router-dom";

function Room({ username }: { username: string }) {
  return <p>Welcome, {username}!</p>;
}

export default function Home() {
  const user = useLoggedUser();
  return (
    <div className="container mx-auto h-screen w-full flex justify-center items-center">
      {user ? (
        <Room username={user.username} />
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
