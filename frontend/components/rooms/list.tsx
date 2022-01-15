import { useQuery } from "react-query";
import { Room } from "../../libs/entities/room";
import { Button } from "../core/button/button";
import { Size } from "../core/general";
import { Link } from "../core/link/link";

const fetchRooms = () =>
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/v1/rooms`, {
    credentials: "include",
  }).then((res) => res.json());

export function RoomsList() {
  const { isLoading, isError, data } = useQuery<Room[]>(["rooms"], () =>
    fetchRooms()
  );
  if (isLoading) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <div
          className="w-12 h-12 border-4 border-primary-600 rounded-full animate-spin"
          style={{ borderRightColor: "transparent" }}
        ></div>
        <div className="text-xl pt-4">Loading</div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <div className="text-xl">Error during loading rooms</div>
      </div>
    );
  }
  return data === undefined || data.length === 0 ? (
    <div className="px-4 py-6 tablet:px-0">
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <h2 className="text-xl">There are no rooms here.</h2>
        <div className="text-center">
          <Link size={Size.xxl} href="/rooms/new">
            Create a room
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="px-4 py-6 tablet:px-0">
      <div className="grid grid-cols-4 gap-4">
        {data.map((room) => (
          <div key={room.id} className="rounded-lg p-4 shadow-md">
            <div className="h-40 flex justify-between flex-col">
              <div className="flex flex-col gap-2">
                <div className="text-xl">{room.name}</div>
                <div>{room.members} members</div>
              </div>
              <div>
                <Button size={Size.sm} fullWidth>
                  Join
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
