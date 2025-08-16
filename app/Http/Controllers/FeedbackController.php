<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function index(Request $request)
{
    if (!Auth::check()) {
        abort(403);
    }

    $query = Feedback::with(['user', 'category', 'comments.user'])
        ->orderBy('created_at', 'desc');

    // Search filter
    if ($request->has('search') && $request->search != '') {
        $query->where(function($q) use ($request) {
            $q->where('title', 'like', '%' . $request->search . '%')
              ->orWhere('description', 'like', '%' . $request->search . '%');
        });
    }

    // Category filter
    if ($request->has('category') && $request->category != '') {
        $query->where('category_id', $request->category);
    }

    return response()->json($query->paginate(10));
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

