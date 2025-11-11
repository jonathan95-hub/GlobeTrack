import React, { useEffect, useState, useRef } from 'react';
import { getMessagePrivate, sendMessagesPrivates } from '../../../core/services/ProfilePage/PrivateMessage';
import { useSelector } from 'react-redux';

const MessagePrivate = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const user = useSelector(state => state.loginReducer);
  const messagesEndRef = useRef(null);

  const getMessages = async () => {
    const info = await getMessagePrivate();
    if (!info) return;
    const conversationsArray = Object.values(info.conversations);
    setConversations(conversationsArray);
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const goBack = () => {
    setSelectedConversation(null);
  };

const sendMessage = async () => {
  if (!messageText.trim() || !selectedConversation) return;

  const receptorId = selectedConversation.user._id;

  try {
    const message = await sendMessagesPrivates(receptorId, messageText);

    if (message) {
      const updatedMessages = [
        ...selectedConversation.messages,
        {
          content: messageText,
          sender: { _id: user.user._id, photoProfile: user.user.photoProfile },
          receiver: { _id: receptorId }
        }
      ];
      setSelectedConversation({ ...selectedConversation, messages: updatedMessages });
      setMessageText('');
      scrollToBottom();
    }
  } catch (error) {
    console.error("Error sending message:", error.message);
    alert(error.message);
  }
};


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  return (
    <div className="container my-5">
      <h3 className="fw-bold text-primary text-center mb-4">Mensajes Privados</h3>

      {/* Lista de conversaciones */}
      {!selectedConversation && (
        <div className="d-flex flex-column align-items-center gap-3">
          {conversations.map((conv, idx) => (
            <div
              key={idx}
              className="d-flex align-items-center justify-content-between w-75 bg-white shadow-sm border rounded-4 p-3"
              style={{ cursor: 'pointer' }}
              onClick={() => selectConversation(conv)}
            >
              <div className="d-flex align-items-center gap-3">
                <img
                  src={conv.user.photoProfile}
                  alt=""
                  className="rounded-circle shadow-sm"
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
                <span className="fw-semibold text-dark fs-5">{conv.user.name} {conv.user.lastName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conversación seleccionada */}
      {selectedConversation && (
        <div className="container my-3">
          <button className="btn btn-warning rounded-5 mb-3" onClick={goBack}> Volver</button>

          <div className="mb-4 card p-3 shadow-sm rounded-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {selectedConversation.messages?.map((msg, i) => {
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

          {/* Input */}
          <div className="d-flex mt-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Escribe un mensaje..."
              style={{ borderRadius: "20px" }}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="btn btn-success rounded-5 px-4" onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePrivate;
