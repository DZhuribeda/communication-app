import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Room } from "../../libs/entities/room";
import { Size } from "../core/general";
import { Link } from "../core/link/link";
import { Empty } from "../layout/empty";
import { Loading } from "../layout/loading";
import { PreMedia } from "./pre-media";

export function MediaRoom() {
  const router = useRouter();
  const roomSlug = router.query.slug as string;
  const { isLoading, isError, data } = useQuery(
    ["room", roomSlug],
    ({ signal }) =>
      axios.get<Room>(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/v1/rooms/${roomSlug}`,
        { withCredentials: true, signal }
      )
  );
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Empty message="Error during loading room" />;
  }
  return data === undefined ? (
    <div className="px-4 py-6 tablet:px-0">
      <div className="flex h-80 flex-col items-center justify-center text-center">
        <h2 className="text-xl">There are no room here.</h2>
        <div className="text-center">
          <Link size={Size.xxl} href="/rooms">
            Back to list
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="px-4 py-6 tablet:px-0">
      <PreMedia room={data.data} />
    </div>
  );
}
