import { Observable } from 'rxjs';

export abstract class  AuthenticationApi {
    logIn : (loginUser:any) => Observable<any>;
    logOut : () => Observable<any>;
    register : (registerUser:any) => Observable<any>;
    connectWithFacebook : () => Observable<any>;
    connectWithGoogle : () => Observable<any>;
    changePassoword : () => Observable<any>;
    forgotPassowrd : () => Observable<any>;
}
