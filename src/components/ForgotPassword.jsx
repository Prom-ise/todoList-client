import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPassword = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // To track which step of the process we're on

  const onEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://todolist-server-api.onrender.com/todoList/forgot-password",
        { email }
      );
      console.log(res.data);
      toast.success("Verification code sent to your email.");
      setStep(2); // Move to the next step
    } catch (err) {
      console.error(err.response.data);
      toast.error(err.response.data);
    }
  };

  const onVerifyAndReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://todolist-server-api.onrender.com/todoList/reset-password",
        { email, verificationCode, newPassword }
      );
      console.log(res.data);
      toast.success("Password reset successfully!");
      navigate("/todoList/login");
      // Optionally redirect to login page or reset the form
    } catch (err) {
      console.error(err.response.data);
      toast.error(err.response.data.msg || "An error occurred");
    }
  };

  return (
    // <div className="forgot-password">
    //   {step === 1 ? (
    //     <form onSubmit={onEmailSubmit}>
    //       <input
    //         type="email"
    //         placeholder="Enter your email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //       <input type="submit" value="Send Verification Code" />
    //     </form>
    //   ) : (
    //     <form onSubmit={onVerifyAndReset}>
    //       <input
    //         type="text"
    //         placeholder="Enter verification code"
    //         value={verificationCode}
    //         onChange={(e) => setVerificationCode(e.target.value)}
    //         required
    //       />
    //       <input
    //         type="password"
    //         placeholder="Enter new password"
    //         value={newPassword}
    //         onChange={(e) => setNewPassword(e.target.value)}
    //         required
    //       />
    //       <input type="submit" value="Reset Password" />
    //     </form>
    //   )}
    // </div>
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
                  required
                />
              </div>
              <div className="col-span-full">
                <input
                  type="submit"
                  value="Send Verification Code"
                  className="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-blue-600 border-2 border-blue-600 rounded-full inline-flex hover:bg-transparent hover:border-blue-600 hover:text-blue-600 focus:outline-none focus-visible:outline-blue-600 focus-visible:ring-blue-600 font-bold text-2xl"
                />
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
                  required
                />
              </div>
              <div className="col-span-full">
                <input
                  type="submit"
                  value="Reset Password"
                  className="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full inline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  </section>
  <button className="btn bg-rose-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"><NavLink to='/todoList/login'>Cancel</NavLink></button>
</div>

  );
};

export default ForgotPassword;
