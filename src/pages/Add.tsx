import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

const validate = z.object({
  name: z.string().min(3, "Name phải trên 3 ký tự"),
  credit: z.number().min(1, "Credit phải > 0"),
  category: z.string().nonempty("Chọn category"),
  teacher: z.string().min(3, "Teacher phải trên 3 ký tự"),
});

function AddPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validate),
  });

  useEffect(() => {
    const getDetail = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/courses/${id}`
        );
        reset(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) getDetail();
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (id) {
        await axios.put(`http://localhost:3000/courses/${id}`, values);
      } else {
        await axios.post("http://localhost:3000/courses", values);
      }
      toast.success("Thành công");
      nav("/list");
    } catch (error) {
      toast.error("Thất bại: " + (error as AxiosError).message);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? "Cập nhật" : "Thêm mới"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            {...register("name")}
            className="w-full border rounded-lg px-3 py-2"
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Credit</label>
          <input
            type="number"
            {...register("credit", { valueAsNumber: true })}
            className="w-full border rounded-lg px-3 py-2"
          />
          <p className="text-red-500 text-sm">{errors.credit?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            {...register("category")}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Chọn --</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Cơ sở">Cơ sở</option>
            <option value="Đại cương">Đại cương</option>
          </select>
          <p className="text-red-500 text-sm">{errors.category?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Teacher</label>
          <input
            {...register("teacher")}
            className="w-full border rounded-lg px-3 py-2"
          />
          <p className="text-red-500 text-sm">{errors.teacher?.message}</p>
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddPage;
