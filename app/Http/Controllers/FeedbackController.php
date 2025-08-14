<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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


// class FeedbackController extends Controller
// {
//     public function index()
//     {
//         if (!Auth::check()) {
//             abort(403);
//         }

//         $feedbacks = Feedback::with(['user', 'category', 'comments.user'])
//             ->orderBy('created_at', 'desc')
//             ->paginate(10)
//             ->through(function ($feedback) {
//                 return [
//                     'id' => $feedback->id,
//                     'title' => $feedback->title,
//                     'description' => $feedback->description,
//                     'created_at' => $feedback->created_at->format('Y-m-d H:i:s'),
//                     'user' => $feedback->user->only('id', 'name'),
//                     'category' => $feedback->category->only('id', 'name'),
//                     'comments_count' => $feedback->comments->count(),
//                 ];
//             });

//         return Inertia::render('Feedback/Index', [
//             'feedbacks' => $feedbacks,
//             'categories' => Category::all()->map->only('id', 'name')
//         ]);
//     }

//     public function store(Request $request)
//     {
//         $validator = Validator::make($request->all(), [
//             'title' => 'required|string|max:255',
//             'description' => 'required|string',
//             'category_id' => 'required|exists:categories,id',
//         ]);

//         if ($validator->fails()) {
//             return back()->withErrors($validator)->withInput();
//         }

//         $feedback = Feedback::create([
//             'title' => $request->title,
//             'description' => $request->description,
//             'category_id' => $request->category_id,
//             'user_id' => auth()->id(),
//         ]);

//         return redirect()->route('feedback.index')->with('success', 'Feedback submitted successfully!');
//     }

//     public function show(Feedback $feedback)
//     {
//         if (!Auth::check()) {
//             abort(403);
//         }

//         $feedback->load(['user', 'category', 'comments.user' => function ($query) {
//             $query->orderBy('created_at', 'desc');
//         }]);

//         return Inertia::render('Feedback/Show', [
//             'feedback' => [
//                 'id' => $feedback->id,
//                 'title' => $feedback->title,
//                 'description' => $feedback->description,
//                 'created_at' => $feedback->created_at->format('Y-m-d H:i:s'),
//                 'user' => $feedback->user->only('id', 'name'),
//                 'category' => $feedback->category->only('id', 'name'),
//                 'comments' => $feedback->comments->map(function ($comment) {
//                     return [
//                         'id' => $comment->id,
//                         'content' => $comment->content,
//                         'created_at' => $comment->created_at->format('Y-m-d H:i:s'),
//                         'user' => $comment->user->only('id', 'name'),
//                     ];
//                 }),
//             ],
//         ]);
//     }

//     public function destroy(Feedback $feedback)
// {
//     if (!Auth::check() || Auth::id() !== $feedback->user_id) {
//         abort(403);
//     }

//     $feedback->delete();

//     return redirect()->route('feedback.index')
//         ->with('success', 'Feedback deleted successfully!');
// }
// }