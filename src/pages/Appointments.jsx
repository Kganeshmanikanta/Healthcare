import { useEffect, useState } from "react";
import api from "../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reasonForVisit: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
          "Unable to load data. Please login first.",
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      reasonForVisit: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      patientId: Number(formData.patientId),
      doctorId: Number(formData.doctorId),
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime + ":00",
      reasonForVisit: formData.reasonForVisit,
      status: "BOOKED",
      doctorNotes: "",
    };

    try {
      if (editingId) {
        await api.put(`/api/appointments/${editingId}`, payload);
        setMessage("Appointment updated successfully!");
      } else {
        await api.post("/api/appointments", payload);
        setMessage("Appointment booked successfully!");
      }

      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save appointment.");
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.appointmentId);

    setFormData({
      patientId: String(appointment.patientId),
      doctorId: String(appointment.doctorId),
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime.substring(0, 5),
      reasonForVisit: appointment.reasonForVisit || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await api.delete(`/api/appointments/${id}`);
      setMessage("Appointment deleted successfully!");
      loadData();
    } catch (err) {
      setError("Unable to delete appointment.");
    }
  };

  return (
    <div className="appointment-page">
      <div className="appointment-header">
        <h1>Appointment Management</h1>
        <p>Book and manage your healthcare appointments.</p>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="appointment-card">
        <h2>{editingId ? "Update Appointment" : "Book New Appointment"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Patient</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Choose Patient</option>
              {patients.map((patient) => (
                <option key={patient.patientId} value={patient.patientId}>
                  {patient.fullName} (ID: {patient.patientId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Choose Doctor</option>
              {doctors
                .filter((doctor) => doctor.availableStatus)
                .map((doctor) => (
                  <option key={doctor.doctorId} value={doctor.doctorId}>
                    {doctor.fullName} - {doctor.specialization}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              min={new Date().toISOString().split("T")[0]}
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Appointment Time</label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason for Visit</label>
            <textarea
              name="reasonForVisit"
              value={formData.reasonForVisit}
              onChange={handleChange}
              placeholder="Describe your health concern"
              rows="3"
            />
          </div>

          <button type="submit">
            {editingId ? "Update Appointment" : "Book Appointment"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel Editing
            </button>
          )}
        </form>
      </div>

      <div className="appointment-card">
        <h2>All Appointments</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="8">No appointments found.</td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.appointmentId}>
                    <td>{appointment.appointmentId}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.doctorName}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>{appointment.status}</td>
                    <td>{appointment.reasonForVisit}</td>
                    <td>
                      <button onClick={() => handleEdit(appointment)}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.appointmentId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Appointments;
