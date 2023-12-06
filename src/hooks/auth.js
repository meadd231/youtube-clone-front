import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

// function Auth2(ComposedClass, reload, adminRoute = null) {
//   function AuthenticationCheck(props) {
//     let user = useSelector((state) => state.user);
//     const dispatch = useDispatch();

//     // 뒤로 가기를 위한 저장소에 현재 페이지든 뭐든 집어 넣는 그런 느낌인데?
//     useEffect(() => {
//       dispatch(auth()).then(async (response) => {
//         if (await !response.payload.isAuth) {
//           if (reload) {
//             props.history.push("/register_login");
//           }
//         } else {
//           if (adminRoute && !response.payload.isAdmin) {
//             props.history.push("/");
//           } else {
//             if (reload === false) {
//               props.history.push("/");
//             }
//           }
//         }
//       });
//     }, [dispatch, props.history, user.googleAuth]);

//     return <ComposedClass {...props} user={user} />;
//   }
//   return AuthenticationCheck;
// }

/**
 * 내가 만들려는 함수의 스펙을 먼저 생각해보자. 어떤 기능이 있어야 할까?
 * 1. 우선 redux에서 token이 있는지 확인한다.
 */

function Auth(TargetComponent, reload, adminRoute = null) {
  function AuthenticationCheck(props) {
    console.log('Auth', '이건 되냐?');
    const { token } = useSelector((state) => state.user);
    console.log('token', token)
    const navigate = useNavigate();
    /**
     * 1. reload가 true라면 로그인이 필수인 것. reload가 false라면 로그인이 안 되야 하는 것으로 하자.
     */
    useEffect(() => {
      if (reload) {
        // 로그인이 필수일 때
        if (!token) {
          navigate('/login');
        }
      } else {
        // 로그인이 필요 없을 때
        if (token) {
          navigate('/');
        }
      }
    }, [token, navigate, reload]);
    return <TargetComponent {...props}/>;
  }
  return <AuthenticationCheck />;
}

export default Auth;
