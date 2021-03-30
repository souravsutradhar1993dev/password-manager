<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use Redirect;

class UserActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->user()->is_active == 1) {
                Auth::guard($guard)->logout();
                return redirect()->route('login');
            }
        }

        return $next($request);
    }
}