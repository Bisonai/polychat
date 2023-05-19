import { ReactElement } from "react";
import { useRouter } from "next/router";
import { ChannelTemplate } from "@src/templates/ChannelTemplate";

const ChannelPage = (params: any): ReactElement => {
    const router = useRouter();
    const channelId = router.query.channelId as string;

    return <ChannelTemplate channelId={channelId} />;
};

export default ChannelPage;
