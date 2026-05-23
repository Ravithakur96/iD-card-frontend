import { useState } from "react";
import { useEffect } from "react";
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

  
 useEffect(() => {
  return () => {
    if (preview) URL.revokeObjectURL(preview);
  };
}, []);
  // ✅ THIS MUST BE INSIDE COMPONENT
const getLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // simple fix: no backend call
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

//   if (!photo) {
//   alert("Please select photo");
//   return;
// }


  const handleSubmit = async (e) => {

    if (!photo) {
  alert("Please select photo");
  return;
}

  e.preventDefault();

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

    alert("Profile Saved Successfully");

    // RESET FORM

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

    alert("Error saving profile");

  } finally {

    setLoading(false);

  }
};

  


  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "30px"
    }}>

      <h1 style={{ textAlign: "center" }}>
        Person Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          display: "grid",
          gap: "15px"
        }}
      >

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          required
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="date"
          value={form.dob}
          required
          onChange={(e) =>
            setForm({ ...form, dob: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Department"
          value={form.department}
          required
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          required
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          required
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

    <br/>

        <input
  type="file"
  required
  onChange={(e) => {
    const file = e.target.files[0];
    setPhoto(file);
 

    // 👇 preview create
    setPreview(URL.createObjectURL(file));
  }}
/>
   <br/>
{preview && (
  <div style={{ marginTop: "10px" }}>
    <p>Image Preview:</p>
    <img
      src={preview}
      alt="preview"
      style={{
        width: "120px",
        height: "120px",
        objectFit: "cover",
        borderRadius: "10px",
        border: "2px solid white"
      }}
    />

    
  </div>
)}

<br/>


<div style={{  display: "grid",
          gap: "15px", maxWidth: "700px",
          margin: "30px auto",}} >

 <button
  type="button"
  onClick={getLocation}
  style={{
   
    padding: "10px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "8px"
  }}
>
  Get Live Location
</button>

<p style={{ marginTop: "5px", color: "#38bdf8" }}>
  {form.location && `Location: ${form.location}`}
</p>
          </div>

  

        <button
  type="submit"
  disabled={loading}
  style={{
    padding: "12px",
    background: loading ? "gray" : "#38bdf8",
    border: "none",
    color: "white",
    fontSize: "18px",
    borderRadius: "10px",
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
  );
}