import { GetServerSideProps } from "next";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";

import ChatScreen, { MessageData } from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { ChatPageContainer } from "../../components/styled/ChatPageContainer";
import { ChatPageMessagesContainer } from "../../components/styled/ChatPageMessagesContainer";
import { auth, db } from "../../utils/firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

export type ChatProps = {
  chat: ChatData;
  messages: string;
};
interface ChatData {
  id: string;
  users: string[];
}

export default function ChatPage(props: ChatProps) {
  const [user] = useAuthState(auth);

  return (
    <ChatPageContainer>
      <Head>
        <title>
          Chat with {getRecipientEmail(props.chat.users, user.email)}
        </title>
      </Head>

      <Sidebar />

      <ChatPageMessagesContainer>
        <ChatScreen
          chat={props.chat}
          messages={JSON.parse(props.messages) as MessageData[]}
        />
      </ChatPageMessagesContainer>
    </ChatPageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ref = db
    .collection("chats")
    .doc(
      typeof context.query.id === "string"
        ? context.query.id
        : context.query.id[0]
    );

  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
      timestamp: data.timestamp.toDate().getTime(),
      id: doc.id,
    };
  });

  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    },
  };
};
