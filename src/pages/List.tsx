import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Course = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

const LIMIT = 3 ;

function ListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [teacher, setTeacher] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:3000/courses")
      .then(res => setCourses(res.data))
      .catch(console.log);
  }, []);

  const searched = courses.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const filtered = teacher
    ? searched.filter(item => item.teacher === teacher)
    : searched;

  const totalPage = Math.ceil(filtered.length / LIMIT);
  const start = (page - 1) * LIMIT;
  const paginated = filtered.slice(start, start + LIMIT);

  const teachers = Array.from(
    new Set(courses.map(item => item.teacher))
  );
  const handleDelete = async (id: number) => {
    const ok = confirm("Bạn có chắc muốn xóa không?");
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:3000/courses/${id}`);
      alert("Xóa thành công");
      setCourses(courses.filter(item => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Danh sách khóa học
      </h1>

      <div className="flex gap-4 mb-4">
        <input
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo tên..."
          className="border px-3 py-2"
        />

        <select
          value={teacher}
          onChange={e => {
            setTeacher(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2"
        >
          <option value="">-- Tất cả giảng viên --</option>
          {teachers.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Credit</th>
            <th className="border p-2">Teacher</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(item => (
            <tr key={item.id}>
              <td className="border p-2 text-center">
                {item.id}
              </td>
              <td className="border p-2">
                {item.name}
              </td>
              <td className="border p-2">
                {item.credit}
              </td>
              <td className="border p-2">
                {item.teacher}
              </td>
              <td className="border p-2">
                {item.category}
              </td>
              <td className="border p-2 text-center">
                <Link
                  to={`/edit/${item.id}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Edit
                </Link>
                <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 m-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
              </td>
            
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPage }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ListPage;
