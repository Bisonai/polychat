import { IAccount, IAccountCreateDto, IChannel, IChannelCreateDTO, IMessage, IMessageCreateDto } from "@src/types";
import { BE_URL } from "./constants";

export const createAccount = async (account: IAccountCreateDto): Promise<IAccount> => {
    const response = await fetch(`${BE_URL}/api/account`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(account)
    })
    return await response.json()
}


export const createChannel = async (channel: IChannelCreateDTO): Promise<IChannel> => {
    const response = await fetch(`${BE_URL}/api/channel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(channel)
    })
    return await response.json()
}

export const createMessage = async (message: IMessageCreateDto): Promise<any> => {
    const response = await fetch(`${BE_URL}/api/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    return await response.json()
}


export const getChannels = async (): Promise<IChannel[]> => {
    const response = await fetch(`${BE_URL}/api/list`)
    return await response.json()
}

export const getMessages = async (channelId: string): Promise<IMessage[]> => {
    const response = await fetch(`${BE_URL}/api/channel/${channelId}`)
    return await response.json()
}