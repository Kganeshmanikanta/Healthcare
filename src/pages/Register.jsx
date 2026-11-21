import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("PATIENT");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    doctorPhoneNumber: "",
    specialization: "",
    qualification: "",
    experienceYears: "",
    hospitalName: "",
    licenseNumber: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      };

      let endpoint = "/api/auth/register/patient";

      if (role === "DOCTOR") {
        endpoint = "/api/auth/register/doctor";

        payload = {
          ...payload,
          doctorPhoneNumber: form.doctorPhoneNumber,
          specialization: form.specialization,
          qualification: form.qualification,
          experienceYears: Number(form.experienceYears),
          hospitalName: form.hospitalName,
          licenseNumber: form.licenseNumber,
        };
      }

      const response = await api.post(endpoint, payload);

      setSuccess(response.data.message || "Registration successful!");

      // Doctor and patient registration both return an access token
      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("role", response.data.role);

        setTimeout(() => {
          navigate(
            role === "DOCTOR" ? "/doctor-dashboard" : "/patient-dashboard",
          );
        }, 1000);
      } else {
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h1>Create Account</h1>
        <p>Join our Healthcare Management System</p>

        <label>Register As</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
        </select>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            name="fullName"
            placeholder="Enter full name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />

          {role === "DOCTOR" && (
            <>
              <label>Phone Number</label>
              <input
                name="doctorPhoneNumber"
                placeholder="Phone number"
                value={form.doctorPhoneNumber}
                onChange={handleChange}
                required
              />

              <label>Specialization</label>
              <input
                name="specialization"
                placeholder="e.g. Cardiologist"
                value={form.specialization}
                onChange={handleChange}
                required
              />

              <label>Qualification</label>
              <input
                name="qualification"
                placeholder="e.g. MBBS, MD"
                value={form.qualification}
                onChange={handleChange}
                required
              />

              <label>Experience (years)</label>
              <input
                type="number"
                name="experienceYears"
                min="0"
                placeholder="Years of experience"
                value={form.experienceYears}
                onChange={handleChange}
                required
              />

              <label>Hospital Name</label>
              <input
                name="hospitalName"
                placeholder="Hospital name"
                value={form.hospitalName}
                onChange={handleChange}
                required
              />

              <label>Medical License Number</label>
              <input
                name="licenseNumber"
                placeholder="License number"
                value={form.licenseNumber}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
