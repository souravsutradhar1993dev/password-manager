<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $type = isset($_GET['type']) && !empty($_GET['type']) ? $_GET['type'] : 'form';
        $search = isset($_GET['s']) && !empty($_GET['s']) ? $_GET['s'] : '';
        if($type == 'form') {
            $users = User::where([['id', '!=', Auth::user()->id], ['is_active', 1]])->whereNotIn('role', ['admin','super-admin'])->get()->toArray();
        }else {
            if(!empty($search)) {
                $users = User::where([['id', '!=', Auth::user()->id], ['is_active', 1], ['name', 'like', "%$search%"]])->get()->toArray();
            }else {
                $users = User::where([['id', '!=', Auth::user()->id], ['is_active', 1]])->get()->toArray();
            }
            
        }
        
        foreach($users as $key => $user) {
            $users[$key]['name'] = ucwords($user['name']);
            $users[$key]['role_title'] = ucwords(str_replace('-', ' ', $user['role']));
        }
        return $users; 
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users'],
                'role' => ['required', 'string', 'max:255'],
                'password' => ['required', 'string', 'max:255'],
            ]);
            if ($validator->fails()) { 
                $validation_messages = [];
                $errors = $validator->errors();
                $error_message = '';
                foreach($errors->all() as $error) {
                    $error_message .= '<p>'.$error.'</p>';
                }
                $validation_messages = ['success' => false, 'message' => $error_message];
                return response()->json($validation_messages);
            }
    
            $data = $request->all();
    
            $allow_email_domains = ['b3net.org', 'b3net.com'];
    
            $email_arr = explode('@', $data['email']);
            if(isset($email_arr[1])) {
                if(!in_array($email_arr[1], $allow_email_domains)) {
                    $validation_messages = ['success' => false, 'message' => 'b3net.com and b3net.org are allowed'];
                    return response()->json($validation_messages);
                }
            }else {
                $validation_messages = ['success' => false, 'message' => 'Email domain is invalid'];
                return response()->json($validation_messages);
            }
    
            $user = User::create([
                        'name' => trim($data['name']),
                        'email' => trim($data['email']),
                        'role' => trim($data['role']),
                        'is_active' => 1,
                        'password' => Hash::make($data['password']),
                    ])->toArray();
            if($user) {
                return response()
                ->json(['success'=> true, 'message' => 'User created successfully']);
            }else {
                return response()
                ->json(['success'=> false, 'message' => 'Some error occurs.Please try again.']);
            }
        }else {
            return response()
                ->json(['success'=> false, 'message' => 'You do not have permission']);
        }        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $user = User::find($id);

            return response()
                ->json(['success'=> true, 'data' => $user]); 
        }else {
            return response()
                ->json(['success'=> false, 'message' => 'You do not have permission']);
        }        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255'],
                'role' => ['required', 'string', 'max:255'],
            ]);
            if ($validator->fails()) { 
                $validation_messages = [];
                $errors = $validator->errors();
                $error_message = '';
                foreach($errors->all() as $error) {
                    $error_message .= '<p>'.$error.'</p>';
                }
                $validation_messages = ['success' => false, 'message' => $error_message];
                return response()->json($validation_messages);
            }

            $data = $request->all();

            $allow_email_domains = ['b3net.org', 'b3net.com'];

            $email_arr = explode('@', $data['email']);
            if(isset($email_arr[1])) {
                if(!in_array($email_arr[1], $allow_email_domains)) {
                    $validation_messages = ['success' => false, 'message' => 'b3net.com and b3net.org are allowed'];
                    return response()->json($validation_messages);
                }
            }else {
                $validation_messages = ['success' => false, 'message' => 'Email domain is invalid'];
                return response()->json($validation_messages);
            }

            $check_users = User::where([['email', $data['email']], ['id', '!=', $id]])->get()->toArray();
            if(count($check_users)) {
                $validation_messages = ['success' => false, 'message' => 'Email exists in our system.'];
                return response()->json($validation_messages);
            }

            $user = User::find($id);
            $user->name = trim($data['name']);
            $user->email = trim($data['email']);
            $user->role = trim($data['role']);
            if(!empty($data['password'])) {
                $user->password = Hash::make($data['password']);
            }
            
            $is_user_updated = $user->save();

            if($is_user_updated) {
                return response()
                ->json(['success'=> true, 'message' => 'User updated successfully']);
            }else {
                return response()
                ->json(['success'=> false, 'message' => 'Some error occurs.Please try again.']);
            }
        }else {
            return response()
                ->json(['success'=> false, 'message' => 'You do not have permission']);
        } 
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $user = User::find($id);
            $user->is_active = 0;
            
            $is_user_updated = $user->save();

            if($is_user_updated) {
                return response()
                ->json(['success'=> true, 'message' => 'User removed successfully']);
            }else {
                return response()
                ->json(['success'=> false, 'message' => 'Some error occurs.Please try again.']);
            }
        }else {
            return response()
                ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
    }

    public function update_profile(Request $request) {
        $id = Auth::user()->id;

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
        ]);
        if ($validator->fails()) { 
            $validation_messages = [];
            $errors = $validator->errors();
            $error_message = '';
            foreach($errors->all() as $error) {
                $error_message .= '<p>'.$error.'</p>';
            }
            $validation_messages = ['success' => false, 'message' => $error_message];
            return response()->json($validation_messages);
        }

        $data = $request->all();

        $allow_email_domains = ['b3net.org', 'b3net.com'];

        $email_arr = explode('@', $data['email']);
        if(isset($email_arr[1])) {
            if(!in_array($email_arr[1], $allow_email_domains)) {
                $validation_messages = ['success' => false, 'message' => 'b3net.com and b3net.org are allowed'];
                return response()->json($validation_messages);
            }
        }else {
            $validation_messages = ['success' => false, 'message' => 'Email domain is invalid'];
            return response()->json($validation_messages);
        }

        $check_users = User::where([['email', $data['email']], ['id', '!=', $id]])->get()->toArray();
        if(count($check_users)) {
            $validation_messages = ['success' => false, 'message' => 'Email exists in our system.'];
            return response()->json($validation_messages);
        }

        $user = User::find($id);
        $user->name = trim($data['name']);
        $user->email = trim($data['email']);
        if(!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        
        $is_user_updated = $user->save();

        if($is_user_updated) {
            return response()
            ->json(['success'=> true, 'message' => 'Profile updated successfully']);
        }else {
            return response()
            ->json(['success'=> false, 'message' => 'Some error occurs.Please try again.']);
        }
    }
}
