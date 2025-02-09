// import React, { FormEvent, useState, useEffect } from 'react';
// import forgetPassword from './ForgetPassword.module.scss';
// import login from '../Login/Login.module.scss';
// import { Container, Col, Form, Row } from 'react-bootstrap';
// import logo from '../../../assets/images/dot-logo.png';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { useLanguage } from '@/hooks';
// import { NormalBtn } from '@/components';
// import toast from 'react-hot-toast';

// export default function ForgetPassword() {
//   let navigate = useNavigate();
//   const [show, setShow] = useState(false);
//   // ----------------------------- sideEffect ----------------------------- //

//   // ----------------------------- validation ----------------------------- //
//   const {
//     trigger,
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const submitHandler = async (postdata: any) => {
//     toast.success('you will receive your login credentials on your email ');

//     // notify('you will receive your login credentials on your email ', 'success');
//     navigate('/login');
//   };
//   //----------------------------- Language  -----------------------------//
//   const { t, language, toggleLanguage } = useLanguage();
//   //----------------------------- return -----------------------------//
//   return (
//     <>
//       <section className={`${forgetPassword.loginSection} vh-100 vw-100 bg-white row justify-content-center`}>
//         <Container className={`${forgetPassword.loginContainer}  `}>
//           <div className={`position-absolute bottom-0 ${language == 'ar' ? 'end' : 'start'}-0 m-4  `}>
//             <button
//               style={{ color: '#2e68ff' }}
//               className=' h6'
//               onClick={() => {
//                 toggleLanguage();
//                 const x = setTimeout(() => {
//                   trigger();
//                 }, 10);
//               }}
//             >
//               {language === 'en' ? 'عربي' : 'English'}
//             </button>
//           </div>
//           <Col className={`${forgetPassword.loginBox}`}>
//             <img src={logo} className={`${forgetPassword.logo}`} alt='logo' />
//             <Form onSubmit={handleSubmit(submitHandler)}>
//               <Form.Group
//                 className={`${language === 'en' ? `${login.formBoxEn}` : `${login.formBoxAr}`}
//                                 mb-4 `}
//                 controlId='formBasicPhone'
//               >
//                 <div className='d-flex flex-column pb-3 ps-0'>
//                   {/* <div className={`${login.signIn} `}>{t('LOGIN.SIGN_IN')}</div> */}
//                   <div className={`${login.subHeader}`}>
//                     {t('GLOBAL.NEW_TO_DOT')}
//                     <Link
//                       to={'/sign-up'}
//                       className={`${login.signUp} text-decoration-none`}
//                       style={{ color: '#004fee' }}
//                     >
//                       {t('GLOBAL.SIGN_UP')}
//                     </Link>
//                   </div>
//                 </div>{' '}
//                 <Form.Control
//                   className={` shadow-none ${errors.business_reference && 'border-danger'}`}
//                   placeholder={t('GLOBAL.BUSINESS_REFERENCE')}
//                   onKeyDown={(e: any) => {
//                     const charCode = e.which ? e.which : e.keyCode;
//                     if (/\p{Script=Arabic}/u.test(String.fromCharCode(charCode))) {
//                       e.preventDefault();
//                     }
//                   }}
//                   type='number'
//                   pattern={'[0-9]*'}
//                   inputMode={'numeric'}
//                   {...register('business_reference', {
//                     required: `${t('GLOBAL.BUSINESS_REFERENCE_REQUIRED')}`,
//                     minLength: {
//                       value: 6,
//                       message: `${t('GLOBAL.PLEASE_ENTER_6_DIGITS')}`,
//                     },
//                     maxLength: {
//                       value: 6,
//                       message: `${t('GLOBAL.PLEASE_ENTER_6_DIGITS')}`,
//                     },
//                   })}
//                 />
//                 {errors?.business_reference && typeof errors?.business_reference.message === 'string' && (
//                   <div className='d-flex text-danger'>
//                     <p className='text-start'>{errors.business_reference.message}</p>
//                   </div>
//                 )}
//               </Form.Group>
//               <Form.Group
//                 className={`${language === 'en' ? `${forgetPassword.formBoxEn}` : `${forgetPassword.formBoxAr}`}`}
//               >
//                 {/* <Form.Label htmlFor=''>{t('LOGIN.EMAIL')}</Form.Label> */}
//                 <Form.Control
//                   className={` shadow-none ${errors.email && 'border-danger'}`}
//                 //   type='email'
//                   // required
//                   placeholder={t('GLOBAL.EMAIL')}
//                   {...register('email', {
//                     required: `${t('GLOBAL.EMAIL_IS_REQUIRED')}`,
//                     pattern: {
//                       value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
//                       message: `${t('GLOBAL.EMAIL_INVALID')}`,
//                     },
//                   })}
//                 />
//                 {errors.email && typeof errors?.email.message === 'string' && (
//                   <>
//                     <div className=' d-flex text-danger'>
//                       {/* <ErrorOutlineOutlinedIcon style={{ fontSize: '18px' , marginTop:'5px'}} /> */}
//                       <p>{errors?.email.message}</p>
//                     </div>
//                   </>
//                 )}
//               </Form.Group>

//               <NormalBtn
//                 loading={show}
//                 type='submit'
//                 className={`${forgetPassword.submitBtn} bg-primary  w-100 rounded-pill py-2 ${
//                   show ? 'transparent' : 'text-white text-capitalize'
//                 }`}
//               >
//                 {t('GLOBAL.REQUEST_NEW_PASSWORD')}
//               </NormalBtn>
//             </Form>
//           </Col>
//         </Container>
//       </section>
//     </>
//   );
// }
