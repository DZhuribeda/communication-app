import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { useUser } from "../lib/state/user";

type UsernameFormInputs = {
  username: string | null;
};

export default function LoginPage() {
  const username = useUser((state) => state.username);
  const changeUsername = useUser((state) => state.changeUsername);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameFormInputs>({
    defaultValues: { username },
  });
  const onSubmit = (data: UsernameFormInputs) => {
    changeUsername(data.username);
    navigate("/");
  };

  return (
    <div className="container h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <div className="my-1">
            <input
              className="shadow-sm mt-1 block w-full border-2  border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 "
              type="text"
              {...register("username")}
            />
          </div>
          {/* errors will return when field validation fails  */}
          {errors.username && <span>This field is required</span>}
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
