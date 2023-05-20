export enum Route {
    landing = 'landing',
    home = 'home',
    channel = 'channel',
    history = 'history',
}



export const routes: Record<Route, string>
    = {
    [Route.home]: '/',
    [Route.landing]: '/landing',
    [Route.channel]: '/channel',
    [Route.history]: '/history',
}
