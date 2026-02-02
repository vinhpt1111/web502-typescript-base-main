import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

type Props = {
  isLogin?: boolean;
};

type FormValues = {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

/* ===== SCHEMA ===== */
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(7, "Password phải > 6 ký tự"),
});

const registerSchema = z
  .object({
    username: z.string().min(5, "Username phải > 4 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(7, "Password phải > 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password không khớp",
    path: ["confirmPassword"],
  });

function AuthPage({ isLogin = false }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isLogin) {
        const { data } = await axios.post(
          "http://localhost:3000/login",
          {
            email: values.email,
            password: values.password,
          }
        );

        // 🔥 CHỈ LƯU USERNAME
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data.user.username,
          })
        );

        toast.success("Đăng nhập thành công");
        window.location.href = "/list";
      } else {
        await axios.post("http://localhost:3000/register", values);
        toast.success("Đăng ký thành công");
        window.location.href = "/login";
      }
    } catch (error) {
      toast.error("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">
        {isLogin ? "Login" : "Register"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label>Username</label>
            <input {...register("username")} className="w-full border px-3 py-2" />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
        )}

        <div>
          <label>Email</label>
          <input {...register("email")} className="w-full border px-3 py-2" />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border px-3 py-2"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {!isLogin && (
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full border px-3 py-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
