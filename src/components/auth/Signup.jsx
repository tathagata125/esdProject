import React from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useState } from 'react'
import { USER_API_END_POINT } from '../../utils/constant'
import axios from 'axios'
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'
import store from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
       
    })
    const {loading} = useSelector(store=>store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    
    const submitHandler = async (e) => {
        e.preventDefault()
        
       
    console.log(input.role);
      if(input.role==='admin'){
        const inp = {
            adminEmail:input.email,
            password:input.password,
            adminName:input.fullname,
            phone:input.phoneNumber
        }
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`http://localhost:8080/auth/registerAdmin`, inp)
            if (res.data) {
                navigate("/login")
                toast.success(res.data)
            }
        } catch (error) {
            console.log(error.response?.data);
        }finally{
            dispatch(setLoading(false))
        }}

    }


    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign-Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Lavish"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="lavish@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone number</Label>
                        <Input
                            type="number"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="99999999"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <RadioGroup className='flex items-center gap-4 my-2'>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type='radio'
                                    name='role'
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    value='student'
                                    className='cursor-pointer'
                                />
                                <Label htmlFor="option-one">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type='radio'
                                    name='role'
                                    checked={input.role === 'admin'}
                                    onChange={changeEventHandler}
                                    value='admin'
                                    className='cursor-pointer'
                                />
                                <Label htmlFor="option-two">Admin</Label>
                            </div>
                        </RadioGroup>

                     
                    </div>
                    {
                        loading? <Button><Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please wait</Button> :
                        <Button type='submit' className='w-full my-4'>Sign-up</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link className='text-blue-600' to='/login'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup