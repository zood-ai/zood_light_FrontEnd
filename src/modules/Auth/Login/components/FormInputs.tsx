// import React, { FormEvent, useState, useEffect, FC } from 'react';
// import login from '../Login.module.scss';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { Container, Col, Form, Row } from 'react-bootstrap';

// import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
// import { ErrorMessage, Formik } from 'formik';
// import { FormGroupProps } from '../../types/Auth.types';
// import ErrorIcon from '@/assets/icons/ErrorIcon';
// import { useLanguage } from '@/hooks';
// import { setCookie } from '@/utils/functions';

// const FormGroup: FC<FormGroupProps> = ({
//   label = '',
//   name,
//   formik,
//   placeholder,
//   type = 'text',
//   loginSteps,
//   setLoginSteps,
// }: any) => {
//   const { language, t } = useLanguage();
//   let navigate = useNavigate();

//   return (
//     <Form.Group className={`${`${login.formBoxEn}`}`}>
//       <Form.Label className={` w-100 text-${language == 'ar' ? 'end' : 'start'}`}>
//         {label}
//         {loginSteps !== 1 && (
//           <span
//             style={{ cursor: 'pointer' }}
//             className='text-primary ms-2'
//             onClick={() => setLoginSteps(loginSteps - 1)}
//           >
//             {' '}
//             {t('GLOBAL.CHANGE')}{' '}
//           </span>
//         )}
//         {loginSteps == 1 && (
//           <span
//             style={{ cursor: 'pointer' }}
//             className='text-primary ms-2 me-2'
//             onClick={() => {
//               navigate('/sign-up');
//             }}
//           >
//             {t('GLOBAL.SIGN_UP')}
//           </span>
//         )}
//       </Form.Label>
//       <div className={`${`${login.formBoxEn}`}`}>
//         <Form.Control
//           className={`${login.formClass} ${formik.touched[name] && formik.errors[name] ? 'border-danger' : ''}`}
//           type={type}
//           placeholder={placeholder}
//           name={name}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values[name]}
//         />

//         <ErrorMessage
//           name={name}
//           render={msg => (
//             <p className={`text-danger text-${language == 'ar' ? 'end' : 'start'}`}>
//               <span className={`me-1 ms-1 text-danger `}>
//                 <ErrorIcon />
//               </span>
//               <span>{msg}</span>
//             </p>
//           )}
//         />
//       </div>
//     </Form.Group>
//   );
// };
// const FormGroupNumber: FC<FormGroupProps> = ({
//   label = '',
//   name,
//   formik,
//   placeholder,
//   type = 'text',
//   loginSteps,
//   setLoginSteps,
// }: any) => {
//   const { language, t } = useLanguage();
//   let navigate = useNavigate();

//   return (
//     <Form.Group className={`${`${login.formBoxEn}`}`}>
//       <Form.Label className={` w-100 text-${language == 'ar' ? 'end' : 'start'}`}>
//         {label}
//         {loginSteps !== 1 && (
//           <span
//             style={{ cursor: 'pointer' }}
//             className='text-primary ms-2'
//             onClick={() => setLoginSteps(loginSteps - 1)}
//           >
//             {' '}
//             {t('GLOBAL.CHANGE')}{' '}
//           </span>
//         )}
//         {loginSteps == 1 && (
//           <span
//             style={{ cursor: 'pointer' }}
//             className='text-primary ms-2 me-2'
//             onClick={() => {
//               navigate('/sign-up');
//             }}
//           >
//             {t('GLOBAL.SIGN_UP')}
//           </span>
//         )}
//       </Form.Label>
//       <div className={`${`${login.formBoxEn}`}`}>
//         <Form.Control
//           className={`${login.formClass} ${formik.touched[name] && formik.errors[name] ? 'border-danger' : ''}`}
//           type='number'
//           pattern={'[0-9]*'}
//           inputMode={'numeric'}
//           placeholder={placeholder}
//           name={name}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values[name]}
//         />

//         <ErrorMessage
//           name={name}
//           render={msg => (
//             <p className={`text-danger text-${language == 'ar' ? 'end' : 'start'}`}>
//               <span className={`me-1 ms-1 text-danger `}>
//                 <ErrorIcon />
//               </span>
//               <span>{msg}</span>
//             </p>
//           )}
//         />
//       </div>
//     </Form.Group>
//   );
// };

// interface FormGroupPasswordProps {
//   show: boolean;
//   setShow: React.Dispatch<React.SetStateAction<boolean>>;
//   formik: any;
//   label?: string;
//   loginSteps?: any;
//   setLoginSteps?: any;
// }

// const FormGroupPassword: FC<FormGroupPasswordProps> = ({
//   show,
//   setShow,
//   formik,
//   label = '',
//   loginSteps,
//   setLoginSteps,
// }: any) => {
//   const { language, t } = useLanguage();
//   let navigate = useNavigate();
//   return (
//     <Form.Group className={`${`${language == 'ar' ? login.formBoxAr : login.formBoxEn}`}`}>
//       <Form.Label>
//         {label}
//         {loginSteps !== 1 && (
//           <span
//             style={{ cursor: 'pointer' }}
//             className='text-primary ms-2'
//             onClick={() => setLoginSteps(loginSteps - 1)}
//           >
//             {' '}
//             {t('GLOBAL.CHANGE')}{' '}
//           </span>
//         )}
//       </Form.Label>{' '}
//       <div className={`position-relative ${login.passwordBox}`}>
//         <Form.Control
//           className={`${login.formClaass} ${
//             formik.touched['password'] && formik.errors['password'] ? 'border-danger' : ''
//           } `}
//           type={show ? 'password' : 'text'}
//           placeholder={t('GLOBAL.PASSWORD')}
//           name='password'
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values['password']}
//         />
//         <div className={`${login.passwordAction}`}>
//           {show ? (
//             <AiOutlineEyeInvisible
//               onClick={() => {
//                 setShow(false);
//               }}
//             />
//           ) : (
//             <AiOutlineEye
//               onClick={() => {
//                 setShow(true);
//               }}
//             />
//           )}
//         </div>
//       </div>
//       <ErrorMessage
//         name={'password'}
//         render={msg => (
//           <p className='text-danger '>
//             <span className='me-1 text-danger '>
//               <ErrorIcon />
//             </span>
//             <span>{msg}</span>
//           </p>
//         )}
//       />{' '}
//       <Row>
//         <Col className={`${login.remberme} `}>
//           {/* <Form> */}
//           <Form.Check
//             onChange={e => {
//               console.log(e.target.checked);
//               setCookie('xHmtQRRm', e.target.checked ? 'true' : 'false', 365);
//             }}
//             // className={`${login.checkmark}`}
//             type='checkbox'
//             label={t('GLOBAL.REMEMBER_ME')}
//           />
//           {/* // </Form> */}
//           {/* <label className={`${login.checkbox}`}>
//                         <input
//                             type='checkbox'
//                             // onClick={e => {
//                             //     console.log(e.target);
//                             // }}
//                         />
//                         <span className={`${login.checkmark}`}></span>
//                         {t('GLOBAL.REMEMBER_ME')}
//                     </label> */}
//         </Col>
//         <Col>
//           <div
//             style={{ color: '#2e68ff', cursor: 'pointer' }}
//             className={`${login.forgetPassword} text-end`}
//             // to='/forgetPassword'
//             onClick={() => {
//               navigate('/forget-password');
//             }}
//           >
//             {t('GLOBAL.FORGOT_PASSWORD')}
//           </div>
//         </Col>
//       </Row>
//     </Form.Group>
//   );
// };

// export { FormGroup, FormGroupPassword, FormGroupNumber };
