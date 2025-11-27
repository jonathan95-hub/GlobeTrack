// Importamos React y sus hooks
import React, { useEffect, useState, useRef } from 'react';

// Importamos funciones para obtener y enviar mensajes privados desde nuestros servicios
import { getMessagePrivate, sendMessagesPrivates } from '../../../core/services/ProfilePage/PrivateMessage';

// Importamos useSelector para obtener información del usuario desde Redux
import { useSelector } from 'react-redux';

// Importamos useNavigate para poder redirigir al usuario a otra página
import {useNavigate} from 'react-router-dom'

// Importamos socket.io-client para comunicación en tiempo real
import { io } from "socket.io-client";



// Creamos un socket global que se conectará a nuestro servidor de Node
const socket = io("http://localhost:3000");


// Componente principal de Mensajes Privados
const MessagePrivate = () => {

  // State para almacenar todas las conversaciones del usuario
  const [conversations, setConversations] = useState([]);

  // State para saber qué conversación está seleccionada
  const [selectedConversation, setSelectedConversation] = useState(null);

  // State para manejar el texto que el usuario escribe en el input
  const [messageText, setMessageText] = useState('');

  // Obtenemos el usuario logueado desde Redux
  const user = useSelector(state => state.loginReducer);

  // useRef para poder hacer scroll automático al final de los mensajes
  const messagesEndRef = useRef(null);

  // Hook para poder navegar entre páginas
  const navigate = useNavigate()


  // Función para obtener conversaciones del backend
  const getMessages = async () => {
    const info = await getMessagePrivate(); // Llamamos al servicio
    if (!info) return; // Si no hay información, salimos
    const conversationsArray = Object.values(info.conversations); // Convertimos a array
    setConversations(conversationsArray); // Guardamos en el state
  };


  // Función para eliminar un mensaje
  const deletedMessage = async(messageId) => {
    try {
       const message = await deleteMessagePrivate(messageId); // Llamamos al servicio de eliminación
       if(!message){
        console.log("No hay mensaje que eliminar");
       }
    } catch (error) {
      console.log(error.name);
    }
  }


  // Función para seleccionar una conversación
  const selectConversation = (conversation) => setSelectedConversation(conversation);

  // Función para volver a la lista de conversaciones
  const goBack = () => setSelectedConversation(null);

  // Función para hacer scroll al final de los mensajes
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });


  // Función para enviar mensaje
  const sendMessage = async () => {
    // Validación: no enviar mensaje vacío ni si no hay conversación seleccionada
    if (!messageText.trim() || !selectedConversation) return;

    // Receptor del mensaje
    const receptor = selectedConversation.user;

    try {
      // Llamamos al servicio para enviar mensaje
      const response = await sendMessagesPrivates(receptor._id, messageText);
      if (!response || !response.send) return;

      // Formateamos el mensaje para mostrarlo en la UI
      const messageToEmit = {
        ...response.send,
        sender: { _id: user.user._id, photoProfile: user.user.photoProfile },
        receiver: { _id: receptor._id, photoProfile: receptor.photoProfile }
      };

      // Emitimos el mensaje al socket para que llegue en tiempo real
      socket.emit("sendPrivateMessage", messageToEmit);

      // Actualizamos la conversación seleccionada agregando el nuevo mensaje
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, messageToEmit]
      }));

      // Limpiamos el input
      setMessageText('');

      // Hacemos scroll al final
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error.message);
      alert(error.message);
    }
  };


  // Función para volver al perfil
  const backToProfile = () => {
    navigate("/profile"); // Redirige al usuario a /profile
  }


  // useEffect: se ejecuta al cargar el componente
  useEffect(() => {
    getMessages(); // Obtenemos las conversaciones

    // Nos unimos a nuestra "sala" de usuario para recibir mensajes en tiempo real
    if (user?.user?._id) {
      socket.emit("joinUser", user.user._id);
    }
  }, [user?.user?._id]); // Se ejecuta cuando cambia el usuario


  // useEffect para escuchar mensajes entrantes por socket
  useEffect(() => {
    if (!user?.user?._id) return;

    // Función para manejar el mensaje entrante
    const handlePrivateMessage = (msg) => {
      // Formateamos el mensaje para asegurarnos que sender y receiver sean objetos
      const formattedMessage = {
        ...msg,
        sender: typeof msg.sender === "object" ? msg.sender : { _id: msg.sender, photoProfile: "" },
        receiver: typeof msg.receiver === "object" ? msg.receiver : { _id: msg.receiver, photoProfile: "" }
      };

      // Determinamos quién es el otro usuario en la conversación
      const otherUserId = formattedMessage.sender._id === user.user._id
        ? formattedMessage.receiver._id
        : formattedMessage.sender._id;

      // Actualizamos las conversaciones
      setConversations(prev => {
        const convExists = prev.some(c => c.user._id === otherUserId);
        if (convExists) {
          // Si la conversación ya existe, agregamos el mensaje
          return prev.map(c =>
            c.user._id === otherUserId
              ? { ...c, messages: [...c.messages, formattedMessage] }
              : c
          );
        } else {
          // Si no existe, creamos una nueva conversación
          const newConvUser = formattedMessage.sender._id === user.user._id
            ? formattedMessage.receiver
            : formattedMessage.sender;
          return [...prev, { user: newConvUser, messages: [formattedMessage] }];
        }
      });

      // Actualizamos la conversación seleccionada si corresponde
      setSelectedConversation(prev =>
        prev?.user._id === otherUserId
          ? { ...prev, messages: [...prev.messages, formattedMessage] }
          : prev
      );

      // Scroll al final
      scrollToBottom();
    };

    // Nos suscribimos al evento del socket
    socket.on("newPrivateMessage", handlePrivateMessage);

    // Cleanup: cuando el componente se desmonta, eliminamos el listener
    return () => {
      socket.off("newPrivateMessage", handlePrivateMessage);
    };
  }, [user?.user?._id]);


  // useEffect para hacer scroll automático cuando cambian los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);


  // Renderizado
  return (
    <div className="container my-5">

      {/* Botón para volver al perfil */}
      <div>
        <button className='btn btn-success' onClick={backToProfile}>
          Volver a perfil
        </button>
      </div>

      {/* Título */}
      <h3 className="fw-bold text-primary text-center mb-4">Mensajes Privados</h3>

      {/* Lista de conversaciones */}
      {!selectedConversation && (
        <div className="d-flex flex-column align-items-center gap-3">

          {/* Si no hay conversaciones */}
          {conversations.length === 0 ? (
            <p className="text-muted fw-semibold fs-5 mt-3">
              No hay conversaciones
            </p>
          ) : (
            // Si hay conversaciones, las mostramos
            conversations.map((conv, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center justify-content-between w-75 bg-white shadow-sm border rounded-4 p-3"
                style={{ cursor: 'pointer' }}
                onClick={() => selectConversation(conv)} // Al hacer click seleccionamos la conversación
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={conv.user.photoProfile}
                    alt=""
                    className="rounded-circle shadow-sm"
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                  <span className="fw-semibold text-dark fs-5">
                    {conv.user.name} {conv.user.lastName}
                  </span>
                </div>
              </div>
            ))
          )}

        </div>
      )}

      {/* Conversación seleccionada */}
      {selectedConversation && (
        <div className="container my-3">

          {/* Botón para volver a la lista de conversaciones */}
          <button className="btn btn-warning rounded-5 mb-3" onClick={goBack}> Volver</button>

          {/* Lista de mensajes */}
          <div className="mb-4 card p-3 shadow-sm rounded-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {selectedConversation.messages?.map((msg, i) => {
              // Saber si el mensaje es mío
              const isMine = msg.sender._id === user.user._id;
              const photo = isMine ? user.user.photoProfile : msg.sender.photoProfile;

              return (
                <div
                  key={i}
                  className={`d-flex mb-2 align-items-end ${isMine ? "justify-content-end" : "justify-content-start"}`}
                >
                  {!isMine && (
                    <img
                      src={photo}
                      alt="profile"
                      className="rounded-circle me-2"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                  )}

                  {/* Mensaje */}
                  <div
                    className={`p-2 rounded ${isMine ? "bg-primary text-white" : "bg-light text-dark"}`}
                    style={{ maxWidth: "60%", wordWrap: "break-word" }}
                  >
                    {msg.content}
                  </div>

                  {isMine && (
                    <img
                      src={photo}
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

          {/* Input para enviar mensaje */}
          <div className="d-flex mt-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Escribe un mensaje..."
              style={{ borderRadius: "20px" }}
              value={messageText} // Controlado por state
              onChange={(e) => setMessageText(e.target.value)} // Actualiza state
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // Enviar con Enter
            />
            <button className="btn btn-success rounded-5 px-4" onClick={sendMessage}>Enviar</button>
          </div>

        </div>
      )}
    </div>
  );
};

// Exportamos el componente para poder usarlo en otros archivos
export default MessagePrivate;
