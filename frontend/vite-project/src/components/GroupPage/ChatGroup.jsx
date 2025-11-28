// Importamos useEffect, useState y useRef desde react
import React, { useEffect, useState, useRef } from "react";
// Importamos las funciones que hacen la llamadas la backend para obtener los mensajes y la que los envia
import { getMessageGroup, sendMessageGroup } from "../../core/services/GroupPage/messagesGroup";
// Hooks de React Router para coger el ID del grupo y navegar
import { useNavigate, useParams } from "react-router-dom";
// Importamos useSelector para obtener el usuario logueado desde Redux
import { useSelector } from "react-redux";
// Socket.io para tiempo real
import { io } from "socket.io-client";

// Creamos un socket global que se conecta al backend
const socket = io("http://localhost:3000");

const ChatGroup = () => {
  const { groupId } = useParams(); // Obtenemos el id del grupo desde la url 
  const navigate = useNavigate();
  const user = useSelector(state => state.loginReducer); // usuario actual
  //Estado donde guardamos los mensajes
  const [messages, setMessages] = useState([]);
  //Estado del input donde se escribe el mensaje
  const [messageText, setMessageText] = useState('');
    // Referencia para hacer scroll automático al último mensaje
  const messagesEndRef = useRef(null);
    // Función que hace scroll hacia abajo
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Cargar mensajes iniciales
  const loadMessages = async () => {
    try {
      const data = await getMessageGroup(groupId);
      setMessages(data.messages || []);
      scrollToBottom();
    } catch (err) {
      console.error(err);
      alert("Error cargando mensajes");
    }
  };


  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await sendMessageGroup(groupId, { content: messageText });
      setMessageText('');
      // no agregamos el mensaje localmente, llega desde socket
    } catch (err) {
      console.error(err);
      alert("Error enviando mensaje");
    }
  };

  // Inicializamos socket
  useEffect(() => {
    if (!user?.user?._id || !groupId) return;

    socket.emit("joinGroup", groupId);

    const handleReceiveMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
      scrollToBottom();
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [groupId, user?.user?._id]);
  
  const goToGroups = () => {
    navigate("/group")
  }
 // Cargamos los mensajes cada vez que entramos en esta pagina
  useEffect(() => {
    loadMessages();
  }, [groupId]);

  return (
    <div className="container my-5">
      <h3 className="text-center text-primary fst-italic fw-bold mb-4">Chat del Grupo</h3>
      <div className="ms-2 mb-3" >
        <button className="btn btn-warning rounded-3 text-light fst-italic fw-bolder" onClick={goToGroups}>
          Salir
        </button>
      </div>
      <div className="card p-3 shadow-sm rounded-4 mb-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {messages.length === 0 && <div className="text-center text-muted py-5">No hay mensajes en este grupo.</div>}
   {messages.map((msg, idx) => {
  const isMine = msg.sender._id === user.user._id;
  const senderPhoto = msg.sender.photoProfile || "";
  const senderName = `${msg.sender.name} ${msg.sender.lastName}`; // Nombre completo del remitente

  return (
    <div
      key={idx}
      className={`d-flex mb-2 align-items-end ${isMine ? "justify-content-end" : "justify-content-start"}`}
    >
      {/* Avatar izquierdo solo si es mensaje de otro */}
      {!isMine && (
        <img
          src={senderPhoto}
          alt="profile"
          className="rounded-circle me-2"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
      )}

      <div style={{ maxWidth: "60%" }}>
        {/* Nombre del remitente */}
        {!isMine && (
          <div className="text-primary fw-bolder mb-1">{senderName}</div>
        )}

        {/* Mensaje */}
        <div
          className={`p-2 rounded ${isMine ? "bg-primary text-white" : "bg-light text-dark"}`}
          style={{ wordWrap: "break-word" }}
        >
          {msg.content}
        </div>
      </div>

      {/* Avatar derecho solo si es tu mensaje */}
      {isMine && (
        <img
          src={senderPhoto}
          alt="profile"
          className="rounded-circle ms-2"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
      )}
    </div>
  );
})}
        <div ref={messagesEndRef} />
      </div>
      <div className="d-flex mt-3">
        <input type="text" className="form-control me-2" placeholder="Escribe un mensaje..." style={{ borderRadius: "20px" }} value={messageText} onChange={e => setMessageText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
        <button className="btn btn-success rounded-5 px-4" onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatGroup;
