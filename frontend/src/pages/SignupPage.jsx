import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, User, Building2 } from 'lucide-react';

const SignupPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState(1);
    const [signupError, setSignupError] = useState(null);
    const [isOtpSent, setIsOtpSent] = useState(false);

    // Form State mapped to API logic steps
    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            role: '', // 'student' or 'owner'
            otp: ''
        },
        validationSchema: Yup.object({
            fullName: Yup.string().when('$step', {
                is: 1,
                then: (schema) => schema.required('Full Name is required'),
            }),
            email: Yup.string().when('$step', {
                is: 1,
                then: (schema) => schema.email('Invalid email').required('Email is required'),
            }),
            phone: Yup.string().when('$step', {
                is: 1,
                then: (schema) => schema.matches(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian phone number').required('Phone is required'),
            }),
            password: Yup.string().when('$step', {
                is: 1,
                then: (schema) => schema.min(8, 'Minimum 8 characters').required('Password is required'),
            }),
            role: Yup.string().when('$step', {
                is: 2,
                then: (schema) => schema.required('Please select a role'),
            }),
            otp: Yup.string().when('$step', {
                is: 3,
                then: (schema) => schema.length(6, 'OTP must be 6 digits').required('OTP is required'),
            })
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSignupError(null);

            try {
                if (step === 1) {
                    // Pre-verify unique email/phone early via Step 1 API
                    const res = await api.post('/auth/signup/step1', {
                        fullName: values.fullName,
                        email: values.email,
                        phone: values.phone,
                        password: values.password
                    });
                    if (res.data.success) setStep(2);
                }
                else if (step === 2) {
                    const res = await api.post('/auth/signup/step2', { role: values.role });
                    if (res.data.success) {
                        // Request OTP Generation immediately on progressing
                        await api.post('/auth/send-otp', { email: values.email, userName: values.fullName });
                        setIsOtpSent(true);
                        setStep(3);
                    }
                }
                else if (step === 3) {
                    // Final submission
                    const res = await api.post('/auth/verify-otp', {
                        email: values.email,
                        otp: values.otp,
                        fullName: values.fullName,
                        phone: values.phone,
                        password: values.password,
                        role: values.role
                    });

                    if (res.data.success) {
                        login(res.data.user, res.data.accessToken, res.data.refreshToken);
                        if (res.data.user.role === 'owner') {
                            navigate('/owner/dashboard');
                        } else {
                            navigate('/student/dashboard');
                        }
                    }
                }
            } catch (err) {
                setSignupError(err.response?.data?.message || 'Something went wrong');
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setSignupError(null);
        }
    };

    const handleResendOtp = async () => {
        try {
            setSignupError(null);
            await api.post('/auth/send-otp', { email: formik.values.email, userName: formik.values.fullName });
            // Temporary generic UI message handling ideally triggers a toast
        } catch (err) {
            setSignupError('Could not resend OTP. Please try again later.');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-primary">

                {/* Progress Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {step > 1 && (
                            <button onClick={handleBack} type="button" className="text-gray-400 hover:text-text-primary transition-colors disabled:opacity-50">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <span className="font-medium text-text-primary">
                            Step {step} of 3
                        </span>
                    </div>
                    {/* Progress indicators dots */}
                    <div className="flex gap-2">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className={`h-2 rounded-full transition-all duration-300 ${step >= num ? 'w-6 bg-primary' : 'w-2 bg-gray-200'}`} />
                        ))}
                    </div>
                </div>

                <CardBody>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                            {step === 1 && "Create your Account"}
                            {step === 2 && "Choose your Path"}
                            {step === 3 && "Verify your Identity"}
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            {step === 1 && "Enter your basic personal details."}
                            {step === 2 && "Tell us how you plan to use MessConnect."}
                            {step === 3 && `We sent a code to ${formik.values.email}`}
                        </p>
                    </div>

                    {signupError && (
                        <div className="mb-4 bg-red-50 p-3 rounded-lg flex items-start gap-3 border border-red-100">
                            <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{signupError}</p>
                        </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); formik.validateForm().then(errors => { if (Object.keys(errors).length === 0) formik.handleSubmit(e) }) }}>

                        {/* Step 1: Personal Details (SC-04 equivalent) */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <Input
                                    id="fullName"
                                    label="Full Name"
                                    placeholder="John Doe"
                                    {...formik.getFieldProps('fullName')}
                                    error={formik.touched.fullName && formik.errors.fullName}
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    label="Email Address"
                                    placeholder="john@college.edu"
                                    {...formik.getFieldProps('email')}
                                    error={formik.touched.email && formik.errors.email}
                                />
                                <Input
                                    id="phone"
                                    label="Phone Number"
                                    placeholder="10-digit mobile number"
                                    {...formik.getFieldProps('phone')}
                                    error={formik.touched.phone && formik.errors.phone}
                                />
                                <Input
                                    id="password"
                                    type="password"
                                    label="Password"
                                    placeholder="Minimum 8 characters"
                                    {...formik.getFieldProps('password')}
                                    error={formik.touched.password && formik.errors.password}
                                />
                            </div>
                        )}

                        {/* Step 2: Role Selection (SC-05) */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div
                                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${formik.values.role === 'student' ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    onClick={() => formik.setFieldValue('role', 'student')}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${formik.values.role === 'student' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <User size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-text-primary">I am a Student</h4>
                                            <p className="text-sm text-text-secondary">Looking for mess subscriptions and dining options.</p>
                                        </div>
                                        {formik.values.role === 'student' && <CheckCircle2 className="text-primary w-6 h-6" />}
                                    </div>
                                </div>

                                <div
                                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${formik.values.role === 'owner' ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    onClick={() => formik.setFieldValue('role', 'owner')}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${formik.values.role === 'owner' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <Building2 size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-text-primary">I'm a Mess Owner</h4>
                                            <p className="text-sm text-text-secondary">Managing a mess, menus, and incoming subscribers.</p>
                                        </div>
                                        {formik.values.role === 'owner' && <CheckCircle2 className="text-primary w-6 h-6" />}
                                    </div>
                                </div>
                                {formik.touched.role && formik.errors.role && (
                                    <p className="text-sm text-red-500 mt-2 text-center">{formik.errors.role}</p>
                                )}
                            </div>
                        )}

                        {/* Step 3: OTP Verification (SC-06) */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center">
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="• • • • • •"
                                    className="text-center text-2xl tracking-[0.5em] w-3/4 mx-auto"
                                    maxLength="6"
                                    {...formik.getFieldProps('otp')}
                                    error={formik.touched.otp && formik.errors.otp}
                                />
                                <div className="text-center text-sm text-text-secondary">
                                    Didn't receive the code?{' '}
                                    <button type="button" onClick={handleResendOtp} className="font-medium text-primary hover:text-primary-dark ml-1">
                                        Resend Code
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8">
                            <Button
                                type="button"
                                onClick={() => formik.validateForm().then(errors => {
                                    // Custom manual stepping logic handling object scope validation
                                    let hasError = false;
                                    if (step === 1 && (errors.fullName || errors.email || errors.phone || errors.password)) hasError = true;
                                    if (step === 2 && errors.role) hasError = true;
                                    if (step === 3 && errors.otp) hasError = true;

                                    // Mark all touched for current step
                                    if (step === 1) formik.setTouched({ fullName: true, email: true, phone: true, password: true });
                                    if (step === 2) formik.setTouched({ role: true });
                                    if (step === 3) formik.setTouched({ otp: true });

                                    if (!hasError) formik.handleSubmit();
                                })}
                                className="w-full flex items-center justify-center gap-2"
                                isLoading={formik.isSubmitting}
                            >
                                {step === 3 ? 'Complete Verification' : 'Continue'}
                                {step !== 3 && <ArrowRight size={18} />}
                            </Button>
                        </div>
                    </form>
                </CardBody>

                <CardFooter className="text-center">
                    <p className="text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                            Sign in instead
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SignupPage;
