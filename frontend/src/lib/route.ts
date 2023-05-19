export enum Route {
    home = 'home',
    login = 'login',
    chat = 'chat',
    history = 'history',
}



export const routes: Record<Route, string>
    = {
    [Route.home]: '/',
    [Route.login]: '/login',
    [Route.chat]: '/chat',
    [Route.history]: '/history',
}
