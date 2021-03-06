import React from "react";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import VerticalThreeDotsIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";

import { Container } from "./styled/Container";
import { Header } from "./styled/Header";
import { UserAvatar } from "./styled/UserAvatar";
import { IconsContainer } from "./styled/IconsContainer";
import { Search } from "./styled/Search";
import { SearchInput } from "./styled/SearchInput";
import { SidebarButton } from "./styled/SidebarButton";
import { auth, db } from "../utils/firebase";
import Chat from "./Chat";
import { useRouter } from "next/dist/client/router";

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const chatAlreadyExists = (email: string) => {
    return !!chatsSnapshot?.docs.some((chat) =>
      chat.data().users.find((u) => u === email)
    );
  };

  const createChat = async () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );
    if (!input || input === user.email) return;

    if (!EmailValidator.validate(input) || chatAlreadyExists(input)) return;

    const doc = await db.collection("chats").add({
      users: [user.email, input],
    });

    console.log(router);
    router.push(
      `${router.pathname.startsWith("/chat") ? "" : "/chat/"}${doc.id}`
    );
  };

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <VerticalThreeDotsIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {chatsSnapshot?.docs.map((chat) => {
        return <Chat key={chat.id} id={chat.id} users={chat.data().users} />;
      })}
    </Container>
  );
}
