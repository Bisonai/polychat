export enum Route {
    home = 'home',
    login = 'login',
    channel = 'channel',
    history = 'history',
}



export const routes: Record<Route, string>
    = {
    [Route.home]: '/',
    [Route.login]: '/login',
    [Route.channel]: '/channel',
    [Route.history]: '/history',
}
