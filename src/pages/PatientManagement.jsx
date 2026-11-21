
import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  patientId: "",
  doctorId: "",
  appointmentDate: "",
  appointmentTime: "",
  reasonForVisit: "",
  status: "BOOKED",
  doctorNotes: "",
};

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentRes, patientRes, doctorRes] = await Promise.all([
        api.get("/api/appointments"),
        api.get("/api/patients"),
        api.get("/api/doctors"),
      ]);

      setAppointments(appointmentRes.data);
      setPatients(patientRes.data);
      setDoctors(doctorRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load appointments, patients or doctors."
      );
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      patientId: Number(form.patientId),
      doctorId: Number(form.doctorId),
      appointmentDate: form.appointmentDate,
      appointmentTime: form.appointmentTime,
      reasonForVisit: form.reasonForVisit,
      status: form.status,
      doctorNotes: form.doctorNotes,
    };

    try {
      if (editingId) {
        await api.put(`/api/appointments/${editingId}`, payload);
        setSuccess("Appointment updated successfully!");
      } else {
        await api.post("/api/appointments", payload);
        setSuccess("Appointment created successfully!");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to save appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.appointmentId);

    setForm({
      patientId: String(appointment.patientId),
      doctorId: String(appointment.doctorId),
      appointmentDate: appointment.appointmentDate || "",
      appointmentTime: appointment.appointmentTime || "",
      reasonForVisit: appointment.reasonForVisit || "",
      status: appointment.status || "BOOKED",
      doctorNotes: appointment.doctorNotes || "",
    });

    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      await api.delete(`/api/appointments/${id}`);
      setSuccess("Appointment deleted successfully!");
      await loadData();

      if (editingId === id) resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete appointment."
      );
    }
  };

  return (
    <div className="crud-page">
      <div className="crud-card">
        <h1>Appointment Management</h1>
        <p>Create, view, update and delete appointments.</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <h2>{editingId ? "Update Appointment" : "Book Appointment"}</h2>

        <form className="crud-form" onSubmit={handleSubmit}>
          <label>Patient</label>
          <select
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.patientId} value={patient.patientId}>
                {patient.fullName} (ID: {patient.patientId})
              </option>
            ))}
          </select>

          <label>Doctor</label>
          <select
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.doctorId} value={doctor.doctorId}>
                Dr. {doctor.fullName} - {doctor.specialization}
              </option>
            ))}
          </select>

          <label>Appointment Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
          />

          <label>Appointment Time</label>
          <input
            type="time"
            name="appointmentTime"
            value={form.appointmentTime}
            onChange={handleChange}
            required
          />

          <label>Reason for Visit</label>
          <textarea
            name="reasonForVisit"
            value={form.reasonForVisit}
            onChange={handleChange}
            placeholder="Enter reason for visit"
          />

          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="BOOKED">Booked</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <label>Doctor Notes</label>
          <textarea
            name="doctorNotes"
            value={form.doctorNotes}
            onChange={handleChange}
            placeholder="Doctor notes"
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
                ? "Update Appointment"
                : "Book Appointment"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="crud-card">
        <h2>All Appointments</h2>

        <div className="crud-table-wrapper">
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient ID</th>
                <th>Doctor ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.appointmentId}>
                  <td>{appointment.appointmentId}</td>
                  <td>{appointment.patientId}</td>
                  <td>{appointment.doctorId}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.reasonForVisit}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(appointment)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(appointment.appointmentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {appointments.length === 0 && (
                <tr>
                  <td colSpan="8">No appointments available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Appointments;
