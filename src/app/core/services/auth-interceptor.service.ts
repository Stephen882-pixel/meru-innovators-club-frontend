import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authServie = inject(AuthService);
    const token = authServie.getToken();

    if(token) {
        const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(cloned);
    }
    return next(req)
};
