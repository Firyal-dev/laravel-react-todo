<?php

use App\Http\Controllers\TodoController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// auth
Route::post('/register', [AuthController::class, 'registerFunction']);
Route::post('/login', [AuthController::class, 'loginFunction']);


// todo
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/token-user', [AuthController::class, 'token-user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('/todo', TodoController::class);
});