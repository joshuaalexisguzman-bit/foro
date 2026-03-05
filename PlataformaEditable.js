import React, { useState, useEffect } from "react";
import "./PlataformaEditable.css";

function PlataformaEditable({ profile, onLogout }) {
  const [seccion, setSeccion] = useState("inicio");
  const [editando, setEditando] = useState(false);

  const [nombre, setNombre] = useState("Nombre del Usuario");
  const [correo, setCorreo] = useState("usuario@email.com");
  const [rol, setRol] = useState("Estudiante");

  const [foto, setFoto] = useState("https://via.placeholder.com/120");
  const [fondo, setFondo] = useState("");

  useEffect(() => {
    if (profile) {
      setNombre(profile.name || profile.username || "Nombre del Usuario");
      setCorreo(profile.email || "");
      setRol(
        profile.role === "alumno" ? "Estudiante" : profile.role || ""
      );
    }
  }, [profile]);

  const cambiarFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cambiarFondo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFondo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${fondo})` }} className="app-container">
      <nav>
        <h1>Mi aplicación</h1>
        <div className="nav-links">
          <button type="button" className="nav-link" onClick={() => setSeccion("inicio")}>Inicio</button>
          <button type="button" className="nav-link">Preguntas y respuestas</button>
          <button type="button" className="nav-link">Tus chats</button>
          <button type="button" className="nav-link" onClick={() => setSeccion("perfil")}>Perfil</button>
        </div>
        <button className="boton" onClick={onLogout}>
          Salir
        </button>
      </nav>

      {seccion === "inicio" && (
        <section>
          <h1>¡Bienvenido!</h1>
          <p>Puedes cambiar el fondo desde tu perfil 😎</p>
        </section>
      )}

      {seccion === "perfil" && (
        <section>
          <h2>Mi Perfil</h2>

          <div className="tarjeta-perfil">
            <img src={foto} alt="Foto de perfil" />

            {!editando ? (
              <div>
                <h3>{nombre}</h3>
                <p>
                  <strong>Correo:</strong> {correo}
                </p>
                <p>
                  <strong>Rol:</strong> {rol}
                </p>

                <button className="boton" onClick={() => setEditando(true)}>
                  Editar Perfil
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                />

                <input type="file" accept="image/*" onChange={cambiarFoto} />

                <br />
                <br />

                <label>
                  <strong>Cambiar fondo:</strong>
                </label>
                <br />
                <input type="file" accept="image/*" onChange={cambiarFondo} />

                <br />
                <br />

                <button className="boton" onClick={() => setEditando(false)}>
                  Guardar
                </button>

                <button className="boton" onClick={() => setEditando(false)}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default PlataformaEditable;
