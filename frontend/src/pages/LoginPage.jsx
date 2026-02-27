import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loginError, setLoginError] = useState(null);

    const formik = useFormik({
        initialValues: {
            emailOrPhone: '',
            password: '',
            rememberMe: false
        },
        validationSchema: Yup.object({
            emailOrPhone: Yup.string()
                .required('Email or Phone is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setLoginError(null);
                const res = await api.post('/auth/login', values);

                if (res.data.success) {
                    const { user, accessToken, refreshToken } = res.data;
                    login(user, accessToken, refreshToken);

                    // Route based on role
                    if (user.role === 'admin') navigate('/admin/dashboard');
                    else if (user.role === 'owner') navigate('/owner/dashboard');
                    else navigate('/student/dashboard');
                }
            } catch (err) {
                setLoginError(err.response?.data?.message || 'Server login failed');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleGoogleLogin = () => {
        // Redirect to backend passport auth
        window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="text-center pb-2">
                    <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-2">Welcome Back</h2>
                    <p className="text-text-secondary text-sm">Please enter your credentials to connect.</p>
                </CardHeader>

                <CardBody>
                    {loginError && (
                        <div className="mb-4 bg-red-50 p-3 rounded-lg flex items-start gap-3 border border-red-100">
                            <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{loginError}</p>
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4 relative">
                            <Input
                                id="emailOrPhone"
                                label="Email or Phone Number"
                                placeholder="john@example.com / 9876543210"
                                {...formik.getFieldProps('emailOrPhone')}
                                error={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
                                className="pl-10" // Space for icon if we added one internally or wrapper
                            />
                            {/* Simple absolute positioning hack for quick styling without touching Input component */}
                            <Mail className="absolute left-3 top-9 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>

                        <div className="mb-4 relative">
                            <Input
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                {...formik.getFieldProps('password')}
                                error={formik.touched.password && formik.errors.password}
                                className="pl-10"
                            />
                            <Lock className="absolute left-3 top-9 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    {...formik.getFieldProps('rememberMe')}
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-text-secondary">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mb-4"
                            isLoading={formik.isSubmitting}
                        >
                            Sign In
                        </Button>

                        {/* Social Auth per PRD */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={handleGoogleLogin}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </Button>

                    </form>
                </CardBody>

                <div className="bg-gray-50 py-4 px-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
                            Sign up now
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
