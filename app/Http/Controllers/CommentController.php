<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function store(Request $request, Feedback $feedback)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $comment = $feedback->comments()->create([
            'content' => $request->content,
            'user_id' => auth()->id(),
        ]);

        return response()->json($comment->load('user'), 201);
    }
}

// class CommentController extends Controller
// {
//     public function store(Request $request, Feedback $feedback)
//     {
//         $validator = Validator::make($request->all(), [
//             'content' => 'required|string',
//         ]);

//         if ($validator->fails()) {
//             return back()
//                 ->withErrors($validator)
//                 ->withInput();
//         }

//         $comment = $feedback->comments()->create([
//             'content' => $request->content,
//             'user_id' => auth()->id(),
//         ]);

//         // Return to the feedback show page with a success message
//         return redirect()
//             ->route('feedback.show', $feedback->id)
//             ->with('success', 'Comment added successfully!');
//     }
// }