import { Link } from "@material-ui/core";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import { auth, db } from "../utils/firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { ChatContainer } from "./styled/ChatContainer";
import { ChatUserAvatar } from "./styled/ChatUserAvatar";

type Props = {
  id: string;
  users: string[];
};

export default function Chat(props: Props) {
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(props.users, user.email);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail)
  );
  const recipient = recipientSnapshot.docs[0]?.data();

  return (
    <ChatContainer>
      <Link href={`/chat/${props.id}`}>
        {recipient ? (
          <ChatUserAvatar src={recipient.photoURL} />
        ) : (
          <ChatUserAvatar>{recipientEmail[0] || "?"}</ChatUserAvatar>
        )}

        <p>{recipientEmail}</p>
      </Link>
    </ChatContainer>
  );
}
