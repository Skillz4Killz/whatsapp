import TimeAgo from "timeago-react";
import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, InsertEmoticon, MicOutlined } from "@material-ui/icons";
import MoreVert from "@material-ui/icons/MoreVert";
import { useRouter } from "next/dist/client/router";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";

import { ChatProps } from "../pages/chat/[id]";
import { auth, db } from "../utils/firebase";
import Message from "./Message";
import { ChatScreenContainer } from "./styled/ChatScreenContainer";
import { ChatScreenHeader } from "./styled/ChatScreenHeader";
import { ChatScreenHeaderInformation } from "./styled/ChatScreenHeaderInformation";
import { Input } from "./styled/Input";
import { InputContainer } from "./styled/InputContainer";
import { MessageContainer } from "./styled/MessageContainer";
import getRecipientEmail from "../utils/getRecipientEmail";
import { EndOfMessage } from "./styled/EndOfMessage";

export interface MessageData {
  id: string;
  timestamp: number;
  user: string;
  message: string;
}

export default function ChatScreen(
  props: Omit<ChatProps, "messages"> & { messages: MessageData[] }
) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);

  const router = useRouter();
  const id =
    typeof router.query.id === "string" ? router.query.id : router.query.id[0];
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const recipientEmail = getRecipientEmail(props.chat.users, user.email);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail)
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((msg) => {
        const data = msg.data();

        return (
          <Message
            key={msg.id}
            user={data.user}
            message={{
              ...data,
              message: data.message,
              timestamp: data.timestamp?.toDate().getTime(),
            }}
          />
        );
      });
    }

    return props.messages.map((message) => (
      <Message key={message.id} user={message.user} message={message} />
    ));
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  return (
    <ChatScreenContainer>
      <ChatScreenHeader>
        {recipient ? (
          <Avatar src={recipient.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0] || "?"}</Avatar>
        )}
        <ChatScreenHeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last Active:{" "}
              {recipient.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient.lastSeen.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Last Seen: Loading...</p>
          )}
        </ChatScreenHeaderInformation>

        <div>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </ChatScreenHeader>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicOutlined />
      </InputContainer>
    </ChatScreenContainer>
  );
}
