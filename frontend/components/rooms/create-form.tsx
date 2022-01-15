import axios from "axios";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query"
import { Button, ButtonAction } from "../core/button/button";
import { Size } from "../core/general";
import { Input } from "../core/input/input";
import { Link } from "../core/link/link";


type Inputs = {
  name: string,
};

export function CreateRoomForm() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<Inputs>();
  const router = useRouter();
  
  const backToList = () => {router.push('/rooms')}
  const mutation = useMutation((values: Inputs) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/v1/rooms`, {
      name: values.name,
    }, { withCredentials: true })
  }, {
    onSuccess: () => {
      backToList();
    },
  });
  const onSubmit: SubmitHandler<Inputs> = data => mutation.mutate(data);
  return (
    <div className="px-4 py-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-72 flex flex-col gap-3">
        <Input
          id='name'
          {...register('name', {
            required: true,
          })}
          label='Room name'
          error={errors.name && 'This field is required'}
        />
        <div className="text-right">
          <Button
            size={Size.md}
            action={ButtonAction.TERTIARY_GRAY}
            onClick={backToList}
          >
            Back to list
          </Button>
          <Button
            type="submit"
            size={Size.md}
            disabled={mutation.isLoading}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}