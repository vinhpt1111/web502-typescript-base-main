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

const schema = z.object({
  name: z.string().min(3, "Name > 3 ký tự"),
  credit: z.number().min(1, "Credit > 0"),
  category: z.string().nonempty("Chọn category"),
  teacher: z.string().min(3, "Teacher > 3 ký tự"),
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
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:3000/courses/${id}`)
      .then(res => reset(res.data))
      .catch(console.log);
  }, [id, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      id
        ? await axios.put(`http://localhost:3000/courses/${id}`, data)
        : await axios.post("http://localhost:3000/courses", data);

      toast.success(id ? "Cập nhật thành công" : "Thêm thành công");
      nav("/list");
    } catch (err) {
      toast.error("Lỗi: " + (err as AxiosError).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-xl space-y-4">
      <input {...register("name")} placeholder="Name" className="border p-2 w-full" />
      <p className="text-red-500">{errors.name?.message}</p>

      <input type="number" {...register("credit", { valueAsNumber: true })} placeholder="Credit" className="border p-2 w-full" />
      <p className="text-red-500">{errors.credit?.message}</p>

      <select {...register("category")} className="border p-2 w-full">
        <option value="">-- Chuyên ngành --</option>
        <option value="IT">IT</option>
        <option value="Marketing Sale">Marketing</option>
        <option value="Digital Marketing">Digital Marketing</option>
      </select>
      <p className="text-red-500">{errors.category?.message}</p>

      <input {...register("teacher")} placeholder="Teacher" className="border p-2 w-full" />
      <p className="text-red-500">{errors.teacher?.message}</p>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}

export default AddPage;
