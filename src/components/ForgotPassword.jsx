import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "./Loader"; 

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const onEmailSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://todolist-server-api.onrender.com/todoList/forgot-password",
        { email }
      );
      console.log(res.data);
      toast.success("Verification code sent to your email.");
      setStep(2);
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
      toast.error(err.message || "An error occured in sending your email");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyAndReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://todolist-server-api.onrender.com/todoList/reset-password",
        { email, verificationCode, newPassword }
      );
      console.log(res.data);
      toast.success("Password reset successfully!");
      navigate("/todoList/login");
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
      toast.error(err.response?.data?.msg || "An error occurred, pls try again");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="forgot-password">
  <section>
    <div className="bg-gray-400 h-screen w-screen flex justify-center min-h-[100vh] items-center">
      <div className="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4">
        <div className="flex flex-col">
          <div>
            <h2 className="text-4xl text-blue-600">Reset Password</h2>
          </div>
        </div>
        {step === 1 ? (
          <form onSubmit={onEmailSubmit}>
            <p>Pls enter your email to verify it's you</p>
            <div className="mt-4 space-y-6">
              <div className="col-span-full">
                <label className="block mb-3 text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="block w-full px-6 py-3 text-blue-600 bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="col-span-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="items-center cursor-pointer justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-blue-600 border-2 border-blue-600 rounded-full inline-flex hover:bg-transparent hover:border-blue-600 hover:text-blue-600 focus:outline-none focus-visible:outline-blue-600 focus-visible:ring-blue-600 font-bold text-2xl"
                >{loading ? <Loader /> : "Send Verification Code"}</button>
              </div>
              
            </div>
          </form>
        ) : (
          <form onSubmit={onVerifyAndReset}>
            <div className="mt-4 space-y-6">
              <div className="col-span-full">
                <label className="block mb-3 text-sm font-medium text-gray-600">Verification Code</label>
                <input
                  type="text"
                  placeholder="Enter verification code"
                  className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-full">
                <label className="block mb-3 text-sm font-medium text-gray-600">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="col-span-full">
                <button
                  type="submit"
                  className="items-center cursor-pointer justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full inline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
                >{loading ? <Loader /> : "Reset Password"}</button>
              </div>
            </div>
          </form>
        )}
        <button className="btn bg-rose-500 mt-5 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"><NavLink to='/todoList/login'>Cancel</NavLink></button>
      </div>
    </div>
  </section>
</div>

  );
};

export default ForgotPassword;
