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

function ListPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/courses");
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);

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
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Danh sách
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-center">
                ID
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Credit
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Category
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Teacher
              </th>
              <th className="px-4 py-2 border border-gray-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {courses.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {item.id}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {item.name}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {item.credit}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {item.category}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {item.teacher}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex justify-center gap-2">
                  <Link
                    to={`/edit/${item.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded">
                    Edit
                  </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListPage;
