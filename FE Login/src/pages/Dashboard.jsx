import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      // 🔥 kalau unauthorized → redirect ke login
      if (err.response && err.response.status === 401) {
        navigate("/");
      } else {
        alert("Gagal ambil data");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/logout");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Gagal logout");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="header">
        <h1>Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="container">
        <div className="card">
          <h2>Data Users</h2>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id}>
                  <td>{i + 1}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}