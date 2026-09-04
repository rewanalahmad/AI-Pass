<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Support\AuthRedirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class LoginController extends Controller
{
    public function show(Request $request): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->to(AuthRedirect::resolve($request->query('callback')));
        }

        return view('auth.login', [
            'callback' => $request->query('callback', '/workspace'),
        ]);
    }

    public function login(Request $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->boolean('remember');
        $callback = AuthRedirect::resolve($request->input('callback'));

        if (! Auth::attempt($credentials, $remember)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Invalid email or password.',
                    'errors' => ['email' => ['Invalid email or password.']],
                ], 401);
            }

            return back()
                ->withInput($request->only('email', 'remember'))
                ->withErrors(['email' => 'Invalid email or password.']);
        }

        $user = Auth::user();
        if ($user !== null && ! $user->hasPassword()) {
            Auth::logout();

            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'This account uses Google sign-in. Continue with Google instead.',
                    'errors' => ['email' => ['This account uses Google sign-in. Continue with Google instead.']],
                ], 400);
            }

            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'This account uses Google sign-in. Continue with Google instead.']);
        }

        $request->session()->regenerate();
        $user?->touchLastLogin();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'redirect' => $callback,
                'user' => [
                    'id' => $user?->id,
                    'name' => $user?->name,
                    'email' => $user?->email,
                    'avatarUrl' => $user?->avatar_url,
                ],
            ]);
        }

        return redirect()->to($callback);
    }
}
