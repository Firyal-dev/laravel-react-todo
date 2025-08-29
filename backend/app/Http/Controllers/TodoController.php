<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $todos = Todo::where('user_id', auth()->id())
                ->orderBy('date', 'asc')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($todos, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch todos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'desc' => 'nullable|string|max:1000',
                'date' => 'required|date|after_or_equal:today',
            ]);

            $todo = Todo::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'desc' => $validated['desc'],
                'date' => $validated['date'],
            ]);

            return response()->json($todo, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create todo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $todo = Todo::where('id', $id)
                ->where('user_id', auth()->id())
                ->firstOrFail();

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'desc' => 'nullable|string|max:1000',
                'date' => 'required|date',
            ]);

            $todo->update($validated);

            return response()->json($todo, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update todo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $todo = Todo::where('id', $id)
                ->where('user_id', auth()->id())
                ->firstOrFail();

            $todo->delete();

            return response()->json([
                'message' => 'Todo deleted successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete todo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
