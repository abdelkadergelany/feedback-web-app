<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            abort(403);
        }
        // Fetch feedbacks with related user, category, and comments
        $feedbacks = Feedback::with(['user', 'category', 'comments.user'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($feedbacks);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $feedback = Feedback::create([
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'user_id' => auth()->id(),
        ]);

        return response()->json($feedback->load('user', 'category'), 201);
    }

    public function show(Feedback $feedback)
    {
        if (!Auth::check()) {
            abort(403);
        }
        
        return response()->json($feedback->load('user', 'category', 'comments.user'));
    }
}