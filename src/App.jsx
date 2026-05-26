import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {

  const [form, setForm] = useState({
    name: "",
    dob: "",
    department: "",
    phone: "",
    email: "",
    location: ""
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectMessage, setDetectMessage] = useState("");
const [isIdCardDetected, setIsIdCardDetected] = useState(false);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Get Live Location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setForm((prev) => ({
          ...prev,
          location: `Lat: ${lat}, Lon: ${lon}`
        }));
      },
      (error) => {
        console.log(error);
        alert("GPS permission denied");
      }
    );
  };

  // Submit Form
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!photo) {
      alert("Please select photo");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("dob", form.dob);
      formData.append("department", form.department);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("location", form.location);
      formData.append("photo", photo);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/persons`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);

const detected = Boolean(
  res?.data?.data?.idCard ??
  res?.data?.idCard
);

setIsIdCardDetected(detected);

if (!detected) {

  setDetectMessage(
    "⚠️ Please select a clear photo wearing your ID Card."
  );

  return;
}

setDetectMessage(
  "✅ ID Card detected successfully."
);

alert("Profile Saved Successfully");

// Reset Form
setForm({
  name: "",
  dob: "",
  department: "",
  phone: "",
  email: "",
  location: ""
});

setPhoto(null);
setPreview(null);

    } catch (error) {

  console.log(error);

  const backendMessage =
    error?.response?.data?.message;

  setDetectMessage(
    backendMessage ||
    "Unable to verify ID Card. Please upload a clear profile photo."
  );

  setIsIdCardDetected(false);

} finally {

      setLoading(false);

    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.heading}>
          Person Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >

          <input
            type="text"
            placeholder="Name"
            value={form.name}
            required
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="date"
            value={form.dob}
            required
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, dob: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Department"
            value={form.department}
            required
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            required
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            required
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* File Upload */}
          <div style={styles.fileBox}>

            <input
              type="file"
              required
              style={styles.fileInput}
              onChange={(e) => {

                const file = e.target.files[0];

                if (!file) return;

                setPhoto(file);

                if (preview) {
                  URL.revokeObjectURL(preview);
                }

                setPreview(URL.createObjectURL(file));
              }}
            />

          </div>

          {/* Preview */}
          {preview && (
            <div style={styles.previewContainer}>

              <p style={styles.previewText}>
                Image Preview
              </p>

              <img
                src={preview}
                alt="preview"
                style={styles.previewImage}
              />

            </div>
          )}

          {detectMessage && (
  <div
    style={{
      padding: "12px",
      borderRadius: "10px",
      background: isIdCardDetected
        ? "rgba(34,197,94,0.15)"
        : "rgba(239,68,68,0.15)",
      color: isIdCardDetected
        ? "#22c55e"
        : "#ef4444",
      textAlign: "center",
      fontWeight: "bold",
      border: `1px solid ${
        isIdCardDetected
          ? "#22c55e"
          : "#ef4444"
      }`
    }}
  >
    {detectMessage}
  </div>
)}

          {/* Location */}
          <button
            type="button"
            onClick={getLocation}
            style={styles.locationBtn}
          >
            Get Live Location
          </button>

          {form.location && (
            <p style={styles.locationText}>
              {form.location}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              background: loading ? "#64748b" : "#38bdf8",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {
              loading
                ? "Scanning Image & Uploading..."
                : "Save Profile"
            }
          </button>

        </form>

      </div>

    </div>
  );
}

// Styles
const styles = {

  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box"
  },

  card: {
    width: "100%",
    maxWidth: "700px",
    background: "#111827",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
    boxSizing: "border-box"
  },

  heading: {
    textAlign: "center",
    color: "white",
    marginBottom: "25px",
    fontSize: "clamp(24px, 5vw, 38px)"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "white",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box"
  },

  fileBox: {
    background: "#1e293b",
    padding: "12px",
    borderRadius: "10px",
    border: "1px dashed #38bdf8"
  },

  fileInput: {
    width: "100%",
    color: "white"
  },

  previewContainer: {
    textAlign: "center"
  },

  previewText: {
    color: "#cbd5e1",
    marginBottom: "10px"
  },

  previewImage: {
    width: "140px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "15px",
    border: "3px solid #38bdf8",
    maxWidth: "100%"
  },

  locationBtn: {
    width: "100%",
    padding: "14px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold"
  },

  locationText: {
    color: "#38bdf8",
    textAlign: "center",
    wordBreak: "break-word",
    fontSize: "14px"
  },

  submitBtn: {
    width: "100%",
    padding: "15px",
    border: "none",
    color: "white",
    fontSize: "18px",
    borderRadius: "12px",
    fontWeight: "bold",
    transition: "0.3s"
  }
};