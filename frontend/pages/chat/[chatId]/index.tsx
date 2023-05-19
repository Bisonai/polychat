import { ChatRoomTemplate } from "@src/templates/ChatRoomTemplate";
import { ReactElement } from "react";
import { useRouter } from "next/router";

const ChatRoomPage = (params: any): ReactElement => {
    const router = useRouter();
    const chatId = router.query.chatId as string;

    return <ChatRoomTemplate />;
};

export default ChatRoomPage;
