import { ReactElement } from "react";
import { useRouter } from "next/router";
import { MessageListTemplate } from "@src/templates/MessageTemplate";

const ChannelPage = (params: any): ReactElement => {
    const router = useRouter();
    const channelId = router.query.channelId as string;

    return <MessageListTemplate />;
};

export default ChannelPage;
