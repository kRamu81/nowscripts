import { Link, useNavigate } from "react-router-dom";
import { emailIcon, googleIcon } from "../assets/icons";
import { BrandIconOnly } from "./BrandLogo";

type SignInBoxType = {
  message?: string;
  typeOfLogin: string;
};

const SIGNIN_OPTIONS = [
  {
    id: 1,
    title: "with Google",
    handler: "Google",
    image: googleIcon,
  },
  {
    id: 2,
    title: "with email",
    handler: "mail",
    image: emailIcon,
  },
];

import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { url } from '../baseUrl';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';

export default function SignInBox({ message, typeOfLogin }: SignInBoxType) {
  const navigate = useNavigate();
  const { handleUser } = useAuth();
  const [, setRefreshToken] = useLocalStorage<string | undefined>("refresh_token", undefined);
  const [, setAccessToken] = useLocalStorage<string | undefined>("access_token", undefined);
  const [, setUser] = useLocalStorage<any>("user", undefined);

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${url}/auth/google/direct`, {
          access_token: tokenResponse.access_token
        });
        
        if (res.data.access_token) {
          setAccessToken(res.data.access_token);
          setRefreshToken(res.data.refresh_token);
          setUser(res.data);
          handleUser(res.data);
          
          const redirectPath = localStorage.getItem("redirect_after_login") || "/";
          localStorage.removeItem("redirect_after_login");
          navigate(redirectPath);
        }
      } catch (error) {
        console.error("Google authentication failed", error);
      }
    },
    onError: () => {
      console.error("Google Login Failed");
    }
  });

  function handleEmailLogin() {}
  return (
    <div className="w-[95%] sm:w-full max-w-[420px] mx-auto flex flex-col items-center gap-4 py-12 md:py-16 bg-white rounded-2xl px-6" style={{
        boxShadow: "0px 4px 24px rgba(0,0,0,0.06)"
    }}>
      <BrandIconOnly className="mb-2 h-12 md:h-14" />
      <p className="font-serif text-2xl md:text-[28px] mb-8 text-center">
        {message}
      </p>
      {SIGNIN_OPTIONS.map((item) => {
        return (
          <ButtonLoginWith
            image={item.image}
            key={item.id}
            onClick={
              item.handler == "Google" ? handleGoogleAuth : handleEmailLogin
            }
            text={typeOfLogin + " " + item.title}
          />
        );
      })}
      {typeOfLogin === "Sign in" ? (
        <p style={{ marginTop: "22px", color: "#5c5c5c" }}>
          No account?{" "}
          <Link
            style={{
              color: "#1a8917",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "14px",
            }}
            to="/signin/new"
          >
            Create one
          </Link>
        </p>
      ) : (
        <p style={{ marginTop: "22px", color: "#5c5c5c" }}>
          Already have an account?{" "}
          <Link
            style={{
              color: "#1a8917",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "14px",
            }}
            to="/signin/in"
          >
            Sign in
          </Link>
        </p>
      )}

      <p
        style={{
          fontSize: "13px",
          color: "gray",
          width: "78%",
          textAlign: "center",
          lineHeight: "22px",
          marginTop: "22px",
        }}
      >
        Click “{typeOfLogin}” to agree to NowScripts's Terms of Service and
        acknowledge that NowScripts's Privacy Policy applies to you.
      </p>
    </div>
  );
}

function ButtonLoginWith({
  image,
  onClick,
  text,
}: {
  onClick(): void;
  text: string;
  image: any;
}) {
  return (
    <button
      className="w-full sm:max-w-[300px] bg-transparent flex flex-row items-center justify-center p-3 rounded-2xl border border-slate-300 hover:bg-slate-50 transition-colors gap-3 cursor-pointer text-slate-700 font-medium"
      onClick={() => {
        onClick();
      }}
    >
      {image}
      {text}
    </button>
  );
}
