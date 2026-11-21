import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  userId: "",
  doctorPhoneNumber: "",
  specialization: "",
  qualification: "",
  experienceYears: "",
  hospitalName: "",
  licenseNumber: "",
  availableStatus: true,
};

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/doctors");
      setDoctors(
        Array.isArray(response.data)
          ? response.data
          : response.data.content || [],
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      userId: Number(form.userId),
      experienceYears:
        form.experienceYears === "" ? null : Number(form.experienceYears),
    };

    try {
      setLoading(true);

      if (editingId !== null) {
        await api.put(`/api/doctors/${editingId}`, payload);
        setSuccess("Doctor updated successfully.");
      } else {
        await api.post("/api/doctors", payload);
        setSuccess("Doctor created successfully.");
      }

      resetForm();
      await loadDoctors();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Doctor operation failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      const response = await api.get(`/api/doctors/${id}`);
      const doctor = response.data;

      setForm({
        userId: doctor.userId ?? "",
        doctorPhoneNumber: doctor.doctorPhoneNumber ?? "",
        specialization: doctor.specialization ?? "",
        qualification: doctor.qualification ?? "",
        experienceYears: doctor.experienceYears ?? "",
        hospitalName: doctor.hospitalName ?? "",
        licenseNumber: doctor.licenseNumber ?? "",
        availableStatus: doctor.availableStatus ?? true,
      });

      setEditingId(id);
      setSuccess("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError("Unable to load doctor details.");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this doctor profile?")
    ) {
      return;
    }

    try {
      await api.delete(`/api/doctors/${id}`);
      setSuccess("Doctor deleted successfully.");
      setError("");
      await loadDoctors();

      if (editingId === id) resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete doctor. Check whether related appointments exist.",
      );
    }
  };

  return (
    <div className="crud-page">
      <h1>Doctor Management</h1>
      <p>Create, view, update and delete doctor profiles.</p>

      {error && <div className="crud-error">{error}</div>}
      {success && <div className="crud-success">{success}</div>}

      <section className="crud-card">
        <h2>{editingId !== null ? "Update Doctor" : "Add Doctor"}</h2>

        <form onSubmit={handleSubmit} className="crud-form">
          <label>User ID *</label>
          <input
            type="number"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
            disabled={editingId !== null}
          />

          <label>Phone Number</label>
          <input
            name="doctorPhoneNumber"
            value={form.doctorPhoneNumber}
            onChange={handleChange}
            maxLength="15"
          />

          <label>Specialization *</label>
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            maxLength="100"
            required
          />

          <label>Qualification</label>
          <input
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            maxLength="150"
          />

          <label>Experience (years)</label>
          <input
            type="number"
            name="experienceYears"
            min="0"
            value={form.experienceYears}
            onChange={handleChange}
          />

          <label>Hospital Name</label>
          <input
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            maxLength="150"
          />

          <label>Medical License Number</label>
          <input
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
            maxLength="100"
          />

          <label className="crud-checkbox">
            <input
              type="checkbox"
              name="availableStatus"
              checked={form.availableStatus}
              onChange={handleChange}
            />
            Doctor is available
          </label>

          <div className="crud-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : editingId !== null
                  ? "Update Doctor"
                  : "Create Doctor"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="crud-card">
        <h2>Doctor Records</h2>

        <button type="button" className="secondary-btn" onClick={loadDoctors}>
          Refresh
        </button>

        {loading && <p>Loading doctors...</p>}

        <div className="crud-table-wrapper">
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.doctorId}>
                  <td>{doctor.doctorId}</td>
                  <td>{doctor.userId}</td>
                  <td>{doctor.fullName}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.experienceYears ?? 0} years</td>
                  <td>
                    {doctor.availableStatus ? "Available" : "Unavailable"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(doctor.doctorId)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(doctor.doctorId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && doctors.length === 0 && (
                <tr>
                  <td colSpan="8">No doctor records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default DoctorManagement;
