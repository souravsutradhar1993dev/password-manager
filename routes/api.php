<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/auth_user', function (Request $request) {
    $user_details = [];
    $user = $request->user();
    $user_details['name'] = ucwords($user->name);
    $user_details['email'] = $user->email;
    $user_details['role'] = $user->role;

    return $user_details;
});
Route::middleware('auth:api')->get('/auth/check', function (Request $request) {
    return ['is_auth' => Auth::check()];
});
Route::middleware('auth:api')->resource('/user', App\Http\Controllers\Api\UserController::class);
Route::middleware('auth:api')->resource('/category', App\Http\Controllers\Api\CategoryController::class);
Route::middleware('auth:api')->resource('/password', App\Http\Controllers\Api\PasswordController::class);
Route::middleware('auth:api')->post('/profile/update', [App\Http\Controllers\Api\UserController::class, 'update_profile'])->name('profile_update');
Route::middleware('auth:api')->get('/share', [App\Http\Controllers\Api\CategoryController::class, 'get_shared'])->name('get_shared');
Route::middleware('auth:api')->post('/share_category/update/{id}', [App\Http\Controllers\Api\CategoryController::class, 'update_shared_category'])->name('update_shared_category');
Route::middleware('auth:api')->post('/share_password/update/{id}', [App\Http\Controllers\Api\CategoryController::class, 'update_shared_password'])->name('update_shared_password');
Route::middleware('auth:api')->get('/share_category/{id}', [App\Http\Controllers\Api\CategoryController::class, 'show_shared_category'])->name('show_shared_category');
Route::middleware('auth:api')->get('/share_password/{id}', [App\Http\Controllers\Api\CategoryController::class, 'show_shared_password'])->name('show_shared_password');
Route::middleware('auth:api')->get('/all_category', [App\Http\Controllers\Api\CategoryController::class, 'get_all_category'])->name('get_all_category');
Route::middleware('auth:api')->get('/recent_category', [App\Http\Controllers\Api\CategoryController::class, 'get_recent'])->name('get_recent_category');
Route::middleware('auth:api')->post('/password/upload_csv', [App\Http\Controllers\Api\PasswordController::class, 'upload_csv'])->name('upload_csv');
Route::middleware('auth:api')->post('/password/export_csv', [App\Http\Controllers\Api\PasswordController::class, 'export_csv'])->name('export_csv');

